import { collection, getDocs, writeBatch, doc, setDoc, getDoc } from "firebase/firestore";
import { db as firestore } from "./firebase";
import { SEED_SERIES, SEED_CHARACTERS } from "./seedData";

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

  // Batch write universes (Firestore batches max 500)
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
      });
    }
    await batch.commit();
  }

  onProgress?.("Seeding characters...", 40);

  // Count characters per series
  const countMap: Record<string, number> = {};
  for (const c of SEED_CHARACTERS) {
    countMap[c.seriesId] = (countMap[c.seriesId] || 0) + 1;
  }

  // Batch write characters
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
      });
    }
    await batch.commit();
  }

  onProgress?.("Updating character counts...", 80);

  // Update character counts on universes
  const countBatch = writeBatch(firestore);
  for (const [seriesId, count] of Object.entries(countMap)) {
    const ref = doc(firestore, "universes", seriesId);
    countBatch.update(ref, { characterCount: count });
  }
  await countBatch.commit();

  onProgress?.("Seeding sample duels...", 90);

  // Seed 10 sample duels
  const sampleDuels = [
    { characterAId: "c_db_goku", characterBId: "c_na_naruto", votesA: 5400, votesB: 3200 },
    { characterAId: "c_dcu_bm", characterBId: "c_mcu_im", votesA: 4100, votesB: 4500 },
    { characterAId: "c_op_luffy", characterBId: "c_op_zoro", votesA: 2800, votesB: 2900 },
    { characterAId: "c_at_eren", characterBId: "c_at_levi", votesA: 1500, votesB: 3500 },
    { characterAId: "c_st_eleven", characterBId: "c_st_mike", votesA: 2100, votesB: 800 },
    { characterAId: "c_hp_harry", characterBId: "c_hp_hermione", votesA: 1900, votesB: 2200 },
    { characterAId: "c_dcu_sm", characterBId: "c_mcu_thor", votesA: 3800, votesB: 3100 },
    { characterAId: "c_na_sasuke", characterBId: "c_na_itachi", votesA: 2500, votesB: 4200 },
    { characterAId: "c_mcu_sm", characterBId: "c_dcu_bm", votesA: 4500, votesB: 4300 },
    { characterAId: "c_jjk_gojo", characterBId: "c_jjk_sukuna", votesA: 5100, votesB: 4800 },
  ];

  const duelBatch = writeBatch(firestore);
  for (let i = 0; i < sampleDuels.length; i++) {
    const ref = doc(collection(firestore, "duels"));
    duelBatch.set(ref, { ...sampleDuels[i], creatorId: SYSTEM_USER, createdAt: ts() });
  }
  await duelBatch.commit();

  onProgress?.("Database seeded successfully!", 100);
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}
