/**
 * Safe Firestore seeder — run with: pnpm tsx seed-firestore.ts
 *
 * Rules:
 *  - Fetch ALL existing IDs per collection in one paginated pass.
 *  - Docs with deterministic IDs (universes/characters/tests):
 *      existing + isSeedContent=true  → skip (already seeded)
 *      existing + isSeedContent!=true → skip (user content, never touched)
 *      missing                        → write
 *  - Duels (random IDs): query seed duels by isSeedContent=true to build
 *    an existing pair-key set; write only pairs not yet present.
 *  - Nothing is deleted. Nothing is overwritten.
 */

import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  writeBatch,
  query,
  where,
} from "firebase/firestore";
import {
  SEED_SERIES,
  SEED_CHARACTERS,
  SEED_TESTS,
  SEED_DUELS,
} from "./src/lib/seedData.js";

// ── Firebase ───────────────────────────────────────────────────────────────────

const app =
  getApps().length === 0
    ? initializeApp({
        apiKey: "AIzaSyCJ9uDnzn1wWwBXQPWqSFuZwGJA2MbTv0A",
        authDomain: "character-clash-c7025.firebaseapp.com",
        projectId: "character-clash-c7025",
        storageBucket: "character-clash-c7025.firebasestorage.app",
        messagingSenderId: "572238792240",
        appId: "1:572238792240:web:e8b84ee6f24820e25a4ff5",
      })
    : getApps()[0];

const db = getFirestore(app);
const ts = () => new Date().toISOString();
const SYSTEM = "system";

function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

// Fetch every document in a collection, return a Map<id, data>.
async function fetchAll(col: string): Promise<Map<string, Record<string, unknown>>> {
  const snap = await getDocs(collection(db, col));
  const map = new Map<string, Record<string, unknown>>();
  snap.forEach((d) => map.set(d.id, d.data() as Record<string, unknown>));
  return map;
}

// ── Universes ──────────────────────────────────────────────────────────────────

async function seedUniverses() {
  console.log("── Universes ──");
  const existing = await fetchAll("universes");
  console.log(`  Existing in Firestore: ${existing.size}`);

  let written = 0, skippedSeed = 0, skippedUser = 0;
  const toWrite: Array<{ id: string; data: object }> = [];

  for (const s of SEED_SERIES) {
    if (existing.has(s.id)) {
      existing.get(s.id)?.isSeedContent ? skippedSeed++ : skippedUser++;
    } else {
      toWrite.push({
        id: s.id,
        data: {
          name: s.name,
          description: s.description,
          category: s.category,
          coverImage: s.coverImage,
          characterCount: 0,
          creatorId: SYSTEM,
          createdAt: ts(),
          isSeedContent: true,
        },
      });
    }
  }

  console.log(`  To write: ${toWrite.length}  |  skipped_seed: ${skippedSeed}  |  skipped_user: ${skippedUser}`);

  for (const ch of chunk(toWrite, 499)) {
    const batch = writeBatch(db);
    for (const { id, data } of ch) batch.set(doc(db, "universes", id), data);
    await batch.commit();
    written += ch.length;
  }

  console.log(`  ✓ Written: ${written}\n`);
  return { written, skippedSeed, skippedUser };
}

// ── Characters ─────────────────────────────────────────────────────────────────

async function seedCharacters() {
  console.log("── Characters ──");
  const existing = await fetchAll("characters");
  console.log(`  Existing in Firestore: ${existing.size}`);

  let written = 0, skippedSeed = 0, skippedUser = 0;
  const toWrite: Array<{ id: string; seriesId: string; data: object }> = [];

  for (const c of SEED_CHARACTERS) {
    if (existing.has(c.id)) {
      existing.get(c.id)?.isSeedContent ? skippedSeed++ : skippedUser++;
    } else {
      toWrite.push({
        id: c.id,
        seriesId: c.seriesId,
        data: {
          name: c.name,
          description: c.description,
          image: c.image,
          seriesId: c.seriesId,
          tags: c.tags,
          creatorId: SYSTEM,
          createdAt: ts(),
          wins: 0,
          losses: 0,
          totalDuels: 0,
          tierSum: 0,
          tierCount: 0,
          tierAverage: 0,
          isSeedContent: true,
        },
      });
    }
  }

  console.log(`  To write: ${toWrite.length}  |  skipped_seed: ${skippedSeed}  |  skipped_user: ${skippedUser}`);

  // Write characters in batches of 499
  for (const ch of chunk(toWrite, 499)) {
    const batch = writeBatch(db);
    for (const { id, data } of ch) batch.set(doc(db, "characters", id), data);
    await batch.commit();
    written += ch.length;
    process.stdout.write(`  Writing characters... ${written}/${toWrite.length}\r`);
  }

  // Update characterCount on each universe doc
  const countMap: Record<string, number> = {};
  for (const { seriesId } of toWrite) {
    countMap[seriesId] = (countMap[seriesId] ?? 0) + 1;
  }
  const universeSnap = await fetchAll("universes");
  const countEntries = Object.entries(countMap);
  for (const ch of chunk(countEntries, 499)) {
    const batch = writeBatch(db);
    for (const [sid, n] of ch) {
      const existing = (universeSnap.get(sid)?.characterCount as number) ?? 0;
      batch.update(doc(db, "universes", sid), { characterCount: existing + n });
    }
    await batch.commit();
  }

  console.log(`\n  ✓ Written: ${written}  |  characterCounts updated\n`);
  return { written, skippedSeed, skippedUser };
}

