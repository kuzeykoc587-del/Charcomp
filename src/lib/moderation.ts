import { scanText } from "./moderationKeywords";
import type { UserRole } from "./roles";

export type ModerationStatus = "clean" | "flagged" | "needs_review";
export type ContentStatus = "published" | "pending" | "hidden" | "rejected";

export interface ModerationResult {
  status: ContentStatus;
  moderationStatus: ModerationStatus;
  riskScore: number;
  riskReasons: string[];
  duplicateWarning?: string;
}

export interface ModerationInput {
  title: string;
  description?: string;
  coverImageUrl?: string;
  existingTitles?: string[];
  existingImageUrls?: string[];
  existingImagePublicIds?: string[];
  userRole: UserRole;
  userCreatedAt?: string;
  userRecentTestCount?: number;
  coverImagePublicId?: string;
}

function normalizeTurkish(str: string): string {
  return str
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function titleSimilarity(a: string, b: string): number {
  const na = normalizeTurkish(a);
  const nb = normalizeTurkish(b);
  if (na === nb) return 1.0;

  const wordsA = new Set(na.split(" ").filter(w => w.length > 2));
  const wordsB = new Set(nb.split(" ").filter(w => w.length > 2));
  if (wordsA.size === 0 && wordsB.size === 0) return 1.0;
  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let shared = 0;
  for (const w of wordsA) {
    if (wordsB.has(w)) shared++;
  }
  return shared / Math.max(wordsA.size, wordsB.size);
}

export function checkTitleDuplicates(
  title: string,
  existingTitles: string[]
): { exactMatch: boolean; similarMatches: string[] } {
  const normalized = normalizeTurkish(title);
  const exactMatch = existingTitles.some(t => normalizeTurkish(t) === normalized);
  const similarMatches = existingTitles.filter(t => {
    const sim = titleSimilarity(title, t);
    return sim >= 0.6 && normalizeTurkish(t) !== normalized;
  });
  return { exactMatch, similarMatches };
}

export function checkImageDuplicate(
  imageUrl: string | undefined,
  imagePublicId: string | undefined,
  existingUrls: string[],
  existingPublicIds: string[]
): boolean {
  if (!imageUrl && !imagePublicId) return false;
  if (imageUrl) {
    const normalizedUrl = imageUrl.trim().toLowerCase().replace(/\/+$/, "");
    if (existingUrls.some(u => u.trim().toLowerCase().replace(/\/+$/, "") === normalizedUrl)) return true;
  }
  if (imagePublicId) {
    if (existingPublicIds.some(id => id === imagePublicId)) return true;
  }
  return false;
}

export function computeRiskScore(input: ModerationInput): ModerationResult {
  let riskScore = 0;
  const riskReasons: string[] = [];

  if (input.userRole === "NEW_MEMBER") {
    riskScore += 2;
    riskReasons.push("new_member");
  }

  const fullText = `${input.title} ${input.description ?? ""}`;
  const { matches, totalScore } = scanText(fullText);
  if (matches.length > 0) {
    riskScore += totalScore;
    matches.forEach(m => {
      if (m.score >= 5) {
        riskReasons.push(`blocked_keyword_${m.category}`);
      } else if (m.score >= 3) {
        riskReasons.push(`suspicious_keyword_${m.category}`);
      }
    });
  }

  if (input.existingTitles && input.existingTitles.length > 0) {
    const { exactMatch, similarMatches } = checkTitleDuplicates(input.title, input.existingTitles);
    if (exactMatch) {
      riskScore += 4;
      riskReasons.push("exact_duplicate_title");
    } else if (similarMatches.length > 0) {
      riskScore += 2;
      riskReasons.push("similar_title");
    }
  }

  if (input.coverImageUrl || input.coverImagePublicId) {
    const isDupImage = checkImageDuplicate(
      input.coverImageUrl,
      input.coverImagePublicId,
      input.existingImageUrls ?? [],
      input.existingImagePublicIds ?? []
    );
    if (isDupImage) {
      riskScore += 2;
      riskReasons.push("duplicate_cover_image");
    }
  }

  if (!input.title || input.title.trim().length < 5) {
    riskScore += 1;
    riskReasons.push("very_short_title");
  }

  if (!input.description || input.description.trim().length < 10) {
    riskScore += 1;
    riskReasons.push("missing_description");
  }

  const upperRatio = (input.title.match(/[A-ZÇĞİÖŞÜ]/g)?.length ?? 0) / Math.max(input.title.length, 1);
  if (upperRatio > 0.6 && input.title.length > 5) {
    riskScore += 1;
    riskReasons.push("excessive_caps");
  }

  if (/(.)\1{3,}/.test(input.title)) {
    riskScore += 1;
    riskReasons.push("repeated_characters");
  }

  if ((input.userRecentTestCount ?? 0) >= 3) {
    riskScore += 2;
    riskReasons.push("high_recent_creation_rate");
  }

  const hasBlockedKeyword = riskReasons.some(r => r.startsWith("blocked_keyword"));

  let status: ContentStatus;
  let moderationStatus: ModerationStatus;

  if (input.userRole === "ADMIN" || input.userRole === "MODERATOR") {
    status = "published";
    moderationStatus = "clean";
  } else if (riskScore >= 7 || hasBlockedKeyword) {
    status = "pending";
    moderationStatus = "needs_review";
  } else if (riskScore >= 4) {
    status = "pending";
    moderationStatus = "flagged";
  } else {
    status = "published";
    moderationStatus = "clean";
  }

  let duplicateWarning: string | undefined;
  if (riskReasons.includes("exact_duplicate_title")) {
    duplicateWarning = "exact";
  } else if (riskReasons.includes("similar_title")) {
    duplicateWarning = "similar";
  } else if (riskReasons.includes("duplicate_cover_image")) {
    duplicateWarning = "image";
  }

  return { status, moderationStatus, riskScore, riskReasons, duplicateWarning };
}

export function isPubliclyVisible(status: ContentStatus | undefined): boolean {
  if (!status) return true;
  return status === "published";
}
