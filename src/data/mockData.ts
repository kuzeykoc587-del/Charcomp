export interface Series {
  id: string;
  name: string;
  coverImage: string;
  description: string;
  category: "Anime" | "TV" | "Movie" | "Game" | "Comic" | "Book" | "Other";
}

export interface Character {
  id: string;
  name: string;
  image: string;
  description?: string;
  seriesId: string;
  tags?: string[];
}

export interface TestStats {
  totalPlays: number;
  completedPlays: number;
  mostSelectedCharacterId?: string;
  leastSelectedCharacterId?: string;
  championHistory: string[]; // characterIds who won tournament
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
  createdAt: string;
  playCount: number;
  likeCount: number;
  favoriteCount: number;
  stats: TestStats;
}

export interface Duel {
  id: string;
  characterAId: string;
  characterBId: string;
  votesA: number;
  votesB: number;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  bio: string;
}

// Generate an avatar URL
const avatar = (name: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7C3AED&color=fff&size=400&bold=true`;
const seriesAvatar = (name: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D0D0F&color=7C3AED&size=400&bold=true`;

export const MOCK_USERS: User[] = [
  { id: "u1", name: "OtakuKing", avatar: avatar("OtakuKing"), bio: "Anime is life" },
  { id: "u2", name: "GamerPro", avatar: avatar("GamerPro"), bio: "Speedrunner and theorycrafter" },
  { id: "u3", name: "Cinephile", avatar: avatar("Cinephile"), bio: "Movies and TV shows" }
];

export const MOCK_SERIES: Series[] = [
  { id: "s1", name: "Dragon Ball", coverImage: seriesAvatar("Dragon Ball"), description: "Martial arts and energy blasts", category: "Anime" },
  { id: "s2", name: "Naruto", coverImage: seriesAvatar("Naruto"), description: "Ninja battles", category: "Anime" },
  { id: "s3", name: "One Piece", coverImage: seriesAvatar("One Piece"), description: "Pirate adventures", category: "Anime" },
  { id: "s4", name: "Marvel", coverImage: seriesAvatar("Marvel"), description: "Superheroes", category: "Comic" },
  { id: "s5", name: "DC", coverImage: seriesAvatar("DC"), description: "More superheroes", category: "Comic" },
  { id: "s6", name: "Attack on Titan", coverImage: seriesAvatar("Attack on Titan"), description: "Giant monsters and trauma", category: "Anime" },
  { id: "s7", name: "Stranger Things", coverImage: seriesAvatar("Stranger Things"), description: "Sci-fi horror", category: "TV" },
  { id: "s8", name: "Harry Potter", coverImage: seriesAvatar("Harry Potter"), description: "Magic and wizards", category: "Movie" },
];

export const MOCK_CHARACTERS: Character[] = [
  // Dragon Ball
  { id: "c_db1", name: "Goku", image: avatar("Goku"), seriesId: "s1" },
  { id: "c_db2", name: "Vegeta", image: avatar("Vegeta"), seriesId: "s1" },
  { id: "c_db3", name: "Gohan", image: avatar("Gohan"), seriesId: "s1" },
  { id: "c_db4", name: "Piccolo", image: avatar("Piccolo"), seriesId: "s1" },
  { id: "c_db5", name: "Frieza", image: avatar("Frieza"), seriesId: "s1" },
  { id: "c_db6", name: "Cell", image: avatar("Cell"), seriesId: "s1" },
  { id: "c_db7", name: "Majin Buu", image: avatar("Majin Buu"), seriesId: "s1" },
  { id: "c_db8", name: "Trunks", image: avatar("Trunks"), seriesId: "s1" },
  { id: "c_db9", name: "Android 18", image: avatar("Android 18"), seriesId: "s1" },
  { id: "c_db10", name: "Krillin", image: avatar("Krillin"), seriesId: "s1" },
  
  // Naruto
  { id: "c_n1", name: "Naruto", image: avatar("Naruto"), seriesId: "s2" },
  { id: "c_n2", name: "Sasuke", image: avatar("Sasuke"), seriesId: "s2" },
  { id: "c_n3", name: "Sakura", image: avatar("Sakura"), seriesId: "s2" },
  { id: "c_n4", name: "Kakashi", image: avatar("Kakashi"), seriesId: "s2" },
  { id: "c_n5", name: "Itachi", image: avatar("Itachi"), seriesId: "s2" },
  { id: "c_n6", name: "Pain", image: avatar("Pain"), seriesId: "s2" },
  { id: "c_n7", name: "Jiraiya", image: avatar("Jiraiya"), seriesId: "s2" },
  { id: "c_n8", name: "Tsunade", image: avatar("Tsunade"), seriesId: "s2" },
  { id: "c_n9", name: "Gaara", image: avatar("Gaara"), seriesId: "s2" },
  { id: "c_n10", name: "Rock Lee", image: avatar("Rock Lee"), seriesId: "s2" },

  // One Piece
  { id: "c_op1", name: "Luffy", image: avatar("Luffy"), seriesId: "s3" },
  { id: "c_op2", name: "Zoro", image: avatar("Zoro"), seriesId: "s3" },
  { id: "c_op3", name: "Nami", image: avatar("Nami"), seriesId: "s3" },
  { id: "c_op4", name: "Usopp", image: avatar("Usopp"), seriesId: "s3" },
  { id: "c_op5", name: "Sanji", image: avatar("Sanji"), seriesId: "s3" },
  { id: "c_op6", name: "Robin", image: avatar("Robin"), seriesId: "s3" },
  { id: "c_op7", name: "Chopper", image: avatar("Chopper"), seriesId: "s3" },
  { id: "c_op8", name: "Franky", image: avatar("Franky"), seriesId: "s3" },
  { id: "c_op9", name: "Brook", image: avatar("Brook"), seriesId: "s3" },
  { id: "c_op10", name: "Ace", image: avatar("Ace"), seriesId: "s3" },

  // Marvel
  { id: "c_m1", name: "Spider-Man", image: avatar("Spider-Man"), seriesId: "s4" },
  { id: "c_m2", name: "Iron Man", image: avatar("Iron Man"), seriesId: "s4" },
  { id: "c_m3", name: "Thor", image: avatar("Thor"), seriesId: "s4" },
  { id: "c_m4", name: "Captain America", image: avatar("Captain America"), seriesId: "s4" },
  { id: "c_m5", name: "Black Widow", image: avatar("Black Widow"), seriesId: "s4" },
  { id: "c_m6", name: "Hulk", image: avatar("Hulk"), seriesId: "s4" },
  { id: "c_m7", name: "Black Panther", image: avatar("Black Panther"), seriesId: "s4" },
  { id: "c_m8", name: "Wolverine", image: avatar("Wolverine"), seriesId: "s4" },

  // DC
  { id: "c_dc1", name: "Batman", image: avatar("Batman"), seriesId: "s5" },
  { id: "c_dc2", name: "Superman", image: avatar("Superman"), seriesId: "s5" },
  { id: "c_dc3", name: "Wonder Woman", image: avatar("Wonder Woman"), seriesId: "s5" },
  { id: "c_dc4", name: "The Flash", image: avatar("The Flash"), seriesId: "s5" },
  { id: "c_dc5", name: "Aquaman", image: avatar("Aquaman"), seriesId: "s5" },
  { id: "c_dc6", name: "Joker", image: avatar("Joker"), seriesId: "s5" },
  { id: "c_dc7", name: "Harley Quinn", image: avatar("Harley Quinn"), seriesId: "s5" },
  { id: "c_dc8", name: "Green Lantern", image: avatar("Green Lantern"), seriesId: "s5" },

  // AoT
  { id: "c_a1", name: "Eren", image: avatar("Eren"), seriesId: "s6" },
  { id: "c_a2", name: "Mikasa", image: avatar("Mikasa"), seriesId: "s6" },
  { id: "c_a3", name: "Armin", image: avatar("Armin"), seriesId: "s6" },
  { id: "c_a4", name: "Levi", image: avatar("Levi"), seriesId: "s6" },
  { id: "c_a5", name: "Hange", image: avatar("Hange"), seriesId: "s6" },
  { id: "c_a6", name: "Reiner", image: avatar("Reiner"), seriesId: "s6" },
  { id: "c_a7", name: "Annie", image: avatar("Annie"), seriesId: "s6" },
  { id: "c_a8", name: "Erwin", image: avatar("Erwin"), seriesId: "s6" },

  // Stranger Things
  { id: "c_st1", name: "Eleven", image: avatar("Eleven"), seriesId: "s7" },
  { id: "c_st2", name: "Mike", image: avatar("Mike"), seriesId: "s7" },
  { id: "c_st3", name: "Dustin", image: avatar("Dustin"), seriesId: "s7" },
  { id: "c_st4", name: "Will", image: avatar("Will"), seriesId: "s7" },
  { id: "c_st5", name: "Max", image: avatar("Max"), seriesId: "s7" },
  { id: "c_st6", name: "Jim", image: avatar("Jim Hopper"), seriesId: "s7" },
  { id: "c_st7", name: "Joyce", image: avatar("Joyce"), seriesId: "s7" },
  { id: "c_st8", name: "Billy", image: avatar("Billy"), seriesId: "s7" },

  // Harry Potter
  { id: "c_hp1", name: "Harry", image: avatar("Harry Potter"), seriesId: "s8" },
  { id: "c_hp2", name: "Hermione", image: avatar("Hermione"), seriesId: "s8" },
  { id: "c_hp3", name: "Ron", image: avatar("Ron"), seriesId: "s8" },
  { id: "c_hp4", name: "Dumbledore", image: avatar("Dumbledore"), seriesId: "s8" },
  { id: "c_hp5", name: "Voldemort", image: avatar("Voldemort"), seriesId: "s8" },
  { id: "c_hp6", name: "Snape", image: avatar("Snape"), seriesId: "s8" },
  { id: "c_hp7", name: "Malfoy", image: avatar("Malfoy"), seriesId: "s8" },
];

export const MOCK_TESTS: Test[] = [
  {
    id: "t1",
    title: "Dragon Ball Power Rankings",
    description: "Rank all the strongest fighters in the DB universe.",
    coverImage: avatar("Dragon Ball Rankings"),
    creatorId: "u1",
    language: "en",
    characterIds: MOCK_CHARACTERS.filter(c => c.seriesId === "s1").map(c => c.id),
    createdAt: new Date().toISOString(),
    playCount: 1542,
    likeCount: 342,
    favoriteCount: 89,
    stats: { totalPlays: 1542, completedPlays: 1200, championHistory: [], matchupStats: {} }
  },
  {
    id: "t2",
    title: "Naruto vs All",
    description: "Who is the strongest ninja?",
    coverImage: avatar("Naruto vs All"),
    creatorId: "u2",
    language: "en",
    characterIds: MOCK_CHARACTERS.filter(c => c.seriesId === "s2").map(c => c.id),
    createdAt: new Date().toISOString(),
    playCount: 980,
    likeCount: 210,
    favoriteCount: 45,
    stats: { totalPlays: 980, completedPlays: 800, championHistory: [], matchupStats: {} }
  },
  {
    id: "t3",
    title: "Anime Legends Showdown",
    description: "Goku, Naruto, Luffy, and more. Who takes the crown?",
    coverImage: avatar("Anime Legends"),
    creatorId: "u1",
    language: "en",
    characterIds: ["c_db1", "c_n1", "c_op1", "c_a1", "c_a4", "c_db2", "c_n2", "c_op2"],
    createdAt: new Date().toISOString(),
    playCount: 5430,
    likeCount: 1205,
    favoriteCount: 430,
    stats: { totalPlays: 5430, completedPlays: 4900, championHistory: [], matchupStats: {} }
  },
  {
    id: "t4",
    title: "Villain Bracket",
    description: "The ultimate tournament of bad guys across universes.",
    coverImage: avatar("Villain Bracket"),
    creatorId: "u3",
    language: "en",
    characterIds: ["c_db5", "c_db6", "c_n5", "c_n6", "c_dc6", "c_dc7", "c_hp5", "c_hp6"],
    createdAt: new Date().toISOString(),
    playCount: 2310,
    likeCount: 450,
    favoriteCount: 120,
    stats: { totalPlays: 2310, completedPlays: 2000, championHistory: [], matchupStats: {} }
  },
  {
    id: "t5",
    title: "Best Shonen Hero",
    description: "Rank your favorite protagonists.",
    coverImage: avatar("Best Shonen"),
    creatorId: "u2",
    language: "en",
    characterIds: ["c_db1", "c_n1", "c_op1", "c_a1"],
    createdAt: new Date().toISOString(),
    playCount: 1120,
    likeCount: 300,
    favoriteCount: 75,
    stats: { totalPlays: 1120, completedPlays: 1000, championHistory: [], matchupStats: {} }
  },
  {
    id: "t6",
    title: "Stranger Things Character Tier",
    description: "Rank everyone in Hawkins.",
    coverImage: avatar("Stranger Things Tier"),
    creatorId: "u3",
    language: "en",
    characterIds: MOCK_CHARACTERS.filter(c => c.seriesId === "s7").map(c => c.id),
    createdAt: new Date().toISOString(),
    playCount: 890,
    likeCount: 150,
    favoriteCount: 40,
    stats: { totalPlays: 890, completedPlays: 750, championHistory: [], matchupStats: {} }
  }
];

export const MOCK_DUELS: Duel[] = [
  { id: "d1", characterAId: "c_db1", characterBId: "c_n1", votesA: 5400, votesB: 3200 }, // Goku vs Naruto
  { id: "d2", characterAId: "c_dc1", characterBId: "c_m2", votesA: 4100, votesB: 4500 }, // Batman vs Iron Man
  { id: "d3", characterAId: "c_op1", characterBId: "c_op2", votesA: 2800, votesB: 2900 }, // Luffy vs Zoro
  { id: "d4", characterAId: "c_a1", characterBId: "c_a4", votesA: 1500, votesB: 3500 }, // Eren vs Levi
  { id: "d5", characterAId: "c_st1", characterBId: "c_st2", votesA: 2100, votesB: 800 }, // Eleven vs Mike
  { id: "d6", characterAId: "c_hp1", characterBId: "c_hp2", votesA: 1900, votesB: 2200 }, // Harry vs Hermione
  { id: "d7", characterAId: "c_dc2", characterBId: "c_m3", votesA: 3800, votesB: 3100 }, // Superman vs Thor
  { id: "d8", characterAId: "c_n2", characterBId: "c_n5", votesA: 2500, votesB: 4200 }, // Sasuke vs Itachi
  { id: "d9", characterAId: "c_db2", characterBId: "c_db1", votesA: 3100, votesB: 4900 }, // Vegeta vs Goku
  { id: "d10", characterAId: "c_m1", characterBId: "c_dc1", votesA: 4500, votesB: 4300 }, // Spider-Man vs Batman
  { id: "d11", characterAId: "c_dc3", characterBId: "c_m5", votesA: 3200, votesB: 1800 }, // Wonder Woman vs Black Widow
  { id: "d12", characterAId: "c_a2", characterBId: "c_a7", votesA: 2800, votesB: 1200 }, // Mikasa vs Annie
  { id: "d13", characterAId: "c_hp5", characterBId: "c_db5", votesA: 1100, votesB: 3900 }, // Voldemort vs Frieza
  { id: "d14", characterAId: "c_n4", characterBId: "c_db4", votesA: 2400, votesB: 1600 }, // Kakashi vs Piccolo
  { id: "d15", characterAId: "c_op3", characterBId: "c_op6", votesA: 1500, votesB: 1900 }, // Nami vs Robin
];
