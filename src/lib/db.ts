import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, setDoc, increment, Timestamp,
  writeBatch, serverTimestamp, startAfter, QueryDocumentSnapshot,
  DocumentData, runTransaction
} from "firebase/firestore";
import { db as firestore } from "./firebase";
import type { SeriesCategory } from "./seedData";

// ── Shared types ──────────────────────────────────────────────────────────────

export interface Universe {
  id: string;
  name: string;
  description: string;
  category: SeriesCategory;
  coverImage: string;
  characterCount: number;
  creatorId: string;
  createdAt: string;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  image: string;
  seriesId: string;
  tags: string[];
  creatorId: string;
  createdAt: string;
}

export interface TestStats {
  totalPlays: number;
  completedPlays: number;
  mostSelectedCharacterId?: string;
  leastSelectedCharacterId?: string;
  championHistory: string[];
  matchupStats: Record<string, { wins: number; losses: number }>;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  creatorId: string;
  language: "tr" | "en";
  characterIds: string[];
  playCount: number;
  likeCount: number;
  favoriteCount: number;
  createdAt: string;
  stats: TestStats;
}

export interface Duel {
  id: string;
  characterAId: string;
  characterBId: string;
  votesA: number;
  votesB: number;
  creatorId: string;
  createdAt: string;
}

export interface AppUser {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  email: string;
}

export interface FavoriteItem {
  itemId: string;
  itemType: "test" | "universe" | "character";
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const fromDoc = <T>(snap: QueryDocumentSnapshot<DocumentData>): T =>
  ({ id: snap.id, ...snap.data() } as T);

const ts = () => new Date().toISOString();

// ── Universes ─────────────────────────────────────────────────────────────────

export const universesDb = {
  getAll: async (filters?: { category?: SeriesCategory; search?: string }): Promise<Universe[]> => {
    const col = collection(firestore, "universes");
    let q = query(col, orderBy("name"));
    const snap = await getDocs(q);
    let results = snap.docs.map(d => fromDoc<Universe>(d));
    if (filters?.category) results = results.filter(u => u.category === filters.category);
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      results = results.filter(u => u.name.toLowerCase().includes(s) || u.description.toLowerCase().includes(s));
    }
    return results;
  },

  getById: async (id: string): Promise<Universe | null> => {
    const snap = await getDoc(doc(firestore, "universes", id));
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as Universe) : null;
  },

  create: async (data: Omit<Universe, "id" | "createdAt" | "characterCount">): Promise<string> => {
    const ref = await addDoc(collection(firestore, "universes"), {
      ...data, characterCount: 0, createdAt: ts()
    });
    return ref.id;
  },

  update: async (id: string, data: Partial<Omit<Universe, "id">>): Promise<void> => {
    await updateDoc(doc(firestore, "universes", id), data);
  },

  delete: async (id: string): Promise<void> => {
    await deleteDoc(doc(firestore, "universes", id));
  },

  incrementCharacterCount: async (id: string, delta: number): Promise<void> => {
    await updateDoc(doc(firestore, "universes", id), { characterCount: increment(delta) });
  },
};

// ── Characters ────────────────────────────────────────────────────────────────

export const charactersDb = {
  getAll: async (filters?: { seriesId?: string; search?: string }): Promise<Character[]> => {
    const col = collection(firestore, "characters");
    let q = filters?.seriesId
      ? query(col, where("seriesId", "==", filters.seriesId))
      : query(col, orderBy("name"));
    const snap = await getDocs(q);
    let results = snap.docs.map(d => fromDoc<Character>(d));
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      results = results.filter(c => c.name.toLowerCase().includes(s));
    }
    return results;
  },

  getById: async (id: string): Promise<Character | null> => {
    const snap = await getDoc(doc(firestore, "characters", id));
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as Character) : null;
  },

  getManyByIds: async (ids: string[]): Promise<Character[]> => {
    if (!ids.length) return [];
    const chunks: string[][] = [];
    for (let i = 0; i < ids.length; i += 10) chunks.push(ids.slice(i, i + 10));
    const results: Character[] = [];
    for (const chunk of chunks) {
      const q = query(collection(firestore, "characters"), where("__name__", "in", chunk));
      const snap = await getDocs(q);
      results.push(...snap.docs.map(d => fromDoc<Character>(d)));
    }
    return results;
  },

  create: async (data: Omit<Character, "id" | "createdAt">): Promise<string> => {
    const ref = await addDoc(collection(firestore, "characters"), { ...data, createdAt: ts() });
    await universesDb.incrementCharacterCount(data.seriesId, 1);
    return ref.id;
  },

  createWithId: async (id: string, data: Omit<Character, "id">): Promise<void> => {
    await setDoc(doc(firestore, "characters", id), data);
  },

  update: async (id: string, data: Partial<Omit<Character, "id">>): Promise<void> => {
    await updateDoc(doc(firestore, "characters", id), data);
  },

  delete: async (id: string): Promise<void> => {
    const char = await charactersDb.getById(id);
    await deleteDoc(doc(firestore, "characters", id));
    if (char) await universesDb.incrementCharacterCount(char.seriesId, -1);
  },

  checkDuplicate: async (name: string, seriesId: string): Promise<boolean> => {
    const q = query(
      collection(firestore, "characters"),
      where("seriesId", "==", seriesId),
      where("name", "==", name)
    );
    const snap = await getDocs(q);
    return !snap.empty;
  },
};

