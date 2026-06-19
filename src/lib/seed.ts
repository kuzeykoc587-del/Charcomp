import { collection, getDocs } from "firebase/firestore";
import { db as firestore } from "./firebase";

export async function isSeedNeeded(): Promise<boolean> {
  const snap = await getDocs(collection(firestore, "universes"));
  return snap.empty;
}

export async function seedDatabase(
  onProgress?: (msg: string, pct: number) => void
): Promise<void> {
  onProgress?.("Seed data has been removed. Real content only.", 100);
}
