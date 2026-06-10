import { Test, User, Character, Series, MOCK_TESTS, MOCK_USERS, MOCK_CHARACTERS, MOCK_SERIES, MOCK_DUELS } from "./mockData";

export interface TournamentSession {
  id: string;
  testId: string;
  rounds: Round[];
  currentRoundIndex: number;
  currentMatchIndex: number;
  completed: boolean;
  champion?: string;
  createdAt: string;
}

export interface Round {
  name: string;
  matches: Match[];
}

export interface Match {
  characterAId: string;
  characterBId: string;
  winnerId?: string;
}

export interface RankingSession {
  id: string;
  testId: string;
  comparisons: Comparison[];
  currentIndex: number;
  completed: boolean;
  results?: RankingResult[];
  createdAt: string;
}

export interface Comparison {
  characterAId: string;
  characterBId: string;
  winnerId?: string;
}

export interface RankingResult {
  characterId: string;
  wins: number;
  losses: number;
  winRate: number;
  rank: number;
}

const getJSON = <T>(key: string, defaultVal: T): T => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultVal;
  } catch {
    return defaultVal;
  }
};

const setJSON = <T>(key: string, val: T): void => {
  localStorage.setItem(key, JSON.stringify(val));
};

export const storage = {
  // --- Tests ---
  getAllTests: (): Test[] => {
    const userTests = getJSON<Test[]>("charcomp_user_tests", []);
    return [...MOCK_TESTS, ...userTests];
  },
  getTestById: (id: string): Test | undefined => {
    return storage.getAllTests().find(t => t.id === id);
  },
  saveUserTest: (test: Test): void => {
    const tests = getJSON<Test[]>("charcomp_user_tests", []);
    tests.push(test);
    setJSON("charcomp_user_tests", tests);
  },

  // --- Likes & Favorites ---
  getLikes: (): Record<string, boolean> => getJSON("charcomp_likes", {}),
  toggleLike: (testId: string): boolean => {
    const likes = storage.getLikes();
    likes[testId] = !likes[testId];
    setJSON("charcomp_likes", likes);
    return likes[testId];
  },
  getFavorites: (): Record<string, boolean> => getJSON("charcomp_favorites", {}),
  toggleFavorite: (testId: string): boolean => {
    const favs = storage.getFavorites();
    favs[testId] = !favs[testId];
    setJSON("charcomp_favorites", favs);
    return favs[testId];
  },

  // --- Duels ---
  getDuelVotes: (): Record<string, "A" | "B"> => getJSON("charcomp_duel_votes", {}),
  voteDuel: (duelId: string, vote: "A" | "B"): void => {
    const votes = storage.getDuelVotes();
    votes[duelId] = vote;
    setJSON("charcomp_duel_votes", votes);
  },

  // --- Auth ---
  getCurrentUser: (): User | null => getJSON("charcomp_current_user", null),
  setCurrentUser: (user: User | null): void => setJSON("charcomp_current_user", user),

  // --- Characters (custom) ---
  getAllCharacters: (): Character[] => {
    const custom = getJSON<Character[]>("charcomp_custom_characters", []);
    return [...MOCK_CHARACTERS, ...custom];
  },
  getCharacterById: (id: string): Character | undefined => {
    return storage.getAllCharacters().find(c => c.id === id);
  },
  saveCharacter: (char: Character): void => {
    const chars = getJSON<Character[]>("charcomp_custom_characters", []);
    chars.push(char);
    setJSON("charcomp_custom_characters", chars);
  },
  updateCharacter: (char: Character): void => {
    const chars = getJSON<Character[]>("charcomp_custom_characters", []);
    const idx = chars.findIndex(c => c.id === char.id);
    if (idx !== -1) chars[idx] = char;
    setJSON("charcomp_custom_characters", chars);
  },
  deleteCharacter: (id: string): void => {
    const chars = getJSON<Character[]>("charcomp_custom_characters", []).filter(c => c.id !== id);
    setJSON("charcomp_custom_characters", chars);
  },

  // --- Series (custom) ---
  getAllSeries: (): Series[] => {
    const custom = getJSON<Series[]>("charcomp_custom_series", []);
    return [...MOCK_SERIES, ...custom];
  },
  getSeriesById: (id: string): Series | undefined => {
    return storage.getAllSeries().find(s => s.id === id);
  },
  saveSeries: (series: Series): void => {
    const all = getJSON<Series[]>("charcomp_custom_series", []);
    all.push(series);
    setJSON("charcomp_custom_series", all);
  },
  updateSeries: (series: Series): void => {
    const all = getJSON<Series[]>("charcomp_custom_series", []);
    const idx = all.findIndex(s => s.id === series.id);
    if (idx !== -1) all[idx] = series;
    setJSON("charcomp_custom_series", all);
  },
  deleteSeries: (id: string): void => {
    const all = getJSON<Series[]>("charcomp_custom_series", []).filter(s => s.id !== id);
    setJSON("charcomp_custom_series", all);
  },

  // --- Users ---
  getAllUsers: (): User[] => {
    const current = storage.getCurrentUser();
    const base = [...MOCK_USERS];
    if (current && !base.find(u => u.id === current.id)) base.push(current);
    return base;
  },
  getUserById: (id: string): User | undefined => {
    return storage.getAllUsers().find(u => u.id === id);
  },

  // --- Sessions (Tournament) ---
  getTournamentSession: (id: string): TournamentSession | null => {
    const sessions = getJSON<Record<string, TournamentSession>>("charcomp_tournament_sessions", {});
    return sessions[id] || null;
  },
  saveTournamentSession: (session: TournamentSession): void => {
    const sessions = getJSON<Record<string, TournamentSession>>("charcomp_tournament_sessions", {});
    sessions[session.id] = session;
    setJSON("charcomp_tournament_sessions", sessions);
  },

  // --- Sessions (Ranking) ---
  getRankingSession: (id: string): RankingSession | null => {
    const sessions = getJSON<Record<string, RankingSession>>("charcomp_ranking_sessions", {});
    return sessions[id] || null;
  },
  saveRankingSession: (session: RankingSession): void => {
    const sessions = getJSON<Record<string, RankingSession>>("charcomp_ranking_sessions", {});
    sessions[session.id] = session;
    setJSON("charcomp_ranking_sessions", sessions);
  },
};
