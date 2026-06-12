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
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const buildProfile = async (firebaseUser: import("firebase/auth").User): Promise<AppUser> => {
  const profileFromDb = await usersDb.getById(firebaseUser.uid);
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
  if (!profileFromDb) await usersDb.upsert(profile);
  return profile;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await buildProfile(firebaseUser);
          setUser(profile);
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    return unsub;
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
    <AuthContext.Provider value={{ user, authLoading, signIn, signUp, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