// ── Tests ─────────────────────────────────────────────────────────────────────

export const testsDb = {
  getAll: async (filters?: {
    sort?: "popular" | "new" | "trending";
    search?: string;
    limit?: number;
  }): Promise<Test[]> => {
    const col = collection(firestore, "tests");
    const lim = filters?.limit ?? 50;
    let q = query(col, orderBy("playCount", "desc"), limit(lim));
    if (filters?.sort === "new") q = query(col, orderBy("createdAt", "desc"), limit(lim));
    if (filters?.sort === "trending") q = query(col, orderBy("likeCount", "desc"), limit(lim));
    const snap = await getDocs(q);
    let results = snap.docs.map(d => fromDoc<Test>(d));
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      results = results.filter(t => t.title.toLowerCase().includes(s) || t.description.toLowerCase().includes(s));
    }
    return results;
  },

  getById: async (id: string): Promise<Test | null> => {
    const snap = await getDoc(doc(firestore, "tests", id));
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as Test) : null;
  },

  getByCreator: async (creatorId: string): Promise<Test[]> => {
    const q = query(collection(firestore, "tests"), where("creatorId", "==", creatorId));
    const snap = await getDocs(q);
    return snap.docs.map(d => fromDoc<Test>(d));
  },

  create: async (data: Omit<Test, "id" | "createdAt" | "playCount" | "likeCount" | "favoriteCount" | "stats">): Promise<string> => {
    const ref = await addDoc(collection(firestore, "tests"), {
      ...data,
      playCount: 0, likeCount: 0, favoriteCount: 0,
      createdAt: ts(),
      stats: { totalPlays: 0, completedPlays: 0, championHistory: [], matchupStats: {} }
    });
    return ref.id;
  },

  update: async (id: string, data: Partial<Omit<Test, "id">>): Promise<void> => {
    await updateDoc(doc(firestore, "tests", id), data);
  },

  delete: async (id: string): Promise<void> => {
    await deleteDoc(doc(firestore, "tests", id));
  },

  incrementPlayCount: async (id: string): Promise<void> => {
    await updateDoc(doc(firestore, "tests", id), { playCount: increment(1) });
  },
};

// ── Duels ─────────────────────────────────────────────────────────────────────

export const duelsDb = {
  getAll: async (): Promise<Duel[]> => {
    const snap = await getDocs(collection(firestore, "duels"));
    return snap.docs.map(d => fromDoc<Duel>(d));
  },

  getById: async (id: string): Promise<Duel | null> => {
    const snap = await getDoc(doc(firestore, "duels", id));
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as Duel) : null;
  },

  create: async (data: Omit<Duel, "id" | "createdAt" | "votesA" | "votesB">): Promise<string> => {
    const ref = await addDoc(collection(firestore, "duels"), {
      ...data, votesA: 0, votesB: 0, createdAt: ts()
    });
    return ref.id;
  },

  vote: async (id: string, side: "A" | "B"): Promise<void> => {
    const field = side === "A" ? "votesA" : "votesB";
    await updateDoc(doc(firestore, "duels", id), { [field]: increment(1) });
  },

  delete: async (id: string): Promise<void> => {
    await deleteDoc(doc(firestore, "duels", id));
  },
};

// ── Users ─────────────────────────────────────────────────────────────────────

export const usersDb = {
  getById: async (id: string): Promise<AppUser | null> => {
    const snap = await getDoc(doc(firestore, "users", id));
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as AppUser) : null;
  },

  upsert: async (user: AppUser): Promise<void> => {
    await setDoc(doc(firestore, "users", user.id), user, { merge: true });
  },
};

// ── Likes ─────────────────────────────────────────────────────────────────────

