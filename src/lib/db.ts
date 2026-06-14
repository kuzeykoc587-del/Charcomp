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
  isSeedContent?: boolean;
  deleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
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
  // Duel stats
  wins?: number;
  losses?: number;
  totalDuels?: number;
  // Tier voting
  tierSum?: number;
  tierCount?: number;
  tierAverage?: number;
  // Seed
  isSeedContent?: boolean;
  // Soft delete
  deleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
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
  isSeedContent?: boolean;
  deleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface Duel {
  id: string;
  characterAId: string;
  characterBId: string;
  votesA: number;
  votesB: number;
  creatorId: string;
  createdAt: string;
  title?: string;
  description?: string;
  isSeedContent?: boolean;
  deleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
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

export interface TierVote {
  id: string;
  userId: string;
  characterId: string;
  tier: "S" | "A" | "B" | "C" | "D";
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: "duel_vote" | "universe_favorited" | "top10";
  message: string;
  read: boolean;
  createdAt: string;
  data?: Record<string, string>;
}

const TIER_SCORES: Record<TierVote["tier"], number> = { S: 5, A: 4, B: 3, C: 2, D: 1 };

// ── Helpers ───────────────────────────────────────────────────────────────────

const fromDoc = <T>(snap: QueryDocumentSnapshot<DocumentData>): T =>
  ({ id: snap.id, ...snap.data() } as T);

const ts = () => new Date().toISOString();

// ── Universes ─────────────────────────────────────────────────────────────────

export const universesDb = {
  getAll: async (filters?: { category?: SeriesCategory; search?: string }): Promise<Universe[]> => {
    const col = collection(firestore, "universes");
    const q = query(col, orderBy("name"));
    const snap = await getDocs(q);
    let results = snap.docs.map(d => fromDoc<Universe>(d)).filter(u => !u.deleted);
    if (filters?.category) results = results.filter(u => u.category === filters.category);
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      results = results.filter(u => u.name.toLowerCase().includes(s) || u.description.toLowerCase().includes(s));
    }
    return results;
  },

  getById: async (id: string): Promise<Universe | null> => {
    const snap = await getDoc(doc(firestore, "universes", id));
    if (!snap.exists()) return null;
    const u = { id: snap.id, ...snap.data() } as Universe;
    return u.deleted ? null : u;
  },

  getByCreator: async (creatorId: string): Promise<Universe[]> => {
    const q = query(collection(firestore, "universes"), where("creatorId", "==", creatorId));
    const snap = await getDocs(q);
    return snap.docs.map(d => fromDoc<Universe>(d)).filter(u => !u.deleted);
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

  softDelete: async (id: string, deletedBy: string): Promise<void> => {
    await updateDoc(doc(firestore, "universes", id), {
      deleted: true, deletedAt: ts(), deletedBy
    });
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
    let results = snap.docs.map(d => fromDoc<Character>(d)).filter(c => !c.deleted);
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      results = results.filter(c => c.name.toLowerCase().includes(s));
    }
    return results;
  },

  getById: async (id: string): Promise<Character | null> => {
    const snap = await getDoc(doc(firestore, "characters", id));
    if (!snap.exists()) return null;
    const c = { id: snap.id, ...snap.data() } as Character;
    return c.deleted ? null : c;
  },

  getByCreator: async (creatorId: string): Promise<Character[]> => {
    const q = query(collection(firestore, "characters"), where("creatorId", "==", creatorId));
    const snap = await getDocs(q);
    return snap.docs.map(d => fromDoc<Character>(d)).filter(c => !c.deleted);
  },

  getAllForRanking: async (): Promise<Character[]> => {
    const snap = await getDocs(collection(firestore, "characters"));
    return snap.docs
      .map(d => fromDoc<Character>(d))
      .filter(c => !c.deleted && ((c.wins ?? 0) + (c.losses ?? 0)) > 0);
  },

  getManyByIds: async (ids: string[]): Promise<Character[]> => {
    if (!ids.length) return [];
    const chunks: string[][] = [];
    for (let i = 0; i < ids.length; i += 10) chunks.push(ids.slice(i, i + 10));
    const results: Character[] = [];
    for (const chunk of chunks) {
      const q = query(collection(firestore, "characters"), where("__name__", "in", chunk));
      const snap = await getDocs(q);
      results.push(...snap.docs.map(d => fromDoc<Character>(d)).filter(c => !c.deleted));
    }
    return results;
  },

  create: async (data: Omit<Character, "id" | "createdAt">): Promise<string> => {
    const ref = await addDoc(collection(firestore, "characters"), { ...data, createdAt: ts(), wins: 0, losses: 0, totalDuels: 0, tierSum: 0, tierCount: 0, tierAverage: 0 });
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

  softDelete: async (id: string, deletedBy: string): Promise<void> => {
    const char = await charactersDb.getById(id);
    await updateDoc(doc(firestore, "characters", id), {
      deleted: true, deletedAt: ts(), deletedBy
    });
    if (char) await universesDb.incrementCharacterCount(char.seriesId, -1);
  },

  checkDuplicate: async (name: string, seriesId: string): Promise<boolean> => {
    const q = query(
      collection(firestore, "characters"),
      where("seriesId", "==", seriesId),
      where("name", "==", name)
    );
    const snap = await getDocs(q);
    return snap.docs.some(d => !(d.data().deleted));
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
    let results = snap.docs.map(d => fromDoc<Test>(d)).filter(t => !t.deleted);
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
    return snap.docs.map(d => fromDoc<Test>(d)).filter(t => !t.deleted);
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

  softDelete: async (id: string, deletedBy: string): Promise<void> => {
    await updateDoc(doc(firestore, "tests", id), {
      deleted: true, deletedAt: ts(), deletedBy
    });
  },

  incrementPlayCount: async (id: string): Promise<void> => {
    await updateDoc(doc(firestore, "tests", id), { playCount: increment(1) });
  },
};

// ── Duels ─────────────────────────────────────────────────────────────────────

export const duelsDb = {
  getAll: async (lim = 100): Promise<Duel[]> => {
    const q = query(collection(firestore, "duels"), orderBy("createdAt", "desc"), limit(lim));
    const snap = await getDocs(q);
    return snap.docs.map(d => fromDoc<Duel>(d)).filter(d => !d.deleted);
  },

  getById: async (id: string): Promise<Duel | null> => {
    const snap = await getDoc(doc(firestore, "duels", id));
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as Duel) : null;
  },

  getByCreator: async (creatorId: string): Promise<Duel[]> => {
    const q = query(collection(firestore, "duels"), where("creatorId", "==", creatorId));
    const snap = await getDocs(q);
    return snap.docs.map(d => fromDoc<Duel>(d)).filter(d => !d.deleted);
  },

  create: async (data: Omit<Duel, "id" | "createdAt" | "votesA" | "votesB">): Promise<string> => {
    const ref = await addDoc(collection(firestore, "duels"), {
      ...data, votesA: 0, votesB: 0, createdAt: ts()
    });
    return ref.id;
  },

  vote: async (id: string, side: "A" | "B", voterId?: string): Promise<void> => {
    const duelSnap = await getDoc(doc(firestore, "duels", id));
    if (!duelSnap.exists()) throw new Error("Duel not found");
    const duel = { id: duelSnap.id, ...duelSnap.data() } as Duel;

    const winnerId = side === "A" ? duel.characterAId : duel.characterBId;
    const loserId = side === "A" ? duel.characterBId : duel.characterAId;
    const voteField = side === "A" ? "votesA" : "votesB";

    const batch = writeBatch(firestore);
    batch.update(doc(firestore, "duels", id), { [voteField]: increment(1) });
    batch.update(doc(firestore, "characters", winnerId), {
      wins: increment(1),
      totalDuels: increment(1),
    });
    batch.update(doc(firestore, "characters", loserId), {
      losses: increment(1),
      totalDuels: increment(1),
    });

    // Notify duel creator if someone else voted
    if (duel.creatorId && duel.creatorId !== voterId) {
      const notifRef = doc(collection(firestore, "notifications"));
      batch.set(notifRef, {
        userId: duel.creatorId,
        type: "duel_vote",
        message: "Your duel received a new vote!",
        read: false,
        createdAt: ts(),
        data: { duelId: id },
      });
    }

    await batch.commit();
  },

  delete: async (id: string): Promise<void> => {
    await deleteDoc(doc(firestore, "duels", id));
  },

  softDelete: async (id: string, deletedBy: string): Promise<void> => {
    await updateDoc(doc(firestore, "duels", id), {
      deleted: true, deletedAt: ts(), deletedBy
    });
  },
};

// ── Tier Votes ────────────────────────────────────────────────────────────────

export const tierVotesDb = {
  getUserVote: async (userId: string, characterId: string): Promise<TierVote | null> => {
    const snap = await getDoc(doc(firestore, "tierVotes", `${userId}_${characterId}`));
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as TierVote) : null;
  },

  getUserVotes: async (userId: string): Promise<TierVote[]> => {
    const q = query(collection(firestore, "tierVotes"), where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map(d => fromDoc<TierVote>(d));
  },

  vote: async (userId: string, characterId: string, tier: TierVote["tier"]): Promise<void> => {
    const newScore = TIER_SCORES[tier];
    const voteRef = doc(firestore, "tierVotes", `${userId}_${characterId}`);
    const charRef = doc(firestore, "characters", characterId);

    await runTransaction(firestore, async (tx) => {
      const [voteSnap, charSnap] = await Promise.all([tx.get(voteRef), tx.get(charRef)]);

      let tierSum = ((charSnap.data()?.tierSum as number) ?? 0);
      let tierCount = ((charSnap.data()?.tierCount as number) ?? 0);

      if (voteSnap.exists()) {
        const oldScore = TIER_SCORES[voteSnap.data().tier as TierVote["tier"]];
        tierSum = tierSum - oldScore + newScore;
        tx.update(voteRef, { tier, updatedAt: ts() });
      } else {
        tierSum += newScore;
        tierCount += 1;
        tx.set(voteRef, { userId, characterId, tier, createdAt: ts(), updatedAt: ts() });
      }

      const tierAverage = tierCount > 0 ? tierSum / tierCount : 0;
      tx.update(charRef, { tierSum, tierCount, tierAverage });
    });
  },
};

// ── Notifications ─────────────────────────────────────────────────────────────

export const notificationsDb = {
  getForUser: async (userId: string): Promise<Notification[]> => {
    const q = query(collection(firestore, "notifications"), where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map(d => fromDoc<Notification>(d))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 20);
  },

  markRead: async (id: string): Promise<void> => {
    await updateDoc(doc(firestore, "notifications", id), { read: true });
  },

  markAllRead: async (userId: string): Promise<void> => {
    const q = query(
      collection(firestore, "notifications"),
      where("userId", "==", userId),
      where("read", "==", false)
    );
    const snap = await getDocs(q);
    const batch = writeBatch(firestore);
    snap.docs.forEach(d => batch.update(d.ref, { read: true }));
    await batch.commit();
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

    // Notify universe creator on favorite
    if (itemType === "universe") {
      const snap = await getDoc(favRef);
      if (!snap.exists()) {
        const uniSnap = await getDoc(doc(firestore, "universes", itemId));
        if (uniSnap.exists()) {
          const creatorId = uniSnap.data().creatorId;
          if (creatorId && creatorId !== userId) {
            const batch = writeBatch(firestore);
            batch.set(favRef, { userId, itemId, itemType, createdAt: ts() });
            const notifRef = doc(collection(firestore, "notifications"));
            batch.set(notifRef, {
              userId: creatorId,
              type: "universe_favorited",
              message: "Your universe was favorited!",
              read: false,
              createdAt: ts(),
              data: { universeId: itemId },
            });
            await batch.commit();
            return true;
          }
        }
      } else {
        await deleteDoc(favRef);
        return false;
      }
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

// ── Duel vote deduplication (local) ───────────────────────────────────────────

const VOTED_DUELS_KEY = "charcomp_voted_duels";

export const duelVoteTracker = {
  hasVoted: (duelId: string): boolean => {
    try {
      const voted: string[] = JSON.parse(localStorage.getItem(VOTED_DUELS_KEY) || "[]");
      return voted.includes(duelId);
    } catch { return false; }
  },
  markVoted: (duelId: string): void => {
    try {
      const voted: string[] = JSON.parse(localStorage.getItem(VOTED_DUELS_KEY) || "[]");
      if (!voted.includes(duelId)) {
        voted.push(duelId);
        localStorage.setItem(VOTED_DUELS_KEY, JSON.stringify(voted));
      }
    } catch { /* ignore */ }
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
  all: async (searchQuery: string): Promise<{ universes: Universe[]; characters: Character[]; tests: Test[]; duels: Duel[] }> => {
    const [universes, characters, tests, duels] = await Promise.all([
      universesDb.getAll({ search: searchQuery }),
      charactersDb.getAll({ search: searchQuery }),
      testsDb.getAll({ search: searchQuery }),
      duelsDb.getAll(),
    ]);
    const s = searchQuery.toLowerCase();
    const filteredDuels = duels.filter(d =>
      d.title?.toLowerCase().includes(s) || d.description?.toLowerCase().includes(s)
    );
    return {
      universes: (universes || []).slice(0, 5),
      characters: (characters || []).slice(0, 5),
      tests: (tests || []).slice(0, 5),
      duels: (filteredDuels || []).slice(0, 5),
    };
  },
};

// ── Duplicate detection ───────────────────────────────────────────────────────

export const duplicateCheck = {
  universe: async (name: string): Promise<Universe | null> => {
    try {
      const all = await universesDb.getAll();
      return all.find(u => u.name.toLowerCase() === name.toLowerCase()) ?? null;
    } catch {
      return null;
    }
  },
  character: async (name: string, seriesId: string): Promise<boolean> => {
    try {
      return charactersDb.checkDuplicate(name, seriesId);
    } catch {
      return false;
    }
  },
};

// ── This or That ──────────────────────────────────────────────────────────────

export interface ThisOrThat {
  id: string;
  title: string;
  description?: string;
  optionA: string;
  optionB: string;
  imageA?: string;
  imageB?: string;
  category?: string;
  creatorId: string;
  createdAt: string;
  votesA: number;
  votesB: number;
  isSeedContent?: boolean;
  deleted?: boolean;
}

const TOT_VOTED_KEY = "charcomp_tot_voted";

export const totVoteTracker = {
  hasVoted: (id: string): boolean => {
    try {
      const v: string[] = JSON.parse(localStorage.getItem(TOT_VOTED_KEY) || "[]");
      return v.includes(id);
    } catch { return false; }
  },
  markVoted: (id: string): void => {
    try {
      const v: string[] = JSON.parse(localStorage.getItem(TOT_VOTED_KEY) || "[]");
      if (!v.includes(id)) { v.push(id); localStorage.setItem(TOT_VOTED_KEY, JSON.stringify(v)); }
    } catch { /* ignore */ }
  },
};

export const thisOrThatDb = {
  getAll: async (lim = 30): Promise<ThisOrThat[]> => {
    const q = query(collection(firestore, "thisOrThat"), orderBy("createdAt", "desc"), limit(lim));
    const snap = await getDocs(q);
    return snap.docs.map(d => fromDoc<ThisOrThat>(d)).filter(p => !p.deleted);
  },

  getById: async (id: string): Promise<ThisOrThat | null> => {
    const snap = await getDoc(doc(firestore, "thisOrThat", id));
    if (!snap.exists()) return null;
    const p = { id: snap.id, ...snap.data() } as ThisOrThat;
    return p.deleted ? null : p;
  },

  getByCreator: async (creatorId: string): Promise<ThisOrThat[]> => {
    const q = query(collection(firestore, "thisOrThat"), where("creatorId", "==", creatorId), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => fromDoc<ThisOrThat>(d)).filter(p => !p.deleted);
  },

  create: async (data: Omit<ThisOrThat, "id" | "createdAt" | "votesA" | "votesB">): Promise<string> => {
    const ref = await addDoc(collection(firestore, "thisOrThat"), {
      ...data, votesA: 0, votesB: 0, createdAt: ts(),
    });
    return ref.id;
  },

  vote: async (id: string, side: "A" | "B"): Promise<void> => {
    const field = side === "A" ? "votesA" : "votesB";
    await updateDoc(doc(firestore, "thisOrThat", id), { [field]: increment(1) });
  },

  softDelete: async (id: string, deletedBy: string): Promise<void> => {
    await updateDoc(doc(firestore, "thisOrThat", id), { deleted: true, deletedAt: ts(), deletedBy });
  },
};

// ── Tier Lists (new creation-based system) ────────────────────────────────────

export interface TierListRow {
  name: string;
  color: string;
}

export interface TierList {
  id: string;
  title: string;
  description: string;
  tiers: TierListRow[];
  characterIds: string[];
  creatorId: string;
  createdAt: string;
  playCount: number;
  isSeedContent?: boolean;
  deleted?: boolean;
}

export interface TierListResult {
  id: string;
  tierListId: string;
  userId: string;
  placements: Record<string, string>;
  submittedAt: string;
}

export const DEFAULT_TIERS: TierListRow[] = [
  { name: "S", color: "#f59e0b" },
  { name: "A", color: "#f97316" },
  { name: "B", color: "#3b82f6" },
  { name: "C", color: "#22c55e" },
  { name: "D", color: "#94a3b8" },
];

export const tierListsDb = {
  getAll: async (lim = 30): Promise<TierList[]> => {
    const q = query(collection(firestore, "tierlists"), orderBy("createdAt", "desc"), limit(lim));
    const snap = await getDocs(q);
    return snap.docs.map(d => fromDoc<TierList>(d)).filter(tl => !tl.deleted);
  },

  getById: async (id: string): Promise<TierList | null> => {
    const snap = await getDoc(doc(firestore, "tierlists", id));
    if (!snap.exists()) return null;
    const tl = { id: snap.id, ...snap.data() } as TierList;
    return tl.deleted ? null : tl;
  },

  getByCreator: async (creatorId: string): Promise<TierList[]> => {
    const q = query(collection(firestore, "tierlists"), where("creatorId", "==", creatorId), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => fromDoc<TierList>(d)).filter(tl => !tl.deleted);
  },

  create: async (data: Omit<TierList, "id" | "createdAt" | "playCount">): Promise<string> => {
    const ref = await addDoc(collection(firestore, "tierlists"), {
      ...data, playCount: 0, createdAt: ts(),
    });
    return ref.id;
  },

  update: async (id: string, data: Partial<Omit<TierList, "id">>): Promise<void> => {
    await updateDoc(doc(firestore, "tierlists", id), data);
  },

  softDelete: async (id: string, deletedBy: string): Promise<void> => {
    await updateDoc(doc(firestore, "tierlists", id), { deleted: true, deletedAt: ts(), deletedBy });
  },

  incrementPlayCount: async (id: string): Promise<void> => {
    await updateDoc(doc(firestore, "tierlists", id), { playCount: increment(1) });
  },
};

export const tierListResultsDb = {
  submit: async (data: Omit<TierListResult, "id">): Promise<string> => {
    const docId = `${data.tierListId}_${data.userId}`;
    await setDoc(doc(firestore, "tierlistResults", docId), { ...data, submittedAt: ts() }, { merge: false });
    await tierListsDb.incrementPlayCount(data.tierListId);
    return docId;
  },

  getUserResult: async (tierListId: string, userId: string): Promise<TierListResult | null> => {
    const snap = await getDoc(doc(firestore, "tierlistResults", `${tierListId}_${userId}`));
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as TierListResult) : null;
  },

  getCommunityResults: async (tierListId: string): Promise<TierListResult[]> => {
    const q = query(collection(firestore, "tierlistResults"), where("tierListId", "==", tierListId));
    const snap = await getDocs(q);
    return snap.docs.map(d => fromDoc<TierListResult>(d));
  },
};
