import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithRedirect,
  signInWithPopup,
  getRedirectResult,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { usersDb, AppUser } from "../lib/db";
import { resolveRole, getRoleInfo, type UserRole, type RoleInfo } from "../lib/roles";

// ── Auth Diagnostics ──────────────────────────────────────────────────────────
// Stored at module level so they survive across re-renders and can be read
// by the admin diagnostic panel without adding them to React state.
export interface AuthDiagnostics {
  projectId: string;
  authDomain: string;
  currentUrl: string;
  firebaseUserUid: string | null;
  firebaseUserEmail: string | null;
  onAuthStateChangedFired: boolean;
  lastGoogleLoginMethod: "popup" | "redirect" | null;
  redirectResultCalled: boolean;
  redirectResultStatus: "not_called" | "null" | "success" | "error";
  lastAuthErrorCode: string | null;
  lastAuthErrorMessage: string | null;
  firestoreUpsertStatus: "not_called" | "success" | "failed";
  firestoreReadStatus: "not_called" | "success" | "failed";
  finalAppUserState: "logged_out" | "firebase_user_only" | "app_user_loaded" | "profile_error";
}

const _diag: AuthDiagnostics = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "(not set)",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "(not set)",
  currentUrl: typeof window !== "undefined" ? window.location.href : "",
  firebaseUserUid: null,
  firebaseUserEmail: null,
  onAuthStateChangedFired: false,
  lastGoogleLoginMethod: null,
  redirectResultCalled: false,
  redirectResultStatus: "not_called",
  lastAuthErrorCode: null,
  lastAuthErrorMessage: null,
  firestoreUpsertStatus: "not_called",
  firestoreReadStatus: "not_called",
  finalAppUserState: "logged_out",
};

export function getAuthDiagnostics(): AuthDiagnostics {
  return { ..._diag, currentUrl: typeof window !== "undefined" ? window.location.href : "" };
}

function diagLog(msg: string) {
  console.log(`[AUTH] ${msg}`);
}

// ── Context types ─────────────────────────────────────────────────────────────
interface AuthContextType {
  user: AppUser | null;
  authLoading: boolean;
  authError: string | null;
  roleInfo: RoleInfo | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const FIRESTORE_TIMEOUT_MS = 5000;
const AUTH_SAFETY_TIMEOUT_MS = 10000;

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    ),
  ]);
}