export const likesDb = {
  isLiked: async (userId: string, testId: string): Promise<boolean> => {
    const snap = await getDoc(doc(firestore, "likes", `${userId}_${testId}`));
    return snap.exists();
  },

  toggle: async (userId: string, testId: string): Promise<boolean> => {
    const likeRef = doc(firestore, "likes", `${userId}_${testId}`);
    const testRef = doc(firestore, "tests", testId);
    return runTransaction(firestore, async (tx) => {
      const [likeSnap, testSnap] = await Promise.all([tx.get(likeRef), tx.get(testRef)]);
      const currentCount: number = testSnap.exists() ? ((testSnap.data().likeCount as number) ?? 0) : 0;
      if (likeSnap.exists()) {
        tx.delete(likeRef);
        tx.update(testRef, { likeCount: Math.max(0, currentCount - 1) });
        return false;
      } else {
        tx.set(likeRef, { userId, testId, createdAt: ts() });
        tx.update(testRef, { likeCount: currentCount + 1 });
        return true;
      }
    });
  },

  getUserLikes: async (userId: string): Promise<string[]> => {
    const q = query(collection(firestore, "likes"), where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data().testId as string);
  },
};

// ── Favorites ─────────────────────────────────────────────────────────────────

export const favoritesDb = {
  isFavorited: async (userId: string, itemId: string, itemType: FavoriteItem["itemType"]): Promise<boolean> => {
    const snap = await getDoc(doc(firestore, "favorites", `${userId}_${itemId}_${itemType}`));
    return snap.exists();
  },

  toggle: async (userId: string, itemId: string, itemType: FavoriteItem["itemType"]): Promise<boolean> => {
    const favRef = doc(firestore, "favorites", `${userId}_${itemId}_${itemType}`);
    if (itemType === "test") {
      const testRef = doc(firestore, "tests", itemId);
      return runTransaction(firestore, async (tx) => {
        const [favSnap, testSnap] = await Promise.all([tx.get(favRef), tx.get(testRef)]);
        const currentCount: number = testSnap.exists() ? ((testSnap.data().favoriteCount as number) ?? 0) : 0;
        if (favSnap.exists()) {
          tx.delete(favRef);
          tx.update(testRef, { favoriteCount: Math.max(0, currentCount - 1) });
          return false;
        } else {
          tx.set(favRef, { userId, itemId, itemType, createdAt: ts() });
          tx.update(testRef, { favoriteCount: currentCount + 1 });
          return true;
        }
      });
    }
    const snap = await getDoc(favRef);
    if (snap.exists()) {
      await deleteDoc(favRef);
      return false;
    }
    await setDoc(favRef, { userId, itemId, itemType, createdAt: ts() });
    return true;
  },

  getUserFavorites: async (userId: string, itemType?: FavoriteItem["itemType"]): Promise<FavoriteItem[]> => {
    let q = itemType
      ? query(collection(firestore, "favorites"), where("userId", "==", userId), where("itemType", "==", itemType))
      : query(collection(firestore, "favorites"), where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ itemId: d.data().itemId, itemType: d.data().itemType }) as FavoriteItem);
  },
};

// ── Recently Played ───────────────────────────────────────────────────────────

const RECENT_KEY = "charcomp_recently_played";
const MAX_RECENT = 10;

export const recentlyPlayedDb = {
  add: (testId: string): void => {
    try {
      const current: string[] = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
      const filtered = current.filter(id => id !== testId);
      const updated = [testId, ...filtered].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    } catch { /* ignore */ }
  },
  get: (): string[] => {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); } catch { return []; }
  },
};

// ── Sessions (local only) ─────────────────────────────────────────────────────

const getJSON = <T>(key: string, def: T): T => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; }
};
const setJSON = <T>(key: string, val: T): void => { localStorage.setItem(key, JSON.stringify(val)); };

export const sessionsDb = {
  getTournament: (id: string) => getJSON<any>(`charcomp_ts_${id}`, null),
  saveTournament: (session: any) => setJSON(`charcomp_ts_${session.id}`, session),
  getRanking: (id: string) => getJSON<any>(`charcomp_rs_${id}`, null),
  saveRanking: (session: any) => setJSON(`charcomp_rs_${session.id}`, session),
};

// ── Search ────────────────────────────────────────────────────────────────────

export const searchDb = {
  all: async (query: string): Promise<{ universes: Universe[]; characters: Character[]; tests: Test[] }> => {
    const [universes, characters, tests] = await Promise.all([
      universesDb.getAll({ search: query }),
      charactersDb.getAll({ search: query }),
      testsDb.getAll({ search: query }),
    ]);
    return { universes: universes.slice(0, 5), characters: characters.slice(0, 5), tests: tests.slice(0, 5) };
  },
};

// ── Duplicate detection ───────────────────────────────────────────────────────

export const duplicateCheck = {
  universe: async (name: string): Promise<Universe | null> => {
    const all = await universesDb.getAll();
    return all.find(u => u.name.toLowerCase() === name.toLowerCase()) ?? null;
  },
  character: async (name: string, seriesId: string): Promise<boolean> => {
    return charactersDb.checkDuplicate(name, seriesId);
  },
};
