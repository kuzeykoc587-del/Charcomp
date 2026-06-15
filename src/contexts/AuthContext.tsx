import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithRedirect,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { usersDb, AppUser } from "../lib/db";
import { resolveRole, getRoleInfo, type UserRole, type RoleInfo } from "../lib/roles";

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
  try {
    const fromDb = await withTimeout(
      usersDb.getById(firebaseUser.uid),
      FIRESTORE_TIMEOUT_MS,
      "Firestore getById"
    );
    if (fromDb) {
      if (!fromDb.createdAt) {
        const withCreatedAt = { ...fromDb, createdAt: firebaseUser.metadata.creationTime ?? new Date().toISOString() };
        withTimeout(usersDb.upsert(withCreatedAt), FIRESTORE_TIMEOUT_MS, "Firestore upsert createdAt").catch(() => {});
        return withCreatedAt;
      }
      return fromDb;
    }

    const profile: AppUser = {
      ...minimalProfile(firebaseUser),
      createdAt: firebaseUser.metadata.creationTime ?? new Date().toISOString(),
    };
    withTimeout(usersDb.upsert(profile), FIRESTORE_TIMEOUT_MS, "Firestore upsert").catch(
      (e) => console.error("[CharComp] Could not persist profile (non-fatal):", e)
    );
    return profile;
  } catch (err) {
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
        setAuthError(msg);
        finish();
      }
    }, AUTH_SAFETY_TIMEOUT_MS);

    const unsub = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        clearTimeout(safetyTimer);
        if (firebaseUser) {
          const profile = await buildProfile(firebaseUser);
          setUser(profile);
        } else {
          setUser(null);
        }
        finish();
      },
      (err) => {
        console.error("[CharComp] onAuthStateChanged error:", err);
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
    await signInWithRedirect(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
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
