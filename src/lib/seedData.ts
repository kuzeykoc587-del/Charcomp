export type SeriesCategory = "Anime" | "TV" | "Movie" | "Game" | "Comic" | "Book" | "Other";

export interface SeedSeries {
  id: string;
  name: string;
  coverImage: string;
  description: string;
  category: SeriesCategory;
}

export interface SeedCharacter {
  id: string;
  name: string;
  image: string;
  description: string;
  seriesId: string;
  tags: string[];
}

const img = (name: string, bg = "7C3AED") =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&size=400&bold=true`;

const seriesImg = (name: string) => img(name, "1a1a2e");

export const SEED_SERIES: SeedSeries[] = [
  // ===================== ANIME =====================
  { id: "s_db", name: "Dragon Ball", coverImage: seriesImg("Dragon Ball"), description: "Epic martial arts saga following Goku from child warrior to universal defender.", category: "Anime" },
  { id: "s_na", name: "Naruto", coverImage: seriesImg("Naruto"), description: "A young ninja's journey to become Hokage and protect his village.", category: "Anime" },
  { id: "s_op", name: "One Piece", coverImage: seriesImg("One Piece"), description: "Pirate adventures in search of the ultimate treasure, the One Piece.", category: "Anime" },
  { id: "s_bl", name: "Bleach", coverImage: seriesImg("Bleach"), description: "A high school student gains Soul Reaper powers and defends the living world.", category: "Anime" },
  { id: "s_at", name: "Attack on Titan", coverImage: seriesImg("Attack on Titan"), description: "Humanity's struggle for survival against man-eating giants.", category: "Anime" },
  { id: "s_dn", name: "Death Note", coverImage: seriesImg("Death Note"), description: "A genius student finds a supernatural notebook that kills anyone whose name is written in it.", category: "Anime" },
  { id: "s_ds", name: "Demon Slayer", coverImage: seriesImg("Demon Slayer"), description: "A boy becomes a demon slayer to avenge his family and cure his sister.", category: "Anime" },
  { id: "s_jjk", name: "Jujutsu Kaisen", coverImage: seriesImg("Jujutsu Kaisen"), description: "Cursed spirits and sorcerers battle in a dark supernatural world.", category: "Anime" },
  { id: "s_hxh", name: "Hunter x Hunter", coverImage: seriesImg("Hunter x Hunter"), description: "A boy searches for his father by becoming a professional Hunter.", category: "Anime" },
  { id: "s_fma", name: "Fullmetal Alchemist", coverImage: seriesImg("Fullmetal Alchemist"), description: "Two brothers use alchemy to search for the Philosopher's Stone.", category: "Anime" },
  { id: "s_jojo", name: "JoJo's Bizarre Adventure", coverImage: seriesImg("JoJo's Bizarre Adventure"), description: "Generations of the Joestar family face supernatural threats.", category: "Anime" },
  { id: "s_bc", name: "Black Clover", coverImage: seriesImg("Black Clover"), description: "A boy born without magic aims to become the Wizard King.", category: "Anime" },
  { id: "s_mha", name: "My Hero Academia", coverImage: seriesImg("My Hero Academia"), description: "In a world of superpowers, a powerless boy dreams of becoming the greatest hero.", category: "Anime" },
  { id: "s_csm", name: "Chainsaw Man", coverImage: seriesImg("Chainsaw Man"), description: "A devil hunter merges with a chainsaw devil to fight for survival.", category: "Anime" },
  { id: "s_tg", name: "Tokyo Ghoul", coverImage: seriesImg("Tokyo Ghoul"), description: "A student becomes half-ghoul and struggles between two worlds.", category: "Anime" },
  { id: "s_rz", name: "Re:Zero", coverImage: seriesImg("Re Zero"), description: "A young man is transported to a fantasy world with the power to return by death.", category: "Anime" },
  { id: "s_ov", name: "Overlord", coverImage: seriesImg("Overlord"), description: "A game player is trapped in a virtual world as his powerful skeletal character.", category: "Anime" },
  { id: "s_ft", name: "Fairy Tail", coverImage: seriesImg("Fairy Tail"), description: "A powerful guild of mages go on adventures across a magical world.", category: "Anime" },
  { id: "s_cg", name: "Code Geass", coverImage: seriesImg("Code Geass"), description: "An exiled prince uses a supernatural power to lead a rebellion.", category: "Anime" },
  { id: "s_sg", name: "Steins;Gate", coverImage: seriesImg("Steins Gate"), description: "A self-proclaimed mad scientist accidentally discovers time travel.", category: "Anime" },
  { id: "s_spy", name: "Spy x Family", coverImage: seriesImg("Spy x Family"), description: "A spy, an assassin, and a telepath form a fake family with real bonds.", category: "Anime" },
  { id: "s_blue", name: "Blue Lock", coverImage: seriesImg("Blue Lock"), description: "Strikers compete in a radical program to produce Japan's greatest soccer player.", category: "Anime" },
  { id: "s_hq", name: "Haikyuu", coverImage: seriesImg("Haikyuu"), description: "A short volleyball player proves size doesn't determine greatness.", category: "Anime" },
  { id: "s_sd", name: "Slam Dunk", coverImage: seriesImg("Slam Dunk"), description: "A delinquent discovers basketball and transforms himself and his team.", category: "Anime" },
  { id: "s_vs", name: "Vinland Saga", coverImage: seriesImg("Vinland Saga"), description: "A Viking warrior seeks revenge and ultimately finds peace.", category: "Anime" },
  { id: "s_sl", name: "Solo Leveling", coverImage: seriesImg("Solo Leveling"), description: "The world's weakest hunter becomes the strongest through a mysterious system.", category: "Anime" },
  { id: "s_kn", name: "Kaiju No. 8", coverImage: seriesImg("Kaiju No 8"), description: "A man transforms into a powerful kaiju while fighting to join the Defense Force.", category: "Anime" },
  { id: "s_dst", name: "Dr. Stone", coverImage: seriesImg("Dr Stone"), description: "A genius uses science to rebuild civilization from the Stone Age.", category: "Anime" },
  { id: "s_mp", name: "Mob Psycho 100", coverImage: seriesImg("Mob Psycho 100"), description: "A massively powerful psychic tries to live a normal life.", category: "Anime" },
  { id: "s_opm", name: "One Punch Man", coverImage: seriesImg("One Punch Man"), description: "A hero who defeats any enemy with a single punch searches for meaning.", category: "Anime" },
  { id: "s_pok", name: "Pokémon", coverImage: seriesImg("Pokemon"), description: "Trainers capture and battle magical creatures in search of glory.", category: "Anime" },
  { id: "s_arc", name: "Arcane", coverImage: seriesImg("Arcane"), description: "Two sisters are torn apart by a conflict between two cities.", category: "Anime" },

  // ===================== TV SERIES =====================
  { id: "s_st", name: "Stranger Things", coverImage: seriesImg("Stranger Things"), description: "Kids uncover supernatural mysteries in 1980s small-town Indiana.", category: "TV" },
  { id: "s_bb", name: "Breaking Bad", coverImage: seriesImg("Breaking Bad"), description: "A chemistry teacher becomes a drug kingpin after a terminal diagnosis.", category: "TV" },
  { id: "s_bcs", name: "Better Call Saul", coverImage: seriesImg("Better Call Saul"), description: "A small-time lawyer transforms into the morally compromised Saul Goodman.", category: "TV" },
  { id: "s_tb", name: "The Boys", coverImage: seriesImg("The Boys"), description: "A group of vigilantes fight corrupt corporate superheroes.", category: "TV" },
  { id: "s_wd", name: "The Walking Dead", coverImage: seriesImg("The Walking Dead"), description: "Survivors navigate a zombie apocalypse and the cruelty of other humans.", category: "TV" },
  { id: "s_got", name: "Game of Thrones", coverImage: seriesImg("Game of Thrones"), description: "Noble houses fight for control of the Iron Throne in a medieval fantasy world.", category: "TV" },
  { id: "s_hotd", name: "House of the Dragon", coverImage: seriesImg("House of the Dragon"), description: "The Targaryen civil war over succession tears a dynasty apart.", category: "TV" },
  { id: "s_sh", name: "Sherlock", coverImage: seriesImg("Sherlock"), description: "A modern-day Sherlock Holmes solves crimes with his partner Watson.", category: "TV" },
  { id: "s_dw", name: "Doctor Who", coverImage: seriesImg("Doctor Who"), description: "A Time Lord travels through time and space protecting the universe.", category: "TV" },
  { id: "s_luc", name: "Lucifer", coverImage: seriesImg("Lucifer"), description: "The Devil abandons Hell to run a nightclub in Los Angeles.", category: "TV" },
  { id: "s_wed", name: "Wednesday", coverImage: seriesImg("Wednesday"), description: "Wednesday Addams investigates murders at a school for supernatural beings.", category: "TV" },
  { id: "s_pb", name: "Prison Break", coverImage: seriesImg("Prison Break"), description: "A man engineers his own imprisonment to break his brother out of death row.", category: "TV" },
  { id: "s_mand", name: "The Mandalorian", coverImage: seriesImg("The Mandalorian"), description: "A lone bounty hunter protects a mysterious child across the galaxy.", category: "TV" },
  { id: "s_rick", name: "Rick and Morty", coverImage: seriesImg("Rick and Morty"), description: "An alcoholic scientist drags his grandson on insane interdimensional adventures.", category: "TV" },
  { id: "s_ava", name: "Avatar: The Last Airbender", coverImage: seriesImg("Avatar ATLA"), description: "A young Avatar must master all four elements to save the world.", category: "TV" },

  // ===================== MOVIES =====================
  { id: "s_mcu", name: "Marvel Cinematic Universe", coverImage: seriesImg("Marvel MCU"), description: "Earth's mightiest heroes join forces against universe-threatening villains.", category: "Movie" },
  { id: "s_dcu", name: "DC Universe", coverImage: seriesImg("DC Universe"), description: "DC's greatest heroes defend the world from extraordinary threats.", category: "Movie" },
  { id: "s_sw", name: "Star Wars", coverImage: seriesImg("Star Wars"), description: "An epic space opera about the battle between the Force's light and dark sides.", category: "Movie" },
  { id: "s_lotr", name: "Lord of the Rings", coverImage: seriesImg("Lord of the Rings"), description: "A fellowship sets out to destroy the One Ring and defeat the Dark Lord.", category: "Movie" },
  { id: "s_hp", name: "Harry Potter", coverImage: seriesImg("Harry Potter"), description: "A young wizard's years at Hogwarts and battle against the dark wizard Voldemort.", category: "Movie" },
  { id: "s_jp", name: "Jurassic Park", coverImage: seriesImg("Jurassic Park"), description: "A theme park of resurrected dinosaurs spirals into deadly chaos.", category: "Movie" },
  { id: "s_av", name: "Avatar", coverImage: seriesImg("Avatar Movie"), description: "A paraplegic marine bonds with the Na'vi people on a distant moon.", category: "Movie" },
  { id: "s_potc", name: "Pirates of the Caribbean", coverImage: seriesImg("Pirates Caribbean"), description: "A charming pirate sails the seas seeking treasure and freedom.", category: "Movie" },
  { id: "s_mx", name: "The Matrix", coverImage: seriesImg("The Matrix"), description: "A hacker discovers reality is a simulation and joins a rebellion.", category: "Movie" },
  { id: "s_term", name: "Terminator", coverImage: seriesImg("Terminator"), description: "Cyborg assassins from the future battle to control humanity's fate.", category: "Movie" },
  { id: "s_jw", name: "John Wick", coverImage: seriesImg("John Wick"), description: "A retired hitman wages war against a criminal underworld.", category: "Movie" },
  { id: "s_mi", name: "Mission Impossible", coverImage: seriesImg("Mission Impossible"), description: "An elite agent tackles impossible covert missions.", category: "Movie" },
  { id: "s_dune", name: "Dune", coverImage: seriesImg("Dune"), description: "A noble heir navigates politics and prophecy on a desert planet.", category: "Movie" },
  { id: "s_spv", name: "Spider-Verse", coverImage: seriesImg("Spider Verse"), description: "Multiple Spider-People from different dimensions team up to save the multiverse.", category: "Movie" },

  // ===================== BOOKS =====================
  { id: "s_pj", name: "Percy Jackson", coverImage: seriesImg("Percy Jackson"), description: "A boy discovers he is the son of a Greek god and must save Olympus.", category: "Book" },
  { id: "s_hg", name: "Hunger Games", coverImage: seriesImg("Hunger Games"), description: "Teenagers fight to the death in a dystopian televised competition.", category: "Book" },
  { id: "s_narn", name: "Narnia", coverImage: seriesImg("Narnia"), description: "Children discover a magical world through a wardrobe.", category: "Book" },
  { id: "s_mz", name: "Maze Runner", coverImage: seriesImg("Maze Runner"), description: "Teenagers escape a deadly maze and uncover a devastating conspiracy.", category: "Book" },
  { id: "s_div", name: "Divergent", coverImage: seriesImg("Divergent"), description: "A girl discovers she doesn't fit into society's rigid factions.", category: "Book" },
  { id: "s_sob", name: "Shadow and Bone", coverImage: seriesImg("Shadow and Bone"), description: "A young soldier discovers she has the power to destroy a world-splitting darkness.", category: "Book" },
  { id: "s_er", name: "Eragon", coverImage: seriesImg("Eragon"), description: "A farm boy finds a dragon egg and becomes the last Dragon Rider.", category: "Book" },

  // ===================== GAMES =====================
  { id: "s_lol", name: "League of Legends", coverImage: seriesImg("League of Legends"), description: "Champions battle in a 5v5 strategic arena game.", category: "Game" },
  { id: "s_val", name: "Valorant", coverImage: seriesImg("Valorant"), description: "Agents with unique abilities compete in a tactical first-person shooter.", category: "Game" },
  { id: "s_ow", name: "Overwatch", coverImage: seriesImg("Overwatch"), description: "Heroes with unique skills battle across the globe in the near future.", category: "Game" },
  { id: "s_gi", name: "Genshin Impact", coverImage: seriesImg("Genshin Impact"), description: "Travelers explore a vast elemental world in search of a lost sibling.", category: "Game" },
  { id: "s_hsr", name: "Honkai Star Rail", coverImage: seriesImg("Honkai Star Rail"), description: "Trailblazers journey across the cosmos on a space train.", category: "Game" },
  { id: "s_mc", name: "Minecraft", coverImage: seriesImg("Minecraft"), description: "Players build, explore, and survive in an infinite blocky world.", category: "Game" },
  { id: "s_gta", name: "GTA", coverImage: seriesImg("GTA"), description: "Open-world crime saga across sprawling cities.", category: "Game" },
  { id: "s_rdr", name: "Red Dead Redemption", coverImage: seriesImg("Red Dead Redemption"), description: "An outlaw navigates the dying days of the American frontier.", category: "Game" },
  { id: "s_cp", name: "Cyberpunk 2077", coverImage: seriesImg("Cyberpunk 2077"), description: "A mercenary fights for survival in a neon-drenched dystopian city.", category: "Game" },
  { id: "s_er2", name: "Elden Ring", coverImage: seriesImg("Elden Ring"), description: "A Tarnished seeks to become Elden Lord in a shattered fantasy realm.", category: "Game" },
  { id: "s_ds2", name: "Dark Souls", coverImage: seriesImg("Dark Souls"), description: "Undead warriors struggle against impossible odds in a world of fire and darkness.", category: "Game" },
  { id: "s_sky", name: "Skyrim", coverImage: seriesImg("Skyrim"), description: "A Dragonborn must stop a world-ending dragon in a Norse-inspired land.", category: "Game" },
  { id: "s_fo", name: "Fallout", coverImage: seriesImg("Fallout"), description: "Survivors explore a post-nuclear wasteland in a retro-futuristic America.", category: "Game" },
  { id: "s_ac", name: "Assassin's Creed", coverImage: seriesImg("Assassins Creed"), description: "Assassins battle Templars across history's most iconic moments.", category: "Game" },
  { id: "s_gow", name: "God of War", coverImage: seriesImg("God of War"), description: "A Spartan warrior and his son face gods and monsters across mythologies.", category: "Game" },
  { id: "s_tlou", name: "The Last of Us", coverImage: seriesImg("The Last of Us"), description: "A smuggler escorts a girl immune to a fungal pandemic across a ruined America.", category: "Game" },
  { id: "s_halo", name: "Halo", coverImage: seriesImg("Halo"), description: "A super-soldier battles alien threats across the galaxy.", category: "Game" },
  { id: "s_re", name: "Resident Evil", coverImage: seriesImg("Resident Evil"), description: "Survivors fight bioweapons and conspiracies in viral outbreaks.", category: "Game" },
  { id: "s_zelda", name: "The Legend of Zelda", coverImage: seriesImg("Legend of Zelda"), description: "The hero Link battles evil to protect the kingdom of Hyrule.", category: "Game" },
  { id: "s_da", name: "Dragon Age", coverImage: seriesImg("Dragon Age"), description: "Warriors and mages battle darkspawn in a high fantasy world.", category: "Game" },

  // ===================== COMICS =====================
  { id: "s_mvc", name: "Marvel Comics", coverImage: seriesImg("Marvel Comics"), description: "Earth's mightiest heroes in their comic book adventures.", category: "Comic" },
  { id: "s_dcc", name: "DC Comics", coverImage: seriesImg("DC Comics"), description: "DC's greatest heroes from the original comic universe.", category: "Comic" },
  { id: "s_inv", name: "Invincible", coverImage: seriesImg("Invincible"), description: "A teenager inherits his father's superpowers with earth-shaking consequences.", category: "Comic" },
  { id: "s_spawn", name: "Spawn", coverImage: seriesImg("Spawn"), description: "A murdered soldier returns from Hell as a Hellspawn.", category: "Comic" },
  { id: "s_tmnt", name: "Teenage Mutant Ninja Turtles", coverImage: seriesImg("TMNT"), description: "Four mutant turtles trained as ninja protect New York City.", category: "Comic" },
  { id: "s_saga", name: "Saga", coverImage: seriesImg("Saga Comics"), description: "Star-crossed lovers from warring species flee across the universe.", category: "Comic" },
  { id: "s_wm", name: "Watchmen", coverImage: seriesImg("Watchmen"), description: "Retired superheroes investigate a murder in an alternate Cold War America.", category: "Comic" },
  { id: "s_tbc", name: "The Boys (Comics)", coverImage: seriesImg("The Boys Comics"), description: "The original dark comic series about corrupt superheroes.", category: "Comic" },
];

export const SEED_CHARACTERS: SeedCharacter[] = [
  // ── Dragon Ball ──
  { id: "c_db_goku", name: "Goku", image: img("Goku"), description: "The legendary Super Saiyan warrior.", seriesId: "s_db", tags: ["protagonist", "saiyan"] },
  { id: "c_db_vegeta", name: "Vegeta", image: img("Vegeta"), description: "The proud Prince of Saiyans.", seriesId: "s_db", tags: ["saiyan", "rival"] },
  { id: "c_db_gohan", name: "Gohan", image: img("Gohan"), description: "Goku's son with hidden power.", seriesId: "s_db", tags: ["saiyan", "scholar"] },
  { id: "c_db_piccolo", name: "Piccolo", image: img("Piccolo"), description: "A Namekian warrior and mentor.", seriesId: "s_db", tags: ["namekian"] },
  { id: "c_db_frieza", name: "Frieza", image: img("Frieza"), description: "The tyrannical galactic emperor.", seriesId: "s_db", tags: ["villain", "emperor"] },
  { id: "c_db_cell", name: "Cell", image: img("Cell"), description: "A perfect android created to destroy.", seriesId: "s_db", tags: ["villain", "android"] },
  { id: "c_db_buu", name: "Majin Buu", image: img("Majin Buu"), description: "An ancient magical creature of destruction.", seriesId: "s_db", tags: ["villain", "magic"] },
  { id: "c_db_trunks", name: "Trunks", image: img("Trunks"), description: "Vegeta's son from the future.", seriesId: "s_db", tags: ["saiyan", "time-traveler"] },

  // ── Naruto ──
  { id: "c_na_naruto", name: "Naruto", image: img("Naruto"), description: "The knucklehead ninja who became Hokage.", seriesId: "s_na", tags: ["protagonist", "jinchuriki"] },
  { id: "c_na_sasuke", name: "Sasuke", image: img("Sasuke"), description: "The last surviving Uchiha seeking redemption.", seriesId: "s_na", tags: ["uchiha", "rival"] },
  { id: "c_na_sakura", name: "Sakura", image: img("Sakura"), description: "A skilled medical ninja with tremendous strength.", seriesId: "s_na", tags: ["medic", "kunoichi"] },
  { id: "c_na_kakashi", name: "Kakashi", image: img("Kakashi"), description: "The copy ninja who becomes the sixth Hokage.", seriesId: "s_na", tags: ["sensei", "hokage"] },
  { id: "c_na_itachi", name: "Itachi", image: img("Itachi"), description: "Sasuke's brother, a tragic hero of the Uchiha.", seriesId: "s_na", tags: ["uchiha", "anbu"] },
  { id: "c_na_pain", name: "Pain", image: img("Pain"), description: "Leader of Akatsuki who seeks peace through pain.", seriesId: "s_na", tags: ["akatsuki", "rinnegan"] },

  // ── One Piece ──
  { id: "c_op_luffy", name: "Luffy", image: img("Luffy"), description: "The rubber man who will become King of Pirates.", seriesId: "s_op", tags: ["protagonist", "captain"] },
  { id: "c_op_zoro", name: "Zoro", image: img("Zoro"), description: "Three-sword style swordsman aiming to be the world's greatest.", seriesId: "s_op", tags: ["swordsman", "navigator"] },
  { id: "c_op_nami", name: "Nami", image: img("Nami"), description: "Navigator and weather specialist of the Straw Hats.", seriesId: "s_op", tags: ["navigator", "thief"] },
  { id: "c_op_sanji", name: "Sanji", image: img("Sanji"), description: "Chef and kick-fighter with flames on his legs.", seriesId: "s_op", tags: ["chef", "vinsmoke"] },
  { id: "c_op_robin", name: "Robin", image: img("Robin"), description: "Archaeologist who can bloom body parts anywhere.", seriesId: "s_op", tags: ["archaeologist", "devil-fruit"] },
  { id: "c_op_ace", name: "Ace", image: img("Ace"), description: "Luffy's fire-wielding older brother.", seriesId: "s_op", tags: ["logia", "whitebeard"] },

  // ── Bleach ──
  { id: "c_bl_ichigo", name: "Ichigo", image: img("Ichigo"), description: "A human with Soul Reaper powers.", seriesId: "s_bl", tags: ["substitute-shinigami"] },
  { id: "c_bl_rukia", name: "Rukia", image: img("Rukia"), description: "The Soul Reaper who gave Ichigo her powers.", seriesId: "s_bl", tags: ["shinigami", "kuchiki"] },
  { id: "c_bl_aizen", name: "Aizen", image: img("Aizen"), description: "The mastermind villain who sought to become a god.", seriesId: "s_bl", tags: ["villain", "captain"] },
  { id: "c_bl_urahara", name: "Urahara", image: img("Urahara"), description: "Mysterious shopkeeper and genius inventor.", seriesId: "s_bl", tags: ["former-captain", "genius"] },
  { id: "c_bl_byakuya", name: "Byakuya", image: img("Byakuya"), description: "Noble captain of the Kuchiki clan.", seriesId: "s_bl", tags: ["captain", "noble"] },

  // ── Attack on Titan ──
  { id: "c_at_eren", name: "Eren", image: img("Eren"), description: "A boy who vowed to destroy all Titans.", seriesId: "s_at", tags: ["titan-shifter", "protagonist"] },
  { id: "c_at_mikasa", name: "Mikasa", image: img("Mikasa"), description: "Humanity's greatest soldier and Eren's protector.", seriesId: "s_at", tags: ["soldier", "ackerman"] },
  { id: "c_at_levi", name: "Levi", image: img("Levi"), description: "Humanity's strongest soldier, captain of the Survey Corps.", seriesId: "s_at", tags: ["captain", "ackerman"] },
  { id: "c_at_armin", name: "Armin", image: img("Armin"), description: "A brilliant strategist who becomes commander.", seriesId: "s_at", tags: ["strategist", "titan-shifter"] },
  { id: "c_at_erwin", name: "Erwin", image: img("Erwin"), description: "The charismatic and calculating Survey Corps commander.", seriesId: "s_at", tags: ["commander"] },

  // ── Death Note ──
  { id: "c_dn_light", name: "Light Yagami", image: img("Light Yagami"), description: "The genius student who becomes the god of the new world.", seriesId: "s_dn", tags: ["protagonist", "kira"] },
  { id: "c_dn_l", name: "L", image: img("L Lawliet"), description: "The world's greatest detective hunting Kira.", seriesId: "s_dn", tags: ["detective", "genius"] },
  { id: "c_dn_ryuk", name: "Ryuk", image: img("Ryuk"), description: "The bored Shinigami who dropped his Death Note.", seriesId: "s_dn", tags: ["shinigami"] },
  { id: "c_dn_misa", name: "Misa", image: img("Misa Amane"), description: "A model and devoted follower of Kira.", seriesId: "s_dn", tags: ["shinigami-eyes"] },

  // ── Demon Slayer ──
  { id: "c_ds_tanjiro", name: "Tanjiro", image: img("Tanjiro"), description: "A kind-hearted boy who becomes a demon slayer.", seriesId: "s_ds", tags: ["protagonist", "slayer"] },
  { id: "c_ds_nezuko", name: "Nezuko", image: img("Nezuko"), description: "Tanjiro's sister turned into a unique demon.", seriesId: "s_ds", tags: ["demon", "sister"] },
  { id: "c_ds_zenitsu", name: "Zenitsu", image: img("Zenitsu"), description: "A cowardly slayer who is deadly when unconscious.", seriesId: "s_ds", tags: ["thunder-breathing"] },
  { id: "c_ds_inosuke", name: "Inosuke", image: img("Inosuke"), description: "A feral slayer raised by boars.", seriesId: "s_ds", tags: ["beast-breathing"] },
  { id: "c_ds_muzan", name: "Muzan", image: img("Muzan"), description: "The progenitor of all demons.", seriesId: "s_ds", tags: ["villain", "demon-king"] },

  // ── Jujutsu Kaisen ──
  { id: "c_jjk_gojo", name: "Gojo Satoru", image: img("Gojo Satoru"), description: "The world's strongest jujutsu sorcerer.", seriesId: "s_jjk", tags: ["sensei", "six-eyes"] },
  { id: "c_jjk_yuji", name: "Yuji Itadori", image: img("Yuji Itadori"), description: "A vessel for the curse king Sukuna.", seriesId: "s_jjk", tags: ["protagonist", "vessel"] },
  { id: "c_jjk_sukuna", name: "Ryomen Sukuna", image: img("Sukuna"), description: "The King of Curses dwelling in Yuji's body.", seriesId: "s_jjk", tags: ["villain", "curse-king"] },
  { id: "c_jjk_megumi", name: "Megumi Fushiguro", image: img("Megumi Fushiguro"), description: "A sorcerer who commands shadow beasts.", seriesId: "s_jjk", tags: ["ten-shadows"] },
  { id: "c_jjk_nobara", name: "Nobara Kugisaki", image: img("Nobara"), description: "A fierce sorcerer who uses hammers and nails.", seriesId: "s_jjk", tags: ["kunoichi"] },

  // ── Hunter x Hunter ──
  { id: "c_hxh_gon", name: "Gon", image: img("Gon Freecss"), description: "A cheerful boy searching for his Hunter father.", seriesId: "s_hxh", tags: ["protagonist"] },
  { id: "c_hxh_killua", name: "Killua", image: img("Killua"), description: "An assassin's heir who became Gon's best friend.", seriesId: "s_hxh", tags: ["zoldyck", "assassin"] },
  { id: "c_hxh_kurapika", name: "Kurapika", image: img("Kurapika"), description: "Last survivor of the Kurta clan seeking revenge.", seriesId: "s_hxh", tags: ["kurta", "chain-user"] },
  { id: "c_hxh_hisoka", name: "Hisoka", image: img("Hisoka"), description: "A twisted magician who seeks powerful opponents.", seriesId: "s_hxh", tags: ["antagonist", "magician"] },
  { id: "c_hxh_netero", name: "Netero", image: img("Netero"), description: "The legendary chairman of the Hunter Association.", seriesId: "s_hxh", tags: ["chairman", "legend"] },

  // ── FMA ──
  { id: "c_fma_ed", name: "Edward Elric", image: img("Edward Elric"), description: "The Fullmetal Alchemist seeking to restore his brother.", seriesId: "s_fma", tags: ["protagonist", "state-alchemist"] },
  { id: "c_fma_al", name: "Alphonse Elric", image: img("Alphonse Elric"), description: "Ed's kind younger brother, a soul in armor.", seriesId: "s_fma", tags: ["armor"] },
  { id: "c_fma_roy", name: "Roy Mustang", image: img("Roy Mustang"), description: "The Flame Alchemist with political ambitions.", seriesId: "s_fma", tags: ["flame-alchemist"] },
  { id: "c_fma_envy", name: "Envy", image: img("Envy"), description: "A shapeshifting homunculus who despises humans.", seriesId: "s_fma", tags: ["homunculus", "villain"] },

  // ── My Hero Academia ──
  { id: "c_mha_deku", name: "Deku (Izuku Midoriya)", image: img("Deku"), description: "A boy born powerless who inherits the world's greatest quirk.", seriesId: "s_mha", tags: ["protagonist", "one-for-all"] },
  { id: "c_mha_bakugo", name: "Katsuki Bakugo", image: img("Bakugo"), description: "An explosive hot-headed rival with incredible skill.", seriesId: "s_mha", tags: ["rival", "explosion"] },
  { id: "c_mha_todoroki", name: "Shoto Todoroki", image: img("Todoroki"), description: "Son of the No. 1 hero with ice and fire powers.", seriesId: "s_mha", tags: ["dual-quirk"] },
  { id: "c_mha_allmight", name: "All Might", image: img("All Might"), description: "The Symbol of Peace and greatest hero of his age.", seriesId: "s_mha", tags: ["symbol-of-peace", "mentor"] },
  { id: "c_mha_afo", name: "All for One", image: img("All For One"), description: "A villainous mastermind who can steal any quirk.", seriesId: "s_mha", tags: ["villain", "boss"] },

  // ── One Punch Man ──
  { id: "c_opm_saitama", name: "Saitama", image: img("Saitama"), description: "A hero who defeats any enemy with a single punch.", seriesId: "s_opm", tags: ["protagonist", "bald"] },
  { id: "c_opm_genos", name: "Genos", image: img("Genos"), description: "A cyborg hero who idolizes Saitama.", seriesId: "s_opm", tags: ["cyborg", "s-class"] },
  { id: "c_opm_speed", name: "Sonic", image: img("Speed O Sound Sonic"), description: "A ninja villain obsessed with defeating Saitama.", seriesId: "s_opm", tags: ["ninja", "rival"] },
  { id: "c_opm_blast", name: "Blast", image: img("Blast"), description: "The mysterious No. 1 ranked hero.", seriesId: "s_opm", tags: ["s-class", "mysterious"] },

  // ── MCU ──
  { id: "c_mcu_im", name: "Iron Man", image: img("Iron Man"), description: "Genius billionaire in a suit of armor saving the world.", seriesId: "s_mcu", tags: ["avenger", "genius"] },
  { id: "c_mcu_sm", name: "Spider-Man", image: img("Spider-Man"), description: "Friendly neighborhood hero with spider powers.", seriesId: "s_mcu", tags: ["avenger", "teenager"] },
  { id: "c_mcu_thor", name: "Thor", image: img("Thor"), description: "The Asgardian God of Thunder.", seriesId: "s_mcu", tags: ["avenger", "asgardian"] },
  { id: "c_mcu_ca", name: "Captain America", image: img("Captain America"), description: "A WWII super-soldier with a vibranium shield.", seriesId: "s_mcu", tags: ["avenger", "super-soldier"] },
  { id: "c_mcu_hulk", name: "Hulk", image: img("Hulk"), description: "A scientist who transforms into a rage-fuelled giant.", seriesId: "s_mcu", tags: ["avenger", "gamma"] },
  { id: "c_mcu_bw", name: "Black Widow", image: img("Black Widow"), description: "Master spy and martial artist of S.H.I.E.L.D.", seriesId: "s_mcu", tags: ["avenger", "spy"] },
  { id: "c_mcu_bp", name: "Black Panther", image: img("Black Panther"), description: "King of Wakanda and the Black Panther.", seriesId: "s_mcu", tags: ["avenger", "king"] },
  { id: "c_mcu_wol", name: "Wolverine", image: img("Wolverine"), description: "A mutant with adamantium claws and regeneration.", seriesId: "s_mcu", tags: ["x-men", "mutant"] },

  // ── DC ──
  { id: "c_dcu_bm", name: "Batman", image: img("Batman"), description: "The Dark Knight who uses fear and gadgets to fight crime.", seriesId: "s_dcu", tags: ["detective", "billionaire"] },
  { id: "c_dcu_sm", name: "Superman", image: img("Superman"), description: "The Man of Steel, last son of Krypton.", seriesId: "s_dcu", tags: ["kryptonian"] },
  { id: "c_dcu_ww", name: "Wonder Woman", image: img("Wonder Woman"), description: "The Amazonian princess, goddess of truth.", seriesId: "s_dcu", tags: ["amazon", "demigod"] },
  { id: "c_dcu_fl", name: "The Flash", image: img("Flash"), description: "The fastest man alive who can travel through time.", seriesId: "s_dcu", tags: ["speedster"] },
  { id: "c_dcu_jok", name: "Joker", image: img("Joker"), description: "Batman's chaotic archenemy, agent of anarchy.", seriesId: "s_dcu", tags: ["villain", "chaos"] },
  { id: "c_dcu_hq", name: "Harley Quinn", image: img("Harley Quinn"), description: "The Joker's unpredictable and dangerous partner.", seriesId: "s_dcu", tags: ["villain", "anti-hero"] },

  // ── Star Wars ──
  { id: "c_sw_luke", name: "Luke Skywalker", image: img("Luke Skywalker"), description: "The last Jedi who redeemed his father and saved the galaxy.", seriesId: "s_sw", tags: ["jedi", "protagonist"] },
  { id: "c_sw_vader", name: "Darth Vader", image: img("Darth Vader"), description: "The fearsome Sith Lord who was once Anakin Skywalker.", seriesId: "s_sw", tags: ["sith", "villain"] },
  { id: "c_sw_yoda", name: "Yoda", image: img("Yoda"), description: "The ancient and wise Jedi Grand Master.", seriesId: "s_sw", tags: ["jedi", "master"] },
  { id: "c_sw_rey", name: "Rey", image: img("Rey"), description: "A scavenger who discovers she is powerful in the Force.", seriesId: "s_sw", tags: ["jedi"] },
  { id: "c_sw_obi", name: "Obi-Wan Kenobi", image: img("Obi-Wan Kenobi"), description: "Luke's mentor and one of the greatest Jedi Knights.", seriesId: "s_sw", tags: ["jedi", "master"] },

  // ── Lord of the Rings ──
  { id: "c_lotr_frodo", name: "Frodo Baggins", image: img("Frodo Baggins"), description: "The humble hobbit who carries the One Ring to Mordor.", seriesId: "s_lotr", tags: ["hobbit", "ring-bearer"] },
  { id: "c_lotr_gandalf", name: "Gandalf", image: img("Gandalf"), description: "The wise and powerful wizard guiding the fellowship.", seriesId: "s_lotr", tags: ["wizard", "istari"] },
  { id: "c_lotr_aragorn", name: "Aragorn", image: img("Aragorn"), description: "The heir to the throne of Gondor.", seriesId: "s_lotr", tags: ["ranger", "king"] },
  { id: "c_lotr_legolas", name: "Legolas", image: img("Legolas"), description: "An elven archer of extraordinary skill.", seriesId: "s_lotr", tags: ["elf", "archer"] },
  { id: "c_lotr_gimli", name: "Gimli", image: img("Gimli"), description: "A brave dwarf warrior, son of Glóin.", seriesId: "s_lotr", tags: ["dwarf", "warrior"] },

  // ── Harry Potter ──
  { id: "c_hp_harry", name: "Harry Potter", image: img("Harry Potter"), description: "The boy who lived, destined to defeat Voldemort.", seriesId: "s_hp", tags: ["protagonist", "chosen-one"] },
  { id: "c_hp_hermione", name: "Hermione Granger", image: img("Hermione Granger"), description: "The brightest witch of her age.", seriesId: "s_hp", tags: ["gryffindor", "muggle-born"] },
  { id: "c_hp_ron", name: "Ron Weasley", image: img("Ron Weasley"), description: "Harry's loyal best friend from a pure-blood family.", seriesId: "s_hp", tags: ["gryffindor"] },
  { id: "c_hp_voldemort", name: "Voldemort", image: img("Voldemort"), description: "The Dark Lord who feared death above all.", seriesId: "s_hp", tags: ["villain", "dark-lord"] },
  { id: "c_hp_dumbledore", name: "Dumbledore", image: img("Dumbledore"), description: "The greatest headmaster Hogwarts ever had.", seriesId: "s_hp", tags: ["headmaster", "mentor"] },

  // ── Percy Jackson ──
  { id: "c_pj_percy", name: "Percy Jackson", image: img("Percy Jackson"), description: "Son of Poseidon and hero of Olympus.", seriesId: "s_pj", tags: ["protagonist", "demigod"] },
  { id: "c_pj_annabeth", name: "Annabeth Chase", image: img("Annabeth Chase"), description: "Daughter of Athena, architect of Olympus.", seriesId: "s_pj", tags: ["demigod", "athena"] },
  { id: "c_pj_nico", name: "Nico di Angelo", image: img("Nico di Angelo"), description: "Son of Hades who commands the dead.", seriesId: "s_pj", tags: ["demigod", "hades"] },
  { id: "c_pj_thalia", name: "Thalia Grace", image: img("Thalia Grace"), description: "Daughter of Zeus, leader of the Hunters of Artemis.", seriesId: "s_pj", tags: ["demigod", "zeus"] },

  // ── Game of Thrones ──
  { id: "c_got_jon", name: "Jon Snow", image: img("Jon Snow"), description: "A bastard who becomes King in the North.", seriesId: "s_got", tags: ["targaryen", "stark"] },
  { id: "c_got_dany", name: "Daenerys Targaryen", image: img("Daenerys"), description: "The Dragon Queen seeking to reclaim her throne.", seriesId: "s_got", tags: ["targaryen", "dragon-rider"] },
  { id: "c_got_tyrion", name: "Tyrion Lannister", image: img("Tyrion"), description: "The clever and witty dwarf of House Lannister.", seriesId: "s_got", tags: ["lannister", "hand"] },
  { id: "c_got_arya", name: "Arya Stark", image: img("Arya Stark"), description: "The youngest Stark daughter, no one's assassin.", seriesId: "s_got", tags: ["stark", "faceless-man"] },
  { id: "c_got_cersei", name: "Cersei Lannister", image: img("Cersei"), description: "The cunning queen who plays the game of thrones.", seriesId: "s_got", tags: ["lannister", "queen"] },

  // ── Stranger Things ──
  { id: "c_st_eleven", name: "Eleven", image: img("Eleven"), description: "A girl with telekinetic powers from a secret lab.", seriesId: "s_st", tags: ["psychic", "protagonist"] },
  { id: "c_st_mike", name: "Mike Wheeler", image: img("Mike Wheeler"), description: "The leader of the party and Eleven's love interest.", seriesId: "s_st", tags: ["party-leader"] },
  { id: "c_st_dustin", name: "Dustin Henderson", image: img("Dustin Henderson"), description: "The tech-savvy, good-natured member of the party.", seriesId: "s_st", tags: ["inventor"] },
  { id: "c_st_hopper", name: "Jim Hopper", image: img("Jim Hopper"), description: "Chief of police and Eleven's adoptive father.", seriesId: "s_st", tags: ["police", "father"] },

  // ── Breaking Bad ──
  { id: "c_bb_walt", name: "Walter White", image: img("Walter White"), description: "A chemistry teacher who becomes the drug lord Heisenberg.", seriesId: "s_bb", tags: ["protagonist", "heisenberg"] },
  { id: "c_bb_jesse", name: "Jesse Pinkman", image: img("Jesse Pinkman"), description: "Walt's former student and reluctant partner.", seriesId: "s_bb", tags: ["cook", "partner"] },
  { id: "c_bb_gus", name: "Gustavo Fring", image: img("Gustavo Fring"), description: "A fast food mogul who is secretly a drug distributor.", seriesId: "s_bb", tags: ["villain", "businessman"] },
  { id: "c_bb_saul", name: "Saul Goodman", image: img("Saul Goodman"), description: "The flamboyant criminal lawyer always ready to help.", seriesId: "s_bb", tags: ["lawyer", "comic-relief"] },

  // ── The Boys ──
  { id: "c_tb_butcher", name: "Billy Butcher", image: img("Billy Butcher"), description: "A ruthless vigilante hell-bent on destroying superheroes.", seriesId: "s_tb", tags: ["protagonist", "anti-hero"] },
  { id: "c_tb_homelander", name: "Homelander", image: img("Homelander"), description: "The narcissistic and terrifying leader of The Seven.", seriesId: "s_tb", tags: ["villain", "supe"] },
  { id: "c_tb_starlight", name: "Starlight", image: img("Starlight"), description: "A genuine hero trying to do right inside a corrupt system.", seriesId: "s_tb", tags: ["the-seven", "hero"] },
  { id: "c_tb_mm", name: "Mother's Milk", image: img("Mothers Milk"), description: "The moral backbone of The Boys.", seriesId: "s_tb", tags: ["the-boys", "leader"] },

  // ── League of Legends ──
  { id: "c_lol_vi", name: "Vi", image: img("Vi"), description: "A hard-hitting enforcer from the undercity of Zaun.", seriesId: "s_lol", tags: ["fighter", "jinx-sister"] },
  { id: "c_lol_jinx", name: "Jinx", image: img("Jinx"), description: "A chaotic and explosive loose cannon from Zaun.", seriesId: "s_lol", tags: ["marksman", "chaos"] },
  { id: "c_lol_ekko", name: "Ekko", image: img("Ekko"), description: "A boy genius who bends time to fix his past.", seriesId: "s_lol", tags: ["fighter", "time"] },
  { id: "c_lol_yasuo", name: "Yasuo", image: img("Yasuo"), description: "An unforgiven swordsman exiled from his order.", seriesId: "s_lol", tags: ["fighter", "wind"] },
  { id: "c_lol_thresh", name: "Thresh", image: img("Thresh"), description: "The Chain Warden who collects souls.", seriesId: "s_lol", tags: ["support", "dark"] },

  // ── Valorant ──
  { id: "c_val_jett", name: "Jett", image: img("Jett"), description: "A Korean duelist who rides the wind.", seriesId: "s_val", tags: ["duelist", "korean"] },
  { id: "c_val_sage", name: "Sage", image: img("Sage"), description: "A sentinel who heals allies with her ice abilities.", seriesId: "s_val", tags: ["sentinel", "healer"] },
  { id: "c_val_reyna", name: "Reyna", image: img("Reyna"), description: "A Mexican vampire duelist who feeds on kills.", seriesId: "s_val", tags: ["duelist", "vampire"] },
  { id: "c_val_neon", name: "Neon", image: img("Neon"), description: "A Filipino agent with bioelectric speed.", seriesId: "s_val", tags: ["duelist", "speed"] },

  // ── Genshin Impact ──
  { id: "c_gi_lumine", name: "Lumine", image: img("Lumine"), description: "The Traveler seeking her lost sibling across Teyvat.", seriesId: "s_gi", tags: ["protagonist", "traveler"] },
  { id: "c_gi_zhongli", name: "Zhongli", image: img("Zhongli"), description: "Former Archon of Geo with timeless wisdom.", seriesId: "s_gi", tags: ["archon", "consultant"] },
  { id: "c_gi_hu_tao", name: "Hu Tao", image: img("Hu Tao"), description: "The eccentric director of the Wangsheng Funeral Parlor.", seriesId: "s_gi", tags: ["pyro", "spear"] },
  { id: "c_gi_venti", name: "Venti", image: img("Venti"), description: "The Anemo Archon disguised as a bard.", seriesId: "s_gi", tags: ["archon", "anemo"] },
  { id: "c_gi_raiden", name: "Raiden Shogun", image: img("Raiden Shogun"), description: "The Electro Archon and ruler of Inazuma.", seriesId: "s_gi", tags: ["archon", "electro"] },

  // ── God of War ──
  { id: "c_gow_kratos", name: "Kratos", image: img("Kratos"), description: "The Ghost of Sparta who killed the Greek gods.", seriesId: "s_gow", tags: ["protagonist", "god-slayer"] },
  { id: "c_gow_atreus", name: "Atreus", image: img("Atreus"), description: "Kratos' son, the Norse god Loki.", seriesId: "s_gow", tags: ["god", "archer"] },
  { id: "c_gow_baldur", name: "Baldur", image: img("Baldur"), description: "The God of Light and Pleasure, an Aesir god.", seriesId: "s_gow", tags: ["villain", "aesir"] },
  { id: "c_gow_freya", name: "Freya", image: img("Freya"), description: "The Vanir witch and former queen of the Valkyries.", seriesId: "s_gow", tags: ["witch", "vanir"] },

  // ── The Last of Us ──
  { id: "c_tlou_joel", name: "Joel Miller", image: img("Joel Miller"), description: "A hardened survivor who becomes Ellie's protector.", seriesId: "s_tlou", tags: ["protagonist", "smuggler"] },
  { id: "c_tlou_ellie", name: "Ellie Williams", image: img("Ellie Williams"), description: "A teenager immune to the cordyceps fungus.", seriesId: "s_tlou", tags: ["protagonist", "immune"] },
  { id: "c_tlou_abby", name: "Abby", image: img("Abby"), description: "A skilled warrior on a mission of revenge.", seriesId: "s_tlou", tags: ["firefly", "warrior"] },
  { id: "c_tlou_tess", name: "Tess", image: img("Tess"), description: "Joel's smuggling partner with fierce loyalty.", seriesId: "s_tlou", tags: ["smuggler"] },

  // ── Zelda ──
  { id: "c_zelda_link", name: "Link", image: img("Link"), description: "The hero chosen by the Triforce to defeat Ganon.", seriesId: "s_zelda", tags: ["protagonist", "hero"] },
  { id: "c_zelda_zelda", name: "Princess Zelda", image: img("Princess Zelda"), description: "The princess who carries a piece of the Triforce.", seriesId: "s_zelda", tags: ["princess", "wisdom"] },
  { id: "c_zelda_ganon", name: "Ganondorf", image: img("Ganondorf"), description: "The Great King of Evil and wielder of the Triforce of Power.", seriesId: "s_zelda", tags: ["villain", "gerudo"] },

  // ── Hunger Games ──
  { id: "c_hg_katniss", name: "Katniss Everdeen", image: img("Katniss Everdeen"), description: "The Mockingjay and symbol of rebellion.", seriesId: "s_hg", tags: ["protagonist", "archer"] },
  { id: "c_hg_peeta", name: "Peeta Mellark", image: img("Peeta Mellark"), description: "The baker's son who loves Katniss.", seriesId: "s_hg", tags: ["love-interest"] },
  { id: "c_hg_snow", name: "President Snow", image: img("President Snow"), description: "The tyrannical president of Panem.", seriesId: "s_hg", tags: ["villain", "president"] },
  { id: "c_hg_finnick", name: "Finnick Odair", image: img("Finnick Odair"), description: "A beloved victor from District 4.", seriesId: "s_hg", tags: ["victor", "ally"] },

  // ── Invincible ──
  { id: "c_inv_mark", name: "Mark Grayson (Invincible)", image: img("Invincible Mark"), description: "A teenager who inherits his Viltrumite father's powers.", seriesId: "s_inv", tags: ["protagonist", "viltrumite"] },
  { id: "c_inv_omni", name: "Omni-Man", image: img("Omni Man"), description: "Earth's greatest hero with a dark secret.", seriesId: "s_inv", tags: ["viltrumite", "father"] },
  { id: "c_inv_atom", name: "Atom Eve", image: img("Atom Eve"), description: "A hero who can manipulate matter.", seriesId: "s_inv", tags: ["matter-manipulation"] },

  // ── Avatar: ATLA ──
  { id: "c_ava_aang", name: "Aang", image: img("Aang"), description: "The last Airbender and Avatar of his era.", seriesId: "s_ava", tags: ["avatar", "airbender"] },
  { id: "c_ava_katara", name: "Katara", image: img("Katara"), description: "A master waterbender from the Southern Water Tribe.", seriesId: "s_ava", tags: ["waterbender"] },
  { id: "c_ava_zuko", name: "Zuko", image: img("Zuko"), description: "A banished prince who seeks redemption.", seriesId: "s_ava", tags: ["firebender", "prince"] },
  { id: "c_ava_toph", name: "Toph Beifong", image: img("Toph Beifong"), description: "A blind earthbender who invented metalbending.", seriesId: "s_ava", tags: ["earthbender", "blind"] },

  // ── Rick and Morty ──
  { id: "c_rm_rick", name: "Rick Sanchez", image: img("Rick Sanchez"), description: "The most intelligent being in the universe, also an alcoholic.", seriesId: "s_rick", tags: ["scientist", "genius"] },
  { id: "c_rm_morty", name: "Morty Smith", image: img("Morty Smith"), description: "Rick's nervous but increasingly capable grandson.", seriesId: "s_rick", tags: ["protagonist", "teenager"] },

  // ── Elden Ring ──
  { id: "c_er_malenia", name: "Malenia", image: img("Malenia"), description: "Blade of Miquella, the most feared Elden Ring boss.", seriesId: "s_er2", tags: ["boss", "demigod"] },
  { id: "c_er_radahn", name: "Starscourge Radahn", image: img("Starscourge Radahn"), description: "A legendary warrior who stopped the stars.", seriesId: "s_er2", tags: ["boss", "demigod"] },
  { id: "c_er_ranni", name: "Ranni the Witch", image: img("Ranni the Witch"), description: "A two-fingered empyrean with her own agenda.", seriesId: "s_er2", tags: ["empyrean", "witch"] },

  // ── Cyberpunk 2077 ──
  { id: "c_cp_vee", name: "V", image: img("V Cyberpunk"), description: "A mercenary in Night City seeking immortality.", seriesId: "s_cp", tags: ["protagonist", "mercenary"] },
  { id: "c_cp_johnny", name: "Johnny Silverhand", image: img("Johnny Silverhand"), description: "A legendary rockerboy living in V's head.", seriesId: "s_cp", tags: ["rocker", "ghost"] },
  { id: "c_cp_judy", name: "Judy Alvarez", image: img("Judy Alvarez"), description: "A braindance technician and freedom fighter.", seriesId: "s_cp", tags: ["tech", "ally"] },

  // ── Overwatch ──
  { id: "c_ow_tracer", name: "Tracer", image: img("Tracer"), description: "A time-jumping British hero and Overwatch's icon.", seriesId: "s_ow", tags: ["hero", "chronal"] },
  { id: "c_ow_genji", name: "Genji", image: img("Genji"), description: "A cyborg ninja who has found harmony.", seriesId: "s_ow", tags: ["ninja", "cyborg"] },
  { id: "c_ow_reaper", name: "Reaper", image: img("Reaper"), description: "A wraith wielding dual shotguns and death.", seriesId: "s_ow", tags: ["villain", "wraith"] },
  { id: "c_ow_dva", name: "D.Va", image: img("D.Va"), description: "A professional gamer in a giant mech.", seriesId: "s_ow", tags: ["tank", "mech"] },
];
