export interface KeywordEntry {
  word: string;
  category: "profanity" | "sexual" | "hate" | "violence" | "spam";
  score: number;
}

const profanity: KeywordEntry[] = [
  { word: "amk", category: "profanity", score: 3 },
  { word: "orospu", category: "profanity", score: 5 },
  { word: "sik", category: "profanity", score: 4 },
  { word: "göt", category: "profanity", score: 3 },
  { word: "piç", category: "profanity", score: 3 },
  { word: "oç", category: "profanity", score: 3 },
  { word: "bok", category: "profanity", score: 2 },
  { word: "yarrak", category: "profanity", score: 4 },
  { word: "siktir", category: "profanity", score: 4 },
  { word: "fuck", category: "profanity", score: 4 },
  { word: "shit", category: "profanity", score: 3 },
  { word: "bitch", category: "profanity", score: 3 },
  { word: "asshole", category: "profanity", score: 3 },
  { word: "damn", category: "profanity", score: 1 },
  { word: "crap", category: "profanity", score: 1 },
  { word: "bastard", category: "profanity", score: 3 },
];

const sexual: KeywordEntry[] = [
  { word: "porn", category: "sexual", score: 5 },
  { word: "sex", category: "sexual", score: 3 },
  { word: "nude", category: "sexual", score: 4 },
  { word: "naked", category: "sexual", score: 4 },
  { word: "xxx", category: "sexual", score: 5 },
  { word: "porno", category: "sexual", score: 5 },
  { word: "sikiş", category: "sexual", score: 5 },
  { word: "sikişme", category: "sexual", score: 5 },
  { word: "çıplak", category: "sexual", score: 4 },
  { word: "escort", category: "sexual", score: 4 },
  { word: "prostitute", category: "sexual", score: 5 },
];

const hate: KeywordEntry[] = [
  { word: "nigger", category: "hate", score: 5 },
  { word: "faggot", category: "hate", score: 5 },
  { word: "retard", category: "hate", score: 4 },
  { word: "nazi", category: "hate", score: 4 },
  { word: "terrorist", category: "hate", score: 4 },
  { word: "genocide", category: "hate", score: 4 },
  { word: "kill all", category: "hate", score: 5 },
  { word: "herkesi öldür", category: "hate", score: 5 },
  { word: "ölsün", category: "hate", score: 3 },
];

const violence: KeywordEntry[] = [
  { word: "i will kill", category: "violence", score: 5 },
  { word: "öldüreceğim", category: "violence", score: 5 },
  { word: "bomb", category: "violence", score: 4 },
  { word: "suicide", category: "violence", score: 5 },
  { word: "intihar", category: "violence", score: 5 },
];

const spam: KeywordEntry[] = [
  { word: "buy now", category: "spam", score: 3 },
  { word: "click here", category: "spam", score: 2 },
  { word: "free money", category: "spam", score: 4 },
  { word: "make money", category: "spam", score: 3 },
  { word: "casino", category: "spam", score: 3 },
  { word: "bet", category: "spam", score: 2 },
  { word: "kumar", category: "spam", score: 3 },
  { word: "bahis", category: "spam", score: 3 },
  { word: "kazanç", category: "spam", score: 2 },
  { word: "indirim", category: "spam", score: 1 },
  { word: "discount", category: "spam", score: 1 },
  { word: "crypto", category: "spam", score: 2 },
  { word: "bitcoin", category: "spam", score: 2 },
  { word: "invest", category: "spam", score: 2 },
];

export const ALL_KEYWORDS: KeywordEntry[] = [
  ...profanity,
  ...sexual,
  ...hate,
  ...violence,
  ...spam,
];

export interface KeywordMatch {
  category: KeywordEntry["category"];
  score: number;
  count: number;
}

export function scanText(text: string): { matches: KeywordMatch[]; totalScore: number } {
  const normalized = text.toLowerCase();
  const byCategory = new Map<string, KeywordMatch>();

  for (const entry of ALL_KEYWORDS) {
    if (normalized.includes(entry.word)) {
      const existing = byCategory.get(entry.category);
      if (existing) {
        existing.score = Math.max(existing.score, entry.score);
        existing.count++;
      } else {
        byCategory.set(entry.category, { category: entry.category, score: entry.score, count: 1 });
      }
    }
  }

  const matches = Array.from(byCategory.values());
  const totalScore = matches.reduce((acc, m) => acc + m.score, 0);
  return { matches, totalScore };
}
