import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { usersDb, AppUser } from "../lib/db";

interface AuthContextType {
  user: AppUser | null;
  authLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  // legacy compat
  login: (user: AppUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profileFromDb = await usersDb.getById(firebaseUser.uid);
        const profile: AppUser = profileFromDb ?? {
          id: firebaseUser.uid,
          name: firebaseUser.displayName ?? firebaseUser.email?.split("@")[0] ?? "User",
          avatar:
            firebaseUser.photoURL ??
            `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName ?? "U")}&background=7C3AED&color=fff&size=400&bold=true`,
          bio: "",
          email: firebaseUser.email ?? "",
        };
        if (!profileFromDb) await usersDb.upsert(profile);
        setUser(profile);
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

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // legacy compat for any code calling login(user)
  const login = (u: AppUser) => setUser(u);

  return (
    <AuthContext.Provider value={{ user, authLoading, signIn, signUp, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