// ── Tests ──────────────────────────────────────────────────────────────────────

async function seedTests() {
  console.log("── Tests ──");
  const existing = await fetchAll("tests");
  console.log(`  Existing in Firestore: ${existing.size}`);

  let written = 0, skippedSeed = 0, skippedUser = 0;
  const toWrite: Array<{ id: string; data: object }> = [];

  for (const t of SEED_TESTS) {
    if (existing.has(t.id)) {
      existing.get(t.id)?.isSeedContent ? skippedSeed++ : skippedUser++;
    } else {
      toWrite.push({
        id: t.id,
        data: {
          title: t.title,
          description: t.description,
          coverImage: t.coverImage,
          characterIds: t.characterIds,
          language: t.language,
          creatorId: SYSTEM,
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
        },
      });
    }
  }

  console.log(`  To write: ${toWrite.length}  |  skipped_seed: ${skippedSeed}  |  skipped_user: ${skippedUser}`);

  for (const ch of chunk(toWrite, 499)) {
    const batch = writeBatch(db);
    for (const { id, data } of ch) batch.set(doc(db, "tests", id), data);
    await batch.commit();
    written += ch.length;
  }

  console.log(`  ✓ Written: ${written}\n`);
  return { written, skippedSeed, skippedUser };
}

// ── Duels ──────────────────────────────────────────────────────────────────────

async function seedDuels() {
  console.log("── Duels ──");

  // Fetch only the seed duels that already exist to build a pair-key dedup set.
  const seedSnap = await getDocs(
    query(collection(db, "duels"), where("isSeedContent", "==", true))
  );
  const existingPairs = new Set<string>();
  let existingSeedCount = 0;
  seedSnap.forEach((d) => {
    const { characterAId, characterBId } = d.data();
    if (characterAId && characterBId) {
      existingPairs.add(`${characterAId}:${characterBId}`);
      existingPairs.add(`${characterBId}:${characterAId}`);
      existingSeedCount++;
    }
  });
  console.log(`  Existing seed duels: ${existingSeedCount}`);

  let written = 0, skippedDup = 0;
  const toWrite: object[] = [];

  for (const d of SEED_DUELS) {
    const key = `${d.characterAId}:${d.characterBId}`;
    if (existingPairs.has(key)) {
      skippedDup++;
    } else {
      toWrite.push({
        characterAId: d.characterAId,
        characterBId: d.characterBId,
        votesA: d.votesA,
        votesB: d.votesB,
        title: d.title ?? null,
        creatorId: SYSTEM,
        createdAt: ts(),
        isSeedContent: true,
      });
    }
  }

  console.log(`  To write: ${toWrite.length}  |  skipped_duplicate: ${skippedDup}`);

  for (const ch of chunk(toWrite, 499)) {
    const batch = writeBatch(db);
    for (const data of ch) batch.set(doc(collection(db, "duels")), data);
    await batch.commit();
    written += ch.length;
  }

  console.log(`  ✓ Written: ${written}\n`);
  return { written, skippedDup };
}

// ── Verification ───────────────────────────────────────────────────────────────

async function verifyCounts() {
  console.log("── Final Counts ──");
  for (const col of ["universes", "characters", "tests", "duels"]) {
    const snap = await getDocs(collection(db, col));
    console.log(`  ${col}: ${snap.size}`);
  }
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== CharComp Firestore Seeder ===");
  console.log(
    `Seed payload: ${SEED_SERIES.length} universes | ${SEED_CHARACTERS.length} characters | ${SEED_TESTS.length} tests | ${SEED_DUELS.length} duels\n`
  );

  const u = await seedUniverses();
  const c = await seedCharacters();
  const t = await seedTests();
  const d = await seedDuels();

  await verifyCounts();

  console.log("\n=== Summary ===");
  console.log(`Universes   written=${u.written}  skipped_seed=${u.skippedSeed}  skipped_user=${u.skippedUser}`);
  console.log(`Characters  written=${c.written}  skipped_seed=${c.skippedSeed}  skipped_user=${c.skippedUser}`);
  console.log(`Tests       written=${t.written}  skipped_seed=${t.skippedSeed}  skipped_user=${t.skippedUser}`);
  console.log(`Duels       written=${d.written}  skipped_duplicate=${d.skippedDup}`);
  console.log("\nUser-created content: untouched ✓");
}

main().catch((e) => {
  console.error("Seeder error:", e);
  process.exit(1);
});