function isMobileBrowser(): boolean {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function minimalProfile(firebaseUser: import("firebase/auth").User): AppUser {
  return {
    id: firebaseUser.uid,
    name:
      firebaseUser.displayName ??
      firebaseUser.email?.split("@")[0] ??
      "User",
    avatar:
      firebaseUser.photoURL ??
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        firebaseUser.displayName ?? "U"
      )}&background=7C3AED&color=fff&size=400&bold=true`,
    bio: "",
    email: firebaseUser.email ?? "",
  };
}

async function buildProfile(
  firebaseUser: import("firebase/auth").User
): Promise<AppUser> {
  _diag.firestoreReadStatus = "not_called";
  _diag.firestoreUpsertStatus = "not_called";

  try {
    _diag.firestoreReadStatus = "not_called";
    const fromDb = await withTimeout(
      usersDb.getById(firebaseUser.uid),
      FIRESTORE_TIMEOUT_MS,
      "Firestore getById"
    );
    _diag.firestoreReadStatus = "success";
    diagLog(`Firestore profile read success (exists=${!!fromDb})`);

    if (fromDb) {
      const merged: AppUser = {
        ...fromDb,
        email: fromDb.email || firebaseUser.email || "",
      };
      if (!merged.createdAt) {
        const withCreatedAt = { ...merged, createdAt: firebaseUser.metadata.creationTime ?? new Date().toISOString() };
        withTimeout(
          usersDb.upsert(withCreatedAt),
          FIRESTORE_TIMEOUT_MS,
          "Firestore upsert createdAt"
        ).then(() => {
          _diag.firestoreUpsertStatus = "success";
          diagLog("Firestore upsert (createdAt patch) success");
        }).catch((e) => {
          _diag.firestoreUpsertStatus = "failed";
          diagLog(`Firestore upsert (createdAt patch) failed: ${e}`);
        });
        return withCreatedAt;
      }
      return merged;
    }

    const profile: AppUser = {
      ...minimalProfile(firebaseUser),
      createdAt: firebaseUser.metadata.creationTime ?? new Date().toISOString(),
    };

    diagLog("profile upsert started (new user)");
    withTimeout(usersDb.upsert(profile), FIRESTORE_TIMEOUT_MS, "Firestore upsert").then(() => {
      _diag.firestoreUpsertStatus = "success";
      diagLog("profile upsert success");
    }).catch((e) => {
      _diag.firestoreUpsertStatus = "failed";
      diagLog(`profile upsert failed: ${e}`);
      console.error("[CharComp] Could not persist profile (non-fatal):", e);
    });

    return profile;
  } catch (err) {
    _diag.firestoreReadStatus = "failed";
    diagLog(`Firestore unreachable — using minimal profile. Error: ${err}`);
    console.error(
      "[CharComp] Firestore unreachable — using minimal profile. " +
      "Check Firestore rules and network.",
      err
    );
    return minimalProfile(firebaseUser);
  }
}

function computeRoleInfo(user: AppUser | null): RoleInfo | null {
  if (!user) return null;
  const role: UserRole = resolveRole(user.id, user.email, user.createdAt, user.role);
  return getRoleInfo(role);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const roleInfo = computeRoleInfo(user);

  useEffect(() => {
    let settled = false;

    function finish() {
      if (!settled) {
        settled = true;
        setAuthLoading(false);
      }
    }

    const safetyTimer = setTimeout(() => {
      if (!settled) {
        const msg =
          "Firebase Auth did not respond within 10 s. " +
          "Verify all VITE_FIREBASE_* env vars are set in Vercel → Settings → Environment Variables " +
          "and your domain is listed in Firebase Console → Authentication → Authorized Domains.";
        console.error("[CharComp]", msg);
        _diag.lastAuthErrorMessage = msg;
        setAuthError(msg);
        finish();
      }
    }, AUTH_SAFETY_TIMEOUT_MS);

    // ── Handle pending redirect result ────────────────────────────────────────
    // This MUST be called on every page load when using signInWithRedirect.
    // On redirect-back, calling getRedirectResult() completes the sign-in and
    // triggers onAuthStateChanged. Without this, the auth state is never updated.
    diagLog("checking getRedirectResult");
    _diag.redirectResultCalled = true;
    _diag.redirectResultStatus = "not_called";

    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          _diag.redirectResultStatus = "success";
          _diag.firebaseUserUid = result.user.uid;
          _diag.firebaseUserEmail = result.user.email;
          diagLog(`redirect result received — uid=${result.user.uid}`);
          // onAuthStateChanged will also fire, but explicitly set user here
          // to avoid race conditions where onAuthStateChanged fires first with null.
          buildProfile(result.user).then((profile) => {
            _diag.finalAppUserState = "app_user_loaded";
            diagLog(`app user loaded from redirect result — email=${profile.email}`);
            setUser(profile);
          }).catch((err) => {
            _diag.finalAppUserState = "profile_error";
            diagLog(`profile build failed after redirect: ${err}`);
            setUser(minimalProfile(result.user));
          });
        } else {
          _diag.redirectResultStatus = "null";
          diagLog("redirect result null (no pending redirect)");
        }
      })
      .catch((err: unknown) => {
        const code = (err as { code?: string }).code ?? "";
        _diag.lastAuthErrorCode = code;
        _diag.lastAuthErrorMessage = (err as Error).message ?? "";
        // auth/no-auth-event is expected when there is no pending redirect.
        if (code && code !== "auth/no-auth-event") {
          _diag.redirectResultStatus = "error";
          diagLog(`redirect result error: code=${code} msg=${(err as Error).message}`);
          console.error("[CharComp] Google redirect error:", err);
          setAuthError((err as Error).message ?? "Google ile giriş başarısız.");
        } else {
          _diag.redirectResultStatus = "null";
          diagLog(`redirect result — no pending redirect (code=${code})`);
        }
      });

    // ── Auth state listener ───────────────────────────────────────────────────
    const unsub = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        clearTimeout(safetyTimer);
        _diag.onAuthStateChangedFired = true;
        diagLog(`onAuthStateChanged fired — user=${firebaseUser?.uid ?? "null"}`);

        if (firebaseUser) {
          _diag.firebaseUserUid = firebaseUser.uid;
          _diag.firebaseUserEmail = firebaseUser.email;
          diagLog(`firebase user detected — uid=${firebaseUser.uid} email=${firebaseUser.email}`);
          _diag.finalAppUserState = "firebase_user_only";

          try {
            const profile = await buildProfile(firebaseUser);
            _diag.finalAppUserState = "app_user_loaded";
            diagLog(`app user loaded — email=${profile.email} role=${profile.role ?? "none"}`);
            setUser(profile);
          } catch (profileErr) {
            _diag.finalAppUserState = "profile_error";
            diagLog(`profile build failed, using minimal: ${profileErr}`);
            // Keep Firebase user even if Firestore profile fails
            setUser(minimalProfile(firebaseUser));
          }
        } else {
          _diag.firebaseUserUid = null;
          _diag.firebaseUserEmail = null;
          _diag.finalAppUserState = "logged_out";
          diagLog("final state: logged_out");
          setUser(null);
        }
        finish();
      },
      (err) => {
        console.error("[CharComp] onAuthStateChanged error:", err);
        _diag.lastAuthErrorCode = (err as { code?: string }).code ?? null;
        _diag.lastAuthErrorMessage = err.message;
        clearTimeout(safetyTimer);
        setAuthError(err.message);
        finish();
      }
    );

    return () => {
      clearTimeout(safetyTimer);
      unsub();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    diagLog(`email/password sign-in success — uid=${cred.user.uid}`);
    setUser(minimalProfile(cred.user));
    buildProfile(cred.user).then(setUser).catch(() => {});
  };

  const signUp = async (email: string, password: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=7C3AED&color=fff&size=400&bold=true`;
    await updateProfile(cred.user, { displayName: name, photoURL: avatar });
    const profile: AppUser = {
      id: cred.user.uid,
      name,
      avatar,
      bio: "",
      email,
      createdAt: new Date().toISOString(),
    };
    setUser(profile);
    usersDb.upsert(profile).catch((e) =>
      console.error("[CharComp] signUp Firestore upsert failed (non-fatal):", e)
    );
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    if (isMobileBrowser()) {
      diagLog("using redirect (mobile browser detected)");
      _diag.lastGoogleLoginMethod = "redirect";
      // On mobile, popups are unreliable — use redirect.
      // getRedirectResult() on the next page load will complete the sign-in.
      await signInWithRedirect(auth, provider);
      return;
    }

    diagLog("using popup (desktop)");
    _diag.lastGoogleLoginMethod = "popup";

    try {
      const result = await signInWithPopup(auth, provider);
      diagLog(`popup success — uid=${result.user.uid}`);
      // onAuthStateChanged fires automatically; also set user right away
      // so the UI doesn't wait for the next auth cycle.
      const profile = await buildProfile(result.user);
      _diag.finalAppUserState = "app_user_loaded";
      diagLog(`app user loaded after popup — email=${profile.email}`);
      setUser(profile);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      _diag.lastAuthErrorCode = code;
      _diag.lastAuthErrorMessage = (err as Error).message ?? "";
      if (code === "auth/popup-blocked" || code === "auth/popup-closed-by-user") {
        diagLog(`popup blocked/closed (code=${code}), falling back to redirect`);
        _diag.lastGoogleLoginMethod = "redirect";
        await signInWithRedirect(auth, provider);
      } else {
        diagLog(`popup error: code=${code}`);
        throw err;
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
    _diag.finalAppUserState = "logged_out";
    _diag.firebaseUserUid = null;
    _diag.firebaseUserEmail = null;
    diagLog("user signed out");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, authLoading, authError, roleInfo, signIn, signUp, signInWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
