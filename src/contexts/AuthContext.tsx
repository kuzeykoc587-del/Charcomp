import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { usersDb, AppUser } from "../lib/db";

interface AuthContextType {
  user: AppUser | null;
  authLoading: boolean;
  authError: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PROFILE_TIMEOUT_MS = 6000;
const AUTH_SAFETY_TIMEOUT_MS = 10000;

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    ),
  ]);
}

const buildProfile = async (firebaseUser: import("firebase/auth").User): Promise<AppUser> => {
  const profileFromDb = await withTimeout(
    usersDb.getById(firebaseUser.uid),
    PROFILE_TIMEOUT_MS,
    "Firestore getById"
  );
  const profile: AppUser = profileFromDb ?? {
    id: firebaseUser.uid,
    name: firebaseUser.displayName ?? firebaseUser.email?.split("@")[0] ?? "User",
    avatar:
      firebaseUser.photoURL ??
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        firebaseUser.displayName ?? "U"
      )}&background=7C3AED&color=fff&size=400&bold=true`,
    bio: "",
    email: firebaseUser.email ?? "",
  };
  if (!profileFromDb) {
    try {
      await withTimeout(usersDb.upsert(profile), PROFILE_TIMEOUT_MS, "Firestore upsert");
    } catch (e) {
      console.error("[CharComp] Could not persist user profile (non-fatal):", e);
    }
  }
  return profile;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let settled = false;

    function finish() {
      if (!settled) {
        settled = true;
        setAuthLoading(false);
      }
    }

    // Safety net: if onAuthStateChanged never fires (Firebase blocked, network issue, etc.)
    // force the loading state off so the app doesn't hang forever.
    const safetyTimer = setTimeout(() => {
      if (!settled) {
        console.error(
          "[CharComp] Firebase Auth did not respond within 10s. " +
          "Check that VITE_FIREBASE_* env vars are set in Vercel and the site domain " +
          "is listed in Firebase Console → Authentication → Authorized domains."
        );
        setAuthError(
          "Firebase Auth did not respond. Check your Vercel environment variables and Firebase authorized domains."
        );
        finish();
      }
    }, AUTH_SAFETY_TIMEOUT_MS);

    const unsub = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        clearTimeout(safetyTimer);
        if (firebaseUser) {
          try {
            const profile = await buildProfile(firebaseUser);
            setUser(profile);
          } catch (err) {
            console.error("[CharComp] Failed to load user profile:", err);
            setUser(null);
          }
        } else {
          setUser(null);
        }
        finish();
      },
      (err) => {
        // Firebase Auth itself threw — still unblock the app
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
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7C3AED&color=fff&size=400&bold=true`;
    await updateProfile(cred.user, { displayName: name, photoURL: avatar });
    const profile: AppUser = { id: cred.user.uid, name, avatar, bio: "", email };
    await usersDb.upsert(profile);
    setUser(profile);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const cred = await signInWithPopup(auth, provider);
    const profile = await buildProfile(cred.user);
    setUser(profile);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, authError, signIn, signUp, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
