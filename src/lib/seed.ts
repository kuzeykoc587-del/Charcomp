import { collection, getDocs, writeBatch, doc } from "firebase/firestore";
import { db as firestore } from "./firebase";
import { SEED_SERIES, SEED_CHARACTERS, SEED_TESTS, SEED_DUELS } from "./seedData";

const ts = () => new Date().toISOString();
const SYSTEM_USER = "system";

export async function isSeedNeeded(): Promise<boolean> {
  const snap = await getDocs(collection(firestore, "universes"));
  return snap.empty;
}

export async function seedDatabase(
  onProgress?: (msg: string, pct: number) => void
): Promise<void> {
  const needed = await isSeedNeeded();
  if (!needed) {
    onProgress?.("Database already seeded.", 100);
    return;
  }

  onProgress?.("Seeding universes...", 5);

  const universeChunks = chunkArray(SEED_SERIES, 400);
  for (const chunk of universeChunks) {
    const batch = writeBatch(firestore);
    for (const s of chunk) {
      const ref = doc(firestore, "universes", s.id);
      batch.set(ref, {
        name: s.name,
        description: s.description,
        category: s.category,
        coverImage: s.coverImage,
        characterCount: 0,
        creatorId: SYSTEM_USER,
        createdAt: ts(),
        isSeedContent: true,
      });
    }
    await batch.commit();
  }

  onProgress?.("Seeding characters...", 30);

  const countMap: Record<string, number> = {};
  for (const c of SEED_CHARACTERS) {
    countMap[c.seriesId] = (countMap[c.seriesId] || 0) + 1;
  }

  const charChunks = chunkArray(SEED_CHARACTERS, 400);
  for (const chunk of charChunks) {
    const batch = writeBatch(firestore);
    for (const c of chunk) {
      const ref = doc(firestore, "characters", c.id);
      batch.set(ref, {
        name: c.name,
        description: c.description,
        image: c.image,
        seriesId: c.seriesId,
        tags: c.tags,
        creatorId: SYSTEM_USER,
        createdAt: ts(),
        wins: 0,
        losses: 0,
        totalDuels: 0,
        tierSum: 0,
        tierCount: 0,
        tierAverage: 0,
        isSeedContent: true,
      });
    }
    await batch.commit();
  }

  onProgress?.("Updating character counts...", 60);

  const countBatch = writeBatch(firestore);
  for (const [seriesId, count] of Object.entries(countMap)) {
    const ref = doc(firestore, "universes", seriesId);
    countBatch.update(ref, { characterCount: count });
  }
  await countBatch.commit();

  onProgress?.("Seeding tests...", 70);

  const testChunks = chunkArray(SEED_TESTS, 400);
  for (const chunk of testChunks) {
    const batch = writeBatch(firestore);
    for (const t of chunk) {
      const ref = doc(firestore, "tests", t.id);
      batch.set(ref, {
        title: t.title,
        description: t.description,
        coverImage: t.coverImage,
        characterIds: t.characterIds,
        language: t.language,
        creatorId: SYSTEM_USER,
        createdAt: ts(),
        playCount: 0,
        likeCount: 0,
        favoriteCount: 0,
        isSeedContent: true,
        stats: {
          totalPlays: 0,
          completedPlays: 0,
          championHistory: [],
          matchupStats: {},
        },
      });
    }
    await batch.commit();
  }

  onProgress?.("Seeding duels...", 88);

  const duelChunks = chunkArray(SEED_DUELS, 400);
  for (const chunk of duelChunks) {
    const batch = writeBatch(firestore);
    for (const d of chunk) {
      const ref = doc(collection(firestore, "duels"));
      batch.set(ref, {
        characterAId: d.characterAId,
        characterBId: d.characterBId,
        votesA: d.votesA,
        votesB: d.votesB,
        title: d.title ?? null,
        creatorId: SYSTEM_USER,
        createdAt: ts(),
        isSeedContent: true,
      });
    }
    await batch.commit();
  }

  onProgress?.("Database seeded successfully!", 100);
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}
