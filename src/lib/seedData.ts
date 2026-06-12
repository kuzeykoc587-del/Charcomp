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
  { id: "c_ow_mercy", name: "Mercy", image: img("Mercy"), description: "The angelic healer who revives fallen allies.", seriesId: "s_ow", tags: ["support", "healer"] },
  { id: "c_ow_hanzo", name: "Hanzo", image: img("Hanzo"), description: "A master archer who wields the spirit dragons.", seriesId: "s_ow", tags: ["archer", "dps"] },
  { id: "c_ow_pharah", name: "Pharah", image: img("Pharah"), description: "An Egyptian soldier in a rocket-powered exosuit.", seriesId: "s_ow", tags: ["tank", "rockets"] },
  { id: "c_ow_ana", name: "Ana", image: img("Ana"), description: "A legendary sniper and founding Overwatch member.", seriesId: "s_ow", tags: ["support", "sniper"] },

  // ── FMA extras ──
  { id: "c_fma_winry", name: "Winry Rockbell", image: img("Winry Rockbell"), description: "Ed's childhood friend and automail mechanic.", seriesId: "s_fma", tags: ["mechanic", "friend"] },
  { id: "c_fma_scar", name: "Scar", image: img("Scar FMA"), description: "An Ishvalan warrior monk seeking revenge.", seriesId: "s_fma", tags: ["warrior", "antagonist"] },
  { id: "c_fma_lust", name: "Lust", image: img("Lust FMA"), description: "A seductive homunculus with razor-sharp nails.", seriesId: "s_fma", tags: ["homunculus", "villain"] },

  // ── MHA extras ──
  { id: "c_mha_ochaco", name: "Ochaco Uraraka", image: img("Ochaco Uraraka"), description: "A cheerful hero with gravity-nullifying powers.", seriesId: "s_mha", tags: ["hero", "zero-gravity"] },
  { id: "c_mha_shigaraki", name: "Shigaraki Tomura", image: img("Shigaraki"), description: "The villainous leader of the League of Villains.", seriesId: "s_mha", tags: ["villain", "decay"] },
  { id: "c_mha_endeavor", name: "Endeavor", image: img("Endeavor"), description: "The flame hero and new No. 1 Pro Hero.", seriesId: "s_mha", tags: ["pro-hero", "flame"] },

  // ── OPM extras ──
  { id: "c_opm_tatsumaki", name: "Tatsumaki", image: img("Tatsumaki"), description: "The Tornado of Terror, a powerful S-Class esper.", seriesId: "s_opm", tags: ["s-class", "esper"] },
  { id: "c_opm_garou", name: "Garou", image: img("Garou"), description: "A martial arts prodigy who champions monsters.", seriesId: "s_opm", tags: ["villain", "monster"] },

  // ── HxH extras ──
  { id: "c_hxh_leorio", name: "Leorio Paradinight", image: img("Leorio"), description: "An aspiring doctor who is more capable than he seems.", seriesId: "s_hxh", tags: ["doctor", "friend"] },
  { id: "c_hxh_meruem", name: "Meruem", image: img("Meruem"), description: "The almighty king of the Chimera Ants.", seriesId: "s_hxh", tags: ["chimera-ant", "king"] },

  // ── Naruto extras ──
  { id: "c_na_jiraiya", name: "Jiraiya", image: img("Jiraiya"), description: "The Toad Sage and Naruto's beloved godfather.", seriesId: "s_na", tags: ["sage", "mentor"] },
  { id: "c_na_gaara", name: "Gaara", image: img("Gaara"), description: "The Sand Kazekage who controls sand.", seriesId: "s_na", tags: ["kazekage", "sand"] },
  { id: "c_na_tsunade", name: "Tsunade", image: img("Tsunade"), description: "The Fifth Hokage and legendary medical ninja.", seriesId: "s_na", tags: ["hokage", "medic"] },

  // ── One Piece extras ──
  { id: "c_op_usopp", name: "Usopp", image: img("Usopp"), description: "The Straw Hats' sniper and brave sea warrior.", seriesId: "s_op", tags: ["sniper", "brave"] },
  { id: "c_op_chopper", name: "Tony Tony Chopper", image: img("Chopper"), description: "A reindeer who ate the Human-Human Fruit.", seriesId: "s_op", tags: ["doctor", "devil-fruit"] },
  { id: "c_op_boa", name: "Boa Hancock", image: img("Boa Hancock"), description: "The Snake Princess and most beautiful woman alive.", seriesId: "s_op", tags: ["warlord", "beauty"] },
  { id: "c_op_shanks", name: "Shanks", image: img("Shanks"), description: "A red-haired Emperor who inspired Luffy.", seriesId: "s_op", tags: ["yonko", "emperor"] },

  // ── LoTR extras ──
  { id: "c_lotr_sauron", name: "Sauron", image: img("Sauron"), description: "The Dark Lord who forged the One Ring.", seriesId: "s_lotr", tags: ["dark-lord", "villain"] },
  { id: "c_lotr_sam", name: "Samwise Gamgee", image: img("Samwise Gamgee"), description: "Frodo's loyal gardener and true hero of the story.", seriesId: "s_lotr", tags: ["hobbit", "loyal"] },

  // ── Harry Potter extras ──
  { id: "c_hp_snape", name: "Severus Snape", image: img("Severus Snape"), description: "The misunderstood potions master always on the line.", seriesId: "s_hp", tags: ["potions", "spy"] },
  { id: "c_hp_malfoy", name: "Draco Malfoy", image: img("Draco Malfoy"), description: "Harry's rival and the conflicted Slytherin heir.", seriesId: "s_hp", tags: ["slytherin", "rival"] },

  // ── GoT extras ──
  { id: "c_got_jaime", name: "Jaime Lannister", image: img("Jaime Lannister"), description: "The Kingslayer on a long road to redemption.", seriesId: "s_got", tags: ["lannister", "knight"] },
  { id: "c_got_sansa", name: "Sansa Stark", image: img("Sansa Stark"), description: "The eldest Stark daughter who became the Queen in the North.", seriesId: "s_got", tags: ["stark", "queen"] },
  { id: "c_got_ned", name: "Ned Stark", image: img("Ned Stark"), description: "The honorable Lord of Winterfell.", seriesId: "s_got", tags: ["stark", "lord"] },

  // ── Star Wars extras ──
  { id: "c_sw_han", name: "Han Solo", image: img("Han Solo"), description: "A charming smuggler turned Rebel Alliance general.", seriesId: "s_sw", tags: ["smuggler", "rebel"] },
  { id: "c_sw_leia", name: "Princess Leia", image: img("Princess Leia"), description: "The Rebel Alliance's boldest and most determined leader.", seriesId: "s_sw", tags: ["rebel", "princess"] },
  { id: "c_sw_palpatine", name: "Emperor Palpatine", image: img("Emperor Palpatine"), description: "The scheming Sith Emperor who orchestrated galactic domination.", seriesId: "s_sw", tags: ["sith", "emperor"] },

  // ── JoJo's Bizarre Adventure ──
  { id: "c_jojo_giorno", name: "Giorno Giovanna", image: img("Giorno Giovanna"), description: "The son of DIO who dreams of becoming a Gang-Star.", seriesId: "s_jojo", tags: ["protagonist", "gold-experience"] },
  { id: "c_jojo_jotaro", name: "Jotaro Kujo", image: img("Jotaro Kujo"), description: "The stoic JoJo whose Star Platinum stops time.", seriesId: "s_jojo", tags: ["protagonist", "star-platinum"] },
  { id: "c_jojo_dio", name: "DIO", image: img("DIO"), description: "The vampire villain who can stop time with The World.", seriesId: "s_jojo", tags: ["villain", "the-world"] },
  { id: "c_jojo_josuke", name: "Josuke Higashikata", image: img("Josuke Higashikata"), description: "Diamond is Unbreakable's cheerful protagonist who hates hair jokes.", seriesId: "s_jojo", tags: ["protagonist", "crazy-diamond"] },
  { id: "c_jojo_kira", name: "Yoshikage Kira", image: img("Yoshikage Kira"), description: "A serial killer with a hand fetish and Killer Queen's power.", seriesId: "s_jojo", tags: ["villain", "killer-queen"] },
  { id: "c_jojo_joseph", name: "Joseph Joestar", image: img("Joseph Joestar"), description: "The cunning and boisterous Hamon user of Battle Tendency.", seriesId: "s_jojo", tags: ["protagonist", "hamon"] },

  // ── Black Clover ──
  { id: "c_bc_asta", name: "Asta", image: img("Asta"), description: "A boy born with no magic who fights with anti-magic swords.", seriesId: "s_bc", tags: ["protagonist", "anti-magic"] },
  { id: "c_bc_yuno", name: "Yuno", image: img("Yuno"), description: "Asta's rival, a genius mage and prince of the Spade Kingdom.", seriesId: "s_bc", tags: ["rival", "wind"] },
  { id: "c_bc_noelle", name: "Noelle Silva", image: img("Noelle Silva"), description: "A noble water mage who grows into a formidable warrior.", seriesId: "s_bc", tags: ["water", "noble"] },
  { id: "c_bc_yami", name: "Yami Sukehiro", image: img("Yami"), description: "The gruff captain of the Black Bulls who pushes beyond limits.", seriesId: "s_bc", tags: ["captain", "dark"] },
  { id: "c_bc_luck", name: "Luck Voltia", image: img("Luck Voltia"), description: "An electric mage who loves combat with a constant smile.", seriesId: "s_bc", tags: ["lightning", "fighter"] },

  // ── Chainsaw Man ──
  { id: "c_csm_denji", name: "Denji", image: img("Denji"), description: "A broke kid who merged with his devil dog Pochita.", seriesId: "s_csm", tags: ["protagonist", "chainsaw"] },
  { id: "c_csm_power", name: "Power", image: img("Power"), description: "A brash blood fiend who only cares about herself (and Meowy).", seriesId: "s_csm", tags: ["fiend", "blood"] },
  { id: "c_csm_makima", name: "Makima", image: img("Makima"), description: "The Control Devil hiding behind an angelic facade.", seriesId: "s_csm", tags: ["devil", "control"] },
  { id: "c_csm_aki", name: "Aki Hayakawa", image: img("Aki"), description: "A serious devil hunter driven by grief and loyalty.", seriesId: "s_csm", tags: ["devil-hunter", "cursed"] },
  { id: "c_csm_kobeni", name: "Kobeni Higashiyama", image: img("Kobeni"), description: "The most cowardly—yet somehow most dangerous—devil hunter.", seriesId: "s_csm", tags: ["devil-hunter", "agility"] },

  // ── Tokyo Ghoul ──
  { id: "c_tg_kaneki", name: "Ken Kaneki", image: img("Ken Kaneki"), description: "A half-ghoul torn between his human and monster sides.", seriesId: "s_tg", tags: ["protagonist", "half-ghoul"] },
  { id: "c_tg_touka", name: "Touka Kirishima", image: img("Touka Kirishima"), description: "A fierce ghoul working as a barista to blend into society.", seriesId: "s_tg", tags: ["ghoul", "rabbit"] },
  { id: "c_tg_arima", name: "Kishou Arima", image: img("Kishou Arima"), description: "The CCG's reaper—the strongest investigator in history.", seriesId: "s_tg", tags: ["ccg", "investigator"] },
  { id: "c_tg_rize", name: "Rize Kamishiro", image: img("Rize Kamishiro"), description: "A gluttonous ghoul whose organs changed Kaneki's fate.", seriesId: "s_tg", tags: ["ghoul", "binge-eater"] },
  { id: "c_tg_amon", name: "Koutarou Amon", image: img("Koutarou Amon"), description: "A principled investigator who questions the war against ghouls.", seriesId: "s_tg", tags: ["ccg", "investigator"] },

  // ── Re:Zero ──
  { id: "c_rz_subaru", name: "Subaru Natsuki", image: img("Subaru Natsuki"), description: "A regular guy who returns from death to grow stronger.", seriesId: "s_rz", tags: ["protagonist", "return-by-death"] },
  { id: "c_rz_emilia", name: "Emilia", image: img("Emilia"), description: "A half-elf spirit arts user running for the throne of Lugunica.", seriesId: "s_rz", tags: ["spirit-user", "candidate"] },
  { id: "c_rz_rem", name: "Rem", image: img("Rem"), description: "A devoted oni maid who became a fan-favorite heroine.", seriesId: "s_rz", tags: ["oni", "maid"] },
  { id: "c_rz_ram", name: "Ram", image: img("Ram"), description: "Rem's one-horned elder twin, equally dangerous.", seriesId: "s_rz", tags: ["oni", "maid"] },
  { id: "c_rz_beatrice", name: "Beatrice", image: img("Beatrice"), description: "A tsundere great spirit who guards the Forbidden Library.", seriesId: "s_rz", tags: ["spirit", "library"] },

  // ── Overlord ──
  { id: "c_ov_ainz", name: "Ainz Ooal Gown", image: img("Ainz Ooal Gown"), description: "A skeleton overlord who was once a regular salaryman.", seriesId: "s_ov", tags: ["undead", "overlord"] },
  { id: "c_ov_albedo", name: "Albedo", image: img("Albedo"), description: "The devoted and powerful Guardian Overseer of Nazarick.", seriesId: "s_ov", tags: ["guardian", "succubus"] },
  { id: "c_ov_shalltear", name: "Shalltear Bloodfallen", image: img("Shalltear Bloodfallen"), description: "A powerful vampire floor guardian fiercely loyal to Ainz.", seriesId: "s_ov", tags: ["vampire", "guardian"] },
  { id: "c_ov_demiurge", name: "Demiurge", image: img("Demiurge"), description: "The cunning devil who leads Nazarick's outer defenses.", seriesId: "s_ov", tags: ["devil", "guardian"] },
  { id: "c_ov_cocytus", name: "Cocytus", image: img("Cocytus"), description: "An insectoid warrior guardian with deep warrior's pride.", seriesId: "s_ov", tags: ["warrior", "guardian"] },

  // ── Fairy Tail ──
  { id: "c_ft_natsu", name: "Natsu Dragneel", image: img("Natsu Dragneel"), description: "The fire Dragon Slayer of Fairy Tail.", seriesId: "s_ft", tags: ["dragon-slayer", "fire"] },
  { id: "c_ft_lucy", name: "Lucy Heartfilia", image: img("Lucy Heartfilia"), description: "A Celestial Spirit mage who joins Fairy Tail.", seriesId: "s_ft", tags: ["celestial-spirit", "writer"] },
  { id: "c_ft_erza", name: "Erza Scarlet", image: img("Erza Scarlet"), description: "The Titania who can equip any armor or weapon.", seriesId: "s_ft", tags: ["titania", "requip"] },
  { id: "c_ft_gray", name: "Gray Fullbuster", image: img("Gray Fullbuster"), description: "An ice mage with a habit of stripping his clothes.", seriesId: "s_ft", tags: ["ice", "rival"] },
  { id: "c_ft_gajeel", name: "Gajeel Redfox", image: img("Gajeel Redfox"), description: "The iron Dragon Slayer, former villain turned ally.", seriesId: "s_ft", tags: ["dragon-slayer", "iron"] },
  { id: "c_ft_jellal", name: "Jellal Fernandes", image: img("Jellal Fernandes"), description: "A tormented wizard who fights to atone for his past.", seriesId: "s_ft", tags: ["ex-villain", "heaven"] },

  // ── Code Geass ──
  { id: "c_cg_lelouch", name: "Lelouch vi Britannia", image: img("Lelouch"), description: "A genius prince whose Geass commands absolute obedience.", seriesId: "s_cg", tags: ["protagonist", "geass"] },
  { id: "c_cg_suzaku", name: "Suzaku Kururugi", image: img("Suzaku Kururugi"), description: "A Japanese soldier who became the White Knight of Britannia.", seriesId: "s_cg", tags: ["knight", "rival"] },
  { id: "c_cg_cc", name: "C.C.", image: img("CC Code Geass"), description: "The immortal witch who granted Lelouch his Geass.", seriesId: "s_cg", tags: ["immortal", "witch"] },
  { id: "c_cg_kallen", name: "Kallen Stadtfeld", image: img("Kallen Stadtfeld"), description: "The ace pilot of the Black Knights and Zero's blade.", seriesId: "s_cg", tags: ["pilot", "rebel"] },
  { id: "c_cg_schneizel", name: "Schneizel el Britannia", image: img("Schneizel"), description: "Lelouch's brilliant elder brother and chess nemesis.", seriesId: "s_cg", tags: ["prince", "strategist"] },

  // ── Steins;Gate ──
  { id: "c_sg_okabe", name: "Rintaro Okabe", image: img("Rintaro Okabe"), description: "A self-proclaimed mad scientist who can remember erased timelines.", seriesId: "s_sg", tags: ["protagonist", "reading-steiner"] },
  { id: "c_sg_kurisu", name: "Kurisu Makise", image: img("Kurisu Makise"), description: "A genius neuroscientist who helps develop the time machine.", seriesId: "s_sg", tags: ["scientist", "tsundere"] },
  { id: "c_sg_mayuri", name: "Mayuri Shiina", image: img("Mayuri Shiina"), description: "Okabe's bubbly childhood friend whose fate drives the plot.", seriesId: "s_sg", tags: ["cosplayer", "friend"] },
  { id: "c_sg_daru", name: "Daru", image: img("Daru"), description: "The super hacker and loyal lab member.", seriesId: "s_sg", tags: ["hacker", "otaku"] },

  // ── Spy x Family ──
  { id: "c_spy_loid", name: "Loid Forger", image: img("Loid Forger"), description: "The master spy Twilight who assembled a fake perfect family.", seriesId: "s_spy", tags: ["spy", "liar"] },
  { id: "c_spy_yor", name: "Yor Forger", image: img("Yor Forger"), description: "A deadly assassin moonlighting as a loving wife and mother.", seriesId: "s_spy", tags: ["assassin", "wife"] },
  { id: "c_spy_anya", name: "Anya Forger", image: img("Anya Forger"), description: "A telepathic girl who knows exactly what her secret-agent dad is.", seriesId: "s_spy", tags: ["esper", "child"] },
  { id: "c_spy_damian", name: "Damian Desmond", image: img("Damian Desmond"), description: "Anya's classmate and son of the target, a proud boy hiding loneliness.", seriesId: "s_spy", tags: ["student", "elite"] },

  // ── Blue Lock ──
  { id: "c_blue_isagi", name: "Yoichi Isagi", image: img("Yoichi Isagi"), description: "A striker with perfect spatial awareness who evolves through ego.", seriesId: "s_blue", tags: ["striker", "protagonist"] },
  { id: "c_blue_bachira", name: "Meguru Bachira", image: img("Meguru Bachira"), description: "A dribbling prodigy who plays with an imaginary monster.", seriesId: "s_blue", tags: ["dribbler", "free"] },
  { id: "c_blue_rin", name: "Rin Itoshi", image: img("Rin Itoshi"), description: "A cold genius and striker consumed by his rivalry with his brother.", seriesId: "s_blue", tags: ["striker", "rival"] },
  { id: "c_blue_nagi", name: "Seishiro Nagi", image: img("Seishiro Nagi"), description: "A naturally gifted player who only plays because Reo asked him.", seriesId: "s_blue", tags: ["striker", "genius"] },
  { id: "c_blue_shidou", name: "Ryusei Shidou", image: img("Ryusei Shidou"), description: "A chaotic wild card whose acrobatic plays defy physics.", seriesId: "s_blue", tags: ["striker", "wild"] },

  // ── Haikyuu ──
  { id: "c_hq_hinata", name: "Shoyo Hinata", image: img("Shoyo Hinata"), description: "A small spiker who makes up for size with explosive speed.", seriesId: "s_hq", tags: ["wing-spiker", "jumper"] },
  { id: "c_hq_kageyama", name: "Tobio Kageyama", image: img("Tobio Kageyama"), description: "A genius setter who sets the perfect toss for any spiker.", seriesId: "s_hq", tags: ["setter", "king"] },
  { id: "c_hq_tsukishima", name: "Kei Tsukishima", image: img("Kei Tsukishima"), description: "A tall blocker with a sarcastic attitude hiding true passion.", seriesId: "s_hq", tags: ["blocker", "middle-blocker"] },
  { id: "c_hq_nishinoya", name: "Yu Nishinoya", image: img("Yu Nishinoya"), description: "The Guardian Deity and libero of Karasuno.", seriesId: "s_hq", tags: ["libero", "guardian"] },
  { id: "c_hq_bokuto", name: "Kotaro Bokuto", image: img("Kotaro Bokuto"), description: "An ace spiker whose mood swings are as legendary as his spikes.", seriesId: "s_hq", tags: ["ace", "owl"] },

  // ── Slam Dunk ──
  { id: "c_sd_hanamichi", name: "Hanamichi Sakuragi", image: img("Hanamichi Sakuragi"), description: "A delinquent genius who discovers basketball for a girl.", seriesId: "s_sd", tags: ["protagonist", "redhead"] },
  { id: "c_sd_rukawa", name: "Kaede Rukawa", image: img("Kaede Rukawa"), description: "A cold prodigy who is Sakuragi's ultimate rival.", seriesId: "s_sd", tags: ["prodigy", "rival"] },
  { id: "c_sd_akagi", name: "Takenori Akagi", image: img("Takenori Akagi"), description: "Shohoku's stoic captain and dominant center.", seriesId: "s_sd", tags: ["captain", "center"] },
  { id: "c_sd_mitsui", name: "Hisashi Mitsui", image: img("Hisashi Mitsui"), description: "A former MVP who returns to basketball after going astray.", seriesId: "s_sd", tags: ["three-pointer", "mvp"] },

  // ── Vinland Saga ──
  { id: "c_vs_thorfinn", name: "Thorfinn", image: img("Thorfinn"), description: "A Viking warrior seeking revenge who finds a path to peace.", seriesId: "s_vs", tags: ["protagonist", "warrior"] },
  { id: "c_vs_askeladd", name: "Askeladd", image: img("Askeladd"), description: "The cunning mercenary captain who killed Thorfinn's father.", seriesId: "s_vs", tags: ["mercenary", "cunning"] },
  { id: "c_vs_canute", name: "Prince Canute", image: img("Prince Canute"), description: "A sheltered prince who grows into a ruthless king.", seriesId: "s_vs", tags: ["prince", "king"] },
  { id: "c_vs_bjorn", name: "Bjorn", image: img("Bjorn Vinland"), description: "Askeladd's loyal berserker and friend.", seriesId: "s_vs", tags: ["berserker", "loyal"] },

  // ── Solo Leveling ──
  { id: "c_sl_jinwoo", name: "Sung Jinwoo", image: img("Sung Jinwoo"), description: "The world's weakest hunter who becomes the Shadow Monarch.", seriesId: "s_sl", tags: ["protagonist", "shadow-monarch"] },
  { id: "c_sl_cha", name: "Cha Hae-In", image: img("Cha Hae-In"), description: "Korea's top female hunter with a unique ability to sense mana scent.", seriesId: "s_sl", tags: ["hunter", "sword"] },
  { id: "c_sl_beru", name: "Beru", image: img("Beru"), description: "Jinwoo's fiercest shadow soldier, a former ant king.", seriesId: "s_sl", tags: ["shadow", "ant"] },
  { id: "c_sl_igris", name: "Igris", image: img("Igris"), description: "Jinwoo's first and most loyal knight-class shadow.", seriesId: "s_sl", tags: ["shadow", "knight"] },

  // ── Kaiju No. 8 ──
  { id: "c_kn_kafka", name: "Kafka Hibino", image: img("Kafka Hibino"), description: "A kaiju cleaner who transforms into Kaiju No. 8.", seriesId: "s_kn", tags: ["protagonist", "kaiju"] },
  { id: "c_kn_mina", name: "Mina Ashiro", image: img("Mina Ashiro"), description: "The captain of the Third Division and Kafka's childhood promise.", seriesId: "s_kn", tags: ["captain", "fighter"] },
  { id: "c_kn_reno", name: "Reno Ichikawa", image: img("Reno Ichikawa"), description: "Kafka's eager young partner in kaiju cleanup.", seriesId: "s_kn", tags: ["recruit", "partner"] },
  { id: "c_kn_iharu", name: "Iharu Furuhashi", image: img("Iharu Furuhashi"), description: "A member of the Third Division who wields a blade.", seriesId: "s_kn", tags: ["fighter", "blade"] },

  // ── Dr. Stone ──
  { id: "c_dst_senku", name: "Senku Ishigami", image: img("Senku Ishigami"), description: "A 10-billion-percent genius rebuilding civilization with science.", seriesId: "s_dst", tags: ["protagonist", "scientist"] },
  { id: "c_dst_chrome", name: "Chrome", image: img("Chrome"), description: "A primitive-era science enthusiast who becomes Senku's ally.", seriesId: "s_dst", tags: ["sorcerer", "scientist"] },
  { id: "c_dst_kohaku", name: "Kohaku", image: img("Kohaku"), description: "A fierce and fast warrior from the stone-age village.", seriesId: "s_dst", tags: ["fighter", "warrior"] },
  { id: "c_dst_gen", name: "Gen Asagiri", image: img("Gen Asagiri"), description: "A mentalist who uses psychology to further Senku's kingdom.", seriesId: "s_dst", tags: ["mentalist", "spy"] },
  { id: "c_dst_tsukasa", name: "Tsukasa Shishio", image: img("Tsukasa Shishio"), description: "The strongest primate high-schooler and Senku's great enemy.", seriesId: "s_dst", tags: ["villain", "warrior"] },

  // ── Mob Psycho 100 ──
  { id: "c_mp_mob", name: "Mob (Shigeo Kageyama)", image: img("Mob"), description: "A powerful esper who suppresses his emotions for fear of his power.", seriesId: "s_mp", tags: ["protagonist", "esper"] },
  { id: "c_mp_reigen", name: "Arataka Reigen", image: img("Reigen"), description: "A con-man psychic who is somehow Mob's greatest mentor.", seriesId: "s_mp", tags: ["mentor", "con-man"] },
  { id: "c_mp_dimple", name: "Dimple", image: img("Dimple"), description: "A comic-relief evil spirit who becomes Mob's unlikely companion.", seriesId: "s_mp", tags: ["spirit", "comedic"] },
  { id: "c_mp_ritsu", name: "Ritsu Kageyama", image: img("Ritsu Kageyama"), description: "Mob's studious younger brother who secretly craves power.", seriesId: "s_mp", tags: ["brother", "esper"] },

  // ── Pokémon ──
  { id: "c_pok_pikachu", name: "Pikachu", image: img("Pikachu"), description: "The iconic electric mouse and face of the Pokémon franchise.", seriesId: "s_pok", tags: ["electric", "mascot"] },
  { id: "c_pok_charizard", name: "Charizard", image: img("Charizard"), description: "The fan-favorite fire-and-flying Pokémon of the Kanto starters.", seriesId: "s_pok", tags: ["fire", "flying"] },
  { id: "c_pok_mewtwo", name: "Mewtwo", image: img("Mewtwo"), description: "A genetically engineered legendary Pokémon of immense power.", seriesId: "s_pok", tags: ["legendary", "psychic"] },
  { id: "c_pok_eevee", name: "Eevee", image: img("Eevee"), description: "The evolution Pokémon with eight possible evolutions.", seriesId: "s_pok", tags: ["normal", "evolution"] },
  { id: "c_pok_gengar", name: "Gengar", image: img("Gengar"), description: "The Shadow Pokémon, a fan-favorite ghost-type.", seriesId: "s_pok", tags: ["ghost", "poison"] },
  { id: "c_pok_lucario", name: "Lucario", image: img("Lucario"), description: "An aura-sensing fighting Pokémon beloved worldwide.", seriesId: "s_pok", tags: ["fighting", "steel"] },
  { id: "c_pok_greninja", name: "Greninja", image: img("Greninja"), description: "A swift water-type ninja Pokémon from the Kalos region.", seriesId: "s_pok", tags: ["water", "dark"] },
  { id: "c_pok_snorlax", name: "Snorlax", image: img("Snorlax"), description: "The Sleeping Pokémon who blocks entire roads.", seriesId: "s_pok", tags: ["normal", "sleepy"] },

  // ── Arcane ──
  { id: "c_arc_jinx", name: "Jinx (Powder)", image: img("Jinx Arcane"), description: "A chaotic inventor from Zaun shaped by tragedy and abandonment.", seriesId: "s_arc", tags: ["antagonist", "chaos"] },
  { id: "c_arc_vi", name: "Vi", image: img("Vi Arcane"), description: "A Piltover enforcer and Jinx's older sister.", seriesId: "s_arc", tags: ["enforcer", "fighter"] },
  { id: "c_arc_jayce", name: "Jayce", image: img("Jayce Arcane"), description: "A visionary inventor who believes Hextech can change the world.", seriesId: "s_arc", tags: ["inventor", "politician"] },
  { id: "c_arc_viktor", name: "Viktor", image: img("Viktor Arcane"), description: "A Zaunite scientist who pursues human evolution through machines.", seriesId: "s_arc", tags: ["scientist", "hextech"] },
  { id: "c_arc_silco", name: "Silco", image: img("Silco"), description: "Zaun's ruthless mastermind who treats Jinx like a daughter.", seriesId: "s_arc", tags: ["villain", "underworld"] },

  // ── LoL extras ──
  { id: "c_lol_ahri", name: "Ahri", image: img("Ahri"), description: "A nine-tailed fox mage who charms and devours her enemies.", seriesId: "s_lol", tags: ["mage", "assassin"] },
  { id: "c_lol_lux", name: "Lux", image: img("Lux"), description: "Demacia's Lady of Luminosity who fights with light magic.", seriesId: "s_lol", tags: ["mage", "support"] },
  { id: "c_lol_zed", name: "Zed", image: img("Zed"), description: "The Master of Shadows, a deadly ninja assassin.", seriesId: "s_lol", tags: ["assassin", "shadow"] },
  { id: "c_lol_leona", name: "Leona", image: img("Leona"), description: "The Radiant Dawn who channels the sun's power.", seriesId: "s_lol", tags: ["tank", "solar"] },

  // ── Valorant extras ──
  { id: "c_val_omen", name: "Omen", image: img("Omen"), description: "A shadow wraith who haunts and disorients his enemies.", seriesId: "s_val", tags: ["controller", "phantom"] },
  { id: "c_val_killjoy", name: "Killjoy", image: img("Killjoy"), description: "An engineering prodigy who controls the battlefield with gadgets.", seriesId: "s_val", tags: ["sentinel", "engineer"] },
  { id: "c_val_phoenix", name: "Phoenix", image: img("Phoenix Valorant"), description: "A British duelist who fights with the power of fire.", seriesId: "s_val", tags: ["duelist", "fire"] },
  { id: "c_val_chamber", name: "Chamber", image: img("Chamber"), description: "A French arms dealer who bends the laws of physics.", seriesId: "s_val", tags: ["sentinel", "french"] },

  // ── Genshin extras ──
  { id: "c_gi_kazuha", name: "Kaedehara Kazuha", image: img("Kazuha"), description: "A wandering samurai from Inazuma with Anemo control.", seriesId: "s_gi", tags: ["anemo", "sword"] },
  { id: "c_gi_nahida", name: "Nahida", image: img("Nahida"), description: "The Lesser Lord Kusanali, a tiny Dendro Archon with vast wisdom.", seriesId: "s_gi", tags: ["archon", "dendro"] },
  { id: "c_gi_furina", name: "Furina", image: img("Furina"), description: "The capricious Hydro Archon of Fontaine hiding a lonely truth.", seriesId: "s_gi", tags: ["archon", "hydro"] },

  // ── Honkai: Star Rail ──
  { id: "c_hsr_stelle", name: "Stelle", image: img("Stelle"), description: "The Trailblazer who woke up on the Herta Space Station.", seriesId: "s_hsr", tags: ["protagonist", "trailblazer"] },
  { id: "c_hsr_bronya", name: "Bronya", image: img("Bronya"), description: "The Supreme Guardian of Belobog, a tactical commander.", seriesId: "s_hsr", tags: ["commander", "wind"] },
  { id: "c_hsr_seele", name: "Seele", image: img("Seele"), description: "A butterfly-wielding warrior from Belobog's underworld.", seriesId: "s_hsr", tags: ["quantum", "butterfly"] },
  { id: "c_hsr_blade", name: "Blade", image: img("Blade"), description: "An immortal swordsman who uses his own HP to fuel his attacks.", seriesId: "s_hsr", tags: ["wind", "sword"] },
  { id: "c_hsr_kafka", name: "Kafka", image: img("Kafka"), description: "A seductive Stellaron Hunter who plays with her prey.", seriesId: "s_hsr", tags: ["lightning", "nihility"] },
  { id: "c_hsr_jingliu", name: "Jingliu", image: img("Jingliu"), description: "A legendary blade master consumed by the Mara into madness.", seriesId: "s_hsr", tags: ["ice", "sword"] },

  // ── Better Call Saul ──
  { id: "c_bcs_saul", name: "Jimmy McGill (Saul)", image: img("Jimmy McGill"), description: "A small-time lawyer slowly transformed into Saul Goodman.", seriesId: "s_bcs", tags: ["lawyer", "con-man"] },
  { id: "c_bcs_mike", name: "Mike Ehrmantraut", image: img("Mike Ehrmantraut"), description: "A former cop turned fixer with a strict moral code.", seriesId: "s_bcs", tags: ["fixer", "ex-cop"] },
  { id: "c_bcs_kim", name: "Kim Wexler", image: img("Kim Wexler"), description: "A brilliant attorney and Jimmy's moral compass—and partner in crime.", seriesId: "s_bcs", tags: ["lawyer", "partner"] },
  { id: "c_bcs_lalo", name: "Lalo Salamanca", image: img("Lalo Salamanca"), description: "The charming but terrifyingly dangerous Salamanca cartel member.", seriesId: "s_bcs", tags: ["cartel", "villain"] },

  // ── The Walking Dead ──
  { id: "c_wd_rick", name: "Rick Grimes", image: img("Rick Grimes"), description: "The sheriff-turned-survivor who leads a band of post-apocalyptic refugees.", seriesId: "s_wd", tags: ["protagonist", "sheriff"] },
  { id: "c_wd_daryl", name: "Daryl Dixon", image: img("Daryl Dixon"), description: "A crossbow-wielding redneck who becomes the group's best fighter.", seriesId: "s_wd", tags: ["survivor", "crossbow"] },
  { id: "c_wd_negan", name: "Negan", image: img("Negan"), description: "The barbed-wire-bat wielding ruler of the Saviors.", seriesId: "s_wd", tags: ["villain", "saviors"] },
  { id: "c_wd_michonne", name: "Michonne", image: img("Michonne"), description: "A stoic katana-wielding survivor and Rick's trusted ally.", seriesId: "s_wd", tags: ["survivor", "katana"] },
  { id: "c_wd_carol", name: "Carol Peletier", image: img("Carol Peletier"), description: "A meek housewife who evolved into the group's most dangerous member.", seriesId: "s_wd", tags: ["survivor", "strategist"] },

  // ── House of the Dragon ──
  { id: "c_hotd_rhaenyra", name: "Rhaenyra Targaryen", image: img("Rhaenyra Targaryen"), description: "The first female heir to the Iron Throne, the Realm's Delight.", seriesId: "s_hotd", tags: ["targaryen", "heir"] },
  { id: "c_hotd_daemon", name: "Daemon Targaryen", image: img("Daemon Targaryen"), description: "The Rogue Prince, a brilliant and dangerous dragonrider.", seriesId: "s_hotd", tags: ["targaryen", "rogue"] },
  { id: "c_hotd_alicent", name: "Alicent Hightower", image: img("Alicent Hightower"), description: "The Green Queen whose rivalry with Rhaenyra split the realm.", seriesId: "s_hotd", tags: ["queen", "hightower"] },
  { id: "c_hotd_aemond", name: "Aemond Targaryen", image: img("Aemond Targaryen"), description: "A one-eyed prince who rides the largest living dragon.", seriesId: "s_hotd", tags: ["targaryen", "dragon-rider"] },
  { id: "c_hotd_viserys", name: "King Viserys I", image: img("Viserys I Targaryen"), description: "The well-meaning king whose choices lit the fuse of civil war.", seriesId: "s_hotd", tags: ["king", "targaryen"] },

  // ── Sherlock ──
  { id: "c_sh_sherlock", name: "Sherlock Holmes", image: img("Sherlock Holmes"), description: "The world's only consulting detective with a high-functioning sociopathic mind.", seriesId: "s_sh", tags: ["detective", "genius"] },
  { id: "c_sh_watson", name: "John Watson", image: img("John Watson"), description: "The doctor and loyal partner who keeps Sherlock grounded.", seriesId: "s_sh", tags: ["doctor", "partner"] },
  { id: "c_sh_moriarty", name: "Jim Moriarty", image: img("Jim Moriarty"), description: "The consulting criminal who is Sherlock's dark mirror.", seriesId: "s_sh", tags: ["villain", "genius"] },
  { id: "c_sh_irene", name: "Irene Adler", image: img("Irene Adler"), description: "The Woman who genuinely captivated and challenged Sherlock.", seriesId: "s_sh", tags: ["femme-fatale", "clever"] },

  // ── Doctor Who ──
  { id: "c_dw_doctor", name: "The Doctor", image: img("The Doctor"), description: "A Time Lord from Gallifrey who travels time and space in the TARDIS.", seriesId: "s_dw", tags: ["time-lord", "alien"] },
  { id: "c_dw_rose", name: "Rose Tyler", image: img("Rose Tyler"), description: "The companion who changed the Ninth and Tenth Doctors forever.", seriesId: "s_dw", tags: ["companion", "first"] },
  { id: "c_dw_donna", name: "Donna Noble", image: img("Donna Noble"), description: "The best temp in Chiswick, and the most important woman in the universe.", seriesId: "s_dw", tags: ["companion", "funny"] },
  { id: "c_dw_master", name: "The Master", image: img("The Master"), description: "The Doctor's oldest friend—and greatest enemy—a renegade Time Lord.", seriesId: "s_dw", tags: ["villain", "time-lord"] },

  // ── Lucifer ──
  { id: "c_luc_lucifer", name: "Lucifer Morningstar", image: img("Lucifer Morningstar"), description: "The Devil who retired to LA to run a piano bar.", seriesId: "s_luc", tags: ["devil", "charming"] },
  { id: "c_luc_chloe", name: "Chloe Decker", image: img("Chloe Decker"), description: "The LAPD detective who is mysteriously immune to Lucifer's charm.", seriesId: "s_luc", tags: ["detective", "immune"] },
  { id: "c_luc_amenadiel", name: "Amenadiel", image: img("Amenadiel"), description: "Lucifer's eldest angel brother who can stop time.", seriesId: "s_luc", tags: ["angel", "brother"] },
  { id: "c_luc_maze", name: "Maze", image: img("Maze"), description: "A hell-forged demon and Lucifer's fierce personal bodyguard.", seriesId: "s_luc", tags: ["demon", "fighter"] },

  // ── Wednesday ──
  { id: "c_wed_wednesday", name: "Wednesday Addams", image: img("Wednesday Addams"), description: "The darkly gifted psychic who attends Nevermore Academy.", seriesId: "s_wed", tags: ["protagonist", "psychic"] },
  { id: "c_wed_enid", name: "Enid Sinclair", image: img("Enid Sinclair"), description: "Wednesday's colorful werewolf roommate and unlikely best friend.", seriesId: "s_wed", tags: ["werewolf", "friendly"] },
  { id: "c_wed_xavier", name: "Xavier Thorpe", image: img("Xavier Thorpe"), description: "An artistic psychic whose drawings come to life.", seriesId: "s_wed", tags: ["psychic", "artist"] },
  { id: "c_wed_bianca", name: "Bianca Barclay", image: img("Bianca Barclay"), description: "A siren who uses her song to manipulate those around her.", seriesId: "s_wed", tags: ["siren", "rival"] },

  // ── Prison Break ──
  { id: "c_pb_michael", name: "Michael Scofield", image: img("Michael Scofield"), description: "A structural engineer who tattooed an escape plan on his body.", seriesId: "s_pb", tags: ["genius", "protagonist"] },
  { id: "c_pb_lincoln", name: "Lincoln Burrows", image: img("Lincoln Burrows"), description: "Michael's wrongly convicted brother whom he breaks out of death row.", seriesId: "s_pb", tags: ["brother", "condemned"] },
  { id: "c_pb_tbag", name: "T-Bag", image: img("T-Bag"), description: "The most dangerous and unpredictable prisoner in Fox River.", seriesId: "s_pb", tags: ["villain", "prisoner"] },
  { id: "c_pb_mahone", name: "Alex Mahone", image: img("Alex Mahone"), description: "The FBI agent assigned to hunt down the prison escapees.", seriesId: "s_pb", tags: ["agent", "hunter"] },

  // ── The Mandalorian ──
  { id: "c_mand_mando", name: "Din Djarin (Mando)", image: img("The Mandalorian"), description: "A bounty hunter of the ancient Mandalorian creed.", seriesId: "s_mand", tags: ["mandalorian", "bounty-hunter"] },
  { id: "c_mand_grogu", name: "Grogu (Baby Yoda)", image: img("Grogu"), description: "A 50-year-old Force-sensitive child of Yoda's species.", seriesId: "s_mand", tags: ["jedi", "baby"] },
  { id: "c_mand_bokatan", name: "Bo-Katan Kryze", image: img("Bo-Katan"), description: "A fierce Mandalorian warrior seeking to reclaim her homeworld.", seriesId: "s_mand", tags: ["mandalorian", "warrior"] },
  { id: "c_mand_ahsoka", name: "Ahsoka Tano", image: img("Ahsoka Tano"), description: "A former Jedi padawan who walks her own path.", seriesId: "s_mand", tags: ["jedi", "togruta"] },

  // ── Jurassic Park / World ──
  { id: "c_jp_trex", name: "T-Rex", image: img("T-Rex Jurassic"), description: "The terrifying apex predator of Jurassic Park.", seriesId: "s_jp", tags: ["dinosaur", "predator"] },
  { id: "c_jp_grant", name: "Dr. Alan Grant", image: img("Alan Grant"), description: "A paleontologist who finds himself on Isla Nublar.", seriesId: "s_jp", tags: ["scientist", "protagonist"] },
  { id: "c_jp_malcolm", name: "Dr. Ian Malcolm", image: img("Ian Malcolm"), description: "A chaotician who warned against playing God with nature.", seriesId: "s_jp", tags: ["scientist", "chaos"] },
  { id: "c_jp_owen", name: "Owen Grady", image: img("Owen Grady"), description: "The raptor trainer who formed a bond with Blue.", seriesId: "s_jp", tags: ["trainer", "navy"] },

  // ── Pirates of the Caribbean ──
  { id: "c_potc_jack", name: "Captain Jack Sparrow", image: img("Jack Sparrow"), description: "The eccentric and unpredictable pirate captain of the Black Pearl.", seriesId: "s_potc", tags: ["captain", "pirate"] },
  { id: "c_potc_will", name: "Will Turner", image: img("Will Turner"), description: "A blacksmith's apprentice turned pirate seeking his father's freedom.", seriesId: "s_potc", tags: ["blacksmith", "hero"] },
  { id: "c_potc_elizabeth", name: "Elizabeth Swann", image: img("Elizabeth Swann"), description: "A governor's daughter who becomes the Pirate King.", seriesId: "s_potc", tags: ["pirate-king", "heroine"] },
  { id: "c_potc_barbossa", name: "Hector Barbossa", image: img("Hector Barbossa"), description: "The cursed captain of the Black Pearl, an unforgettable villain.", seriesId: "s_potc", tags: ["villain", "cursed"] },

  // ── The Matrix ──
  { id: "c_mx_neo", name: "Neo", image: img("Neo"), description: "The One—a hacker who discovers the world is a simulation.", seriesId: "s_mx", tags: ["protagonist", "the-one"] },
  { id: "c_mx_trinity", name: "Trinity", image: img("Trinity"), description: "The fearless hacker and Neo's partner in the real world.", seriesId: "s_mx", tags: ["hacker", "fighter"] },
  { id: "c_mx_morpheus", name: "Morpheus", image: img("Morpheus"), description: "The believer who freed Neo's mind from the Matrix.", seriesId: "s_mx", tags: ["mentor", "captain"] },
  { id: "c_mx_smith", name: "Agent Smith", image: img("Agent Smith"), description: "The relentless viral agent hunting humanity inside the Matrix.", seriesId: "s_mx", tags: ["agent", "villain"] },

  // ── Terminator ──
  { id: "c_term_t800", name: "T-800 (Terminator)", image: img("Terminator"), description: "A machine sent from the future to protect or destroy John Connor.", seriesId: "s_term", tags: ["machine", "protector"] },
  { id: "c_term_john", name: "John Connor", image: img("John Connor"), description: "The future leader of the human resistance against Skynet.", seriesId: "s_term", tags: ["leader", "resistance"] },
  { id: "c_term_sarah", name: "Sarah Connor", image: img("Sarah Connor"), description: "John's mother who became a hardened warrior to protect her son.", seriesId: "s_term", tags: ["warrior", "mother"] },
  { id: "c_term_t1000", name: "T-1000", image: img("T-1000"), description: "A liquid-metal Terminator that can mimic any form.", seriesId: "s_term", tags: ["machine", "shape-shifter"] },

  // ── John Wick ──
  { id: "c_jw_john", name: "John Wick", image: img("John Wick"), description: "The Baba Yaga — the deadliest assassin in the world.", seriesId: "s_jw", tags: ["assassin", "legend"] },
  { id: "c_jw_winston", name: "Winston", image: img("Winston John Wick"), description: "The elegant and powerful manager of the Continental Hotel.", seriesId: "s_jw", tags: ["manager", "powerful"] },
  { id: "c_jw_bowery", name: "Bowery King", image: img("Bowery King"), description: "The king of the underground network of spies and assassins.", seriesId: "s_jw", tags: ["underworld", "king"] },
  { id: "c_jw_viggo", name: "Viggo Tarasov", image: img("Viggo Tarasov"), description: "The Russian crime lord who made the terrible mistake of killing John's dog.", seriesId: "s_jw", tags: ["villain", "crime-lord"] },

  // ── Mission: Impossible ──
  { id: "c_mi_ethan", name: "Ethan Hunt", image: img("Ethan Hunt"), description: "An IMF agent who accepts every impossible mission.", seriesId: "s_mi", tags: ["agent", "spy"] },
  { id: "c_mi_luther", name: "Luther Stickell", image: img("Luther Stickell"), description: "Ethan's brilliant and loyal hacker partner.", seriesId: "s_mi", tags: ["hacker", "ally"] },
  { id: "c_mi_benji", name: "Benji Dunn", image: img("Benji Dunn"), description: "The team's tech expert whose humor lightens dangerous missions.", seriesId: "s_mi", tags: ["tech", "humor"] },
  { id: "c_mi_ilsa", name: "Ilsa Faust", image: img("Ilsa Faust"), description: "A brilliant MI6 operative whose allegiances shift.", seriesId: "s_mi", tags: ["spy", "fighter"] },

  // ── Dune ──
  { id: "c_dune_paul", name: "Paul Atreides", image: img("Paul Atreides"), description: "The Kwisatz Haderach who leads a desert crusade across the galaxy.", seriesId: "s_dune", tags: ["protagonist", "messiah"] },
  { id: "c_dune_chani", name: "Chani", image: img("Chani"), description: "A fierce Fremen warrior who guides Paul in the desert.", seriesId: "s_dune", tags: ["fremen", "warrior"] },
  { id: "c_dune_jessica", name: "Lady Jessica", image: img("Lady Jessica"), description: "A Bene Gesserit who defied her order for love of Duke Leto.", seriesId: "s_dune", tags: ["bene-gesserit", "mother"] },
  { id: "c_dune_baron", name: "Baron Harkonnen", image: img("Baron Harkonnen"), description: "The grotesque and scheming villain who controls Arrakis.", seriesId: "s_dune", tags: ["villain", "harkonnen"] },
  { id: "c_dune_stilgar", name: "Stilgar", image: img("Stilgar"), description: "The respected Fremen naib who becomes Paul's loyal general.", seriesId: "s_dune", tags: ["fremen", "leader"] },

  // ── Spider-Man: Into the Spider-Verse ──
  { id: "c_spv_miles", name: "Miles Morales", image: img("Miles Morales"), description: "The Brooklyn teenager who becomes his world's Spider-Man.", seriesId: "s_spv", tags: ["protagonist", "spider-man"] },
  { id: "c_spv_peter", name: "Peter B. Parker", image: img("Peter B Parker"), description: "A worn-out Peter Parker from another universe who mentors Miles.", seriesId: "s_spv", tags: ["mentor", "spider-man"] },
  { id: "c_spv_gwen", name: "Spider-Gwen", image: img("Spider-Gwen"), description: "Ghost-Spider from an alternate universe—a favorite of fans worldwide.", seriesId: "s_spv", tags: ["spider-woman", "drummer"] },
  { id: "c_spv_peni", name: "Peni Parker", image: img("Peni Parker"), description: "A mech-piloting Spider-Person from an anime-style universe.", seriesId: "s_spv", tags: ["mech", "anime"] },
  { id: "c_spv_noir", name: "Spider-Man Noir", image: img("Spider-Man Noir"), description: "A hardboiled 1930s Spider-Man from a black-and-white world.", seriesId: "s_spv", tags: ["noir", "detective"] },

  // ── Narnia ──
  { id: "c_narn_aslan", name: "Aslan", image: img("Aslan"), description: "The great lion, son of the Emperor Beyond the Sea, Narnia's creator.", seriesId: "s_narn", tags: ["lion", "divine"] },
  { id: "c_narn_lucy", name: "Lucy Pevensie", image: img("Lucy Pevensie"), description: "The youngest Pevensie who first discovers Narnia.", seriesId: "s_narn", tags: ["protagonist", "pure"] },
  { id: "c_narn_peter", name: "Peter Pevensie", image: img("Peter Pevensie"), description: "The High King of Narnia, the firstborn of the four siblings.", seriesId: "s_narn", tags: ["high-king", "leader"] },
  { id: "c_narn_jadis", name: "The White Witch", image: img("White Witch Narnia"), description: "Jadis, the cold and tyrannical ruler who brought a hundred-year winter.", seriesId: "s_narn", tags: ["villain", "witch"] },

  // ── Maze Runner ──
  { id: "c_mz_thomas", name: "Thomas", image: img("Thomas Maze Runner"), description: "A Glader who arrives with no memory but a will to find the exit.", seriesId: "s_mz", tags: ["protagonist", "runner"] },
  { id: "c_mz_teresa", name: "Teresa", image: img("Teresa Maze Runner"), description: "The only girl ever sent to the Glade, Thomas's old friend.", seriesId: "s_mz", tags: ["telepath", "heroine"] },
  { id: "c_mz_newt", name: "Newt", image: img("Newt Maze Runner"), description: "The compassionate second-in-command who holds the Glade together.", seriesId: "s_mz", tags: ["leader", "second"] },
  { id: "c_mz_minho", name: "Minho", image: img("Minho Maze Runner"), description: "The fastest runner in the Glade, brave and sarcastic.", seriesId: "s_mz", tags: ["runner", "fighter"] },

  // ── Divergent ──
  { id: "c_div_tris", name: "Tris Prior", image: img("Tris Prior"), description: "A Divergent who doesn't fit the faction system's mold.", seriesId: "s_div", tags: ["protagonist", "divergent"] },
  { id: "c_div_four", name: "Four (Tobias Eaton)", image: img("Four Divergent"), description: "Dauntless's brooding instructor who is also Divergent.", seriesId: "s_div", tags: ["instructor", "divergent"] },
  { id: "c_div_jeanine", name: "Jeanine Matthews", image: img("Jeanine Matthews"), description: "The calculating Erudite leader who weaponizes the factions.", seriesId: "s_div", tags: ["villain", "leader"] },
  { id: "c_div_peter", name: "Peter Hayes", image: img("Peter Hayes"), description: "Tris's ruthless bully who exists purely to look out for himself.", seriesId: "s_div", tags: ["antagonist", "rival"] },

  // ── Shadow and Bone ──
  { id: "c_sob_alina", name: "Alina Starkov", image: img("Alina Starkov"), description: "An orphaned mapmaker who discovers she can summon light.", seriesId: "s_sob", tags: ["protagonist", "sun-summoner"] },
  { id: "c_sob_darkling", name: "The Darkling (General Kirigan)", image: img("The Darkling"), description: "The most powerful Grisha, manipulator of shadows.", seriesId: "s_sob", tags: ["villain", "shadow"] },
  { id: "c_sob_mal", name: "Mal Oretsev", image: img("Mal Oretsev"), description: "Alina's childhood friend and the best tracker in the First Army.", seriesId: "s_sob", tags: ["tracker", "friend"] },
  { id: "c_sob_kaz", name: "Kaz Brekker", image: img("Kaz Brekker"), description: "The cunning leader of the Dregs who always has an angle.", seriesId: "s_sob", tags: ["thief", "crows"] },

  // ── Eragon ──
  { id: "c_er_eragon", name: "Eragon", image: img("Eragon"), description: "A farm boy who becomes a Dragon Rider and hero of the Varden.", seriesId: "s_er", tags: ["rider", "protagonist"] },
  { id: "c_er_saphira", name: "Saphira", image: img("Saphira"), description: "Eragon's brilliant blue dragon and his most trusted partner.", seriesId: "s_er", tags: ["dragon", "saphira"] },
  { id: "c_er_murtagh", name: "Murtagh", image: img("Murtagh"), description: "A complex ally-turned-enemy rider who was never given a real choice.", seriesId: "s_er", tags: ["rider", "villain"] },
  { id: "c_er_brom", name: "Brom", image: img("Brom"), description: "The old storyteller who hides a legendary past as a Dragon Rider.", seriesId: "s_er", tags: ["mentor", "rider"] },

  // ── Minecraft ──
  { id: "c_mc_steve", name: "Steve", image: img("Steve Minecraft"), description: "The default player character who punches trees and builds kingdoms.", seriesId: "s_mc", tags: ["builder", "survivor"] },
  { id: "c_mc_alex", name: "Alex", image: img("Alex Minecraft"), description: "The second default player character with orange hair.", seriesId: "s_mc", tags: ["builder", "survivor"] },
  { id: "c_mc_creeper", name: "Creeper", image: img("Creeper Minecraft"), description: "The iconic green mob that silently approaches and explodes.", seriesId: "s_mc", tags: ["mob", "dangerous"] },
  { id: "c_mc_enderman", name: "Enderman", image: img("Enderman"), description: "A tall neutral mob from The End who hates being stared at.", seriesId: "s_mc", tags: ["mob", "teleport"] },

  // ── GTA ──
  { id: "c_gta_cj", name: "Carl Johnson (CJ)", image: img("CJ GTA"), description: "The Grove Street Families leader who returned to save his hood.", seriesId: "s_gta", tags: ["protagonist", "grove-street"] },
  { id: "c_gta_tommy", name: "Tommy Vercetti", image: img("Tommy Vercetti"), description: "The ruthless Vice City crime lord who built an empire from nothing.", seriesId: "s_gta", tags: ["protagonist", "crime-lord"] },
  { id: "c_gta_niko", name: "Niko Bellic", image: img("Niko Bellic"), description: "An Eastern European immigrant seeking the American Dream in Liberty City.", seriesId: "s_gta", tags: ["protagonist", "veteran"] },
  { id: "c_gta_trevor", name: "Trevor Philips", image: img("Trevor Philips"), description: "The unhinged and unpredictable wildcard of the GTA V trio.", seriesId: "s_gta", tags: ["protagonist", "unhinged"] },
  { id: "c_gta_michael", name: "Michael De Santa", image: img("Michael De Santa"), description: "A retired bank robber living in witness protection in Los Santos.", seriesId: "s_gta", tags: ["protagonist", "retired"] },
  { id: "c_gta_franklin", name: "Franklin Clinton", image: img("Franklin Clinton"), description: "The youngest of the trio, a skilled driver from Chamberlain Hills.", seriesId: "s_gta", tags: ["protagonist", "driver"] },

  // ── Red Dead Redemption ──
  { id: "c_rdr_arthur", name: "Arthur Morgan", image: img("Arthur Morgan"), description: "The loyal outlaw of the Van der Linde gang with a growing conscience.", seriesId: "s_rdr", tags: ["protagonist", "outlaw"] },
  { id: "c_rdr_john", name: "John Marston", image: img("John Marston"), description: "The former outlaw seeking redemption to save his family.", seriesId: "s_rdr", tags: ["protagonist", "redemption"] },
  { id: "c_rdr_dutch", name: "Dutch van der Linde", image: img("Dutch van der Linde"), description: "The charismatic and increasingly unhinged gang leader.", seriesId: "s_rdr", tags: ["leader", "idealist"] },
  { id: "c_rdr_hosea", name: "Hosea Matthews", image: img("Hosea Matthews"), description: "The wise con-man elder of the Van der Linde gang.", seriesId: "s_rdr", tags: ["mentor", "con-man"] },
  { id: "c_rdr_charles", name: "Charles Smith", image: img("Charles Smith"), description: "The quiet and principled half-Black, half-Native hunter of the gang.", seriesId: "s_rdr", tags: ["hunter", "loyal"] },

  // ── Dark Souls ──
  { id: "c_ds2_solaire", name: "Solaire of Astora", image: img("Solaire of Astora"), description: "A knight of Astora on a quest to find his own sun.", seriesId: "s_ds2", tags: ["sunbro", "knight"] },
  { id: "c_ds2_siegmeyer", name: "Siegmeyer of Catarina", image: img("Siegmeyer of Catarina"), description: "A jolly onion-knight sleeping by every locked door.", seriesId: "s_ds2", tags: ["onion-knight", "jolly"] },
  { id: "c_ds2_artorias", name: "Knight Artorias", image: img("Knight Artorias"), description: "The Abysswalker, a legendary knight fallen to the Abyss.", seriesId: "s_ds2", tags: ["knight", "legend"] },
  { id: "c_ds2_gwyn", name: "Gwyn, Lord of Cinder", image: img("Gwyn"), description: "The First Lord who linked the First Flame and became a hollow.", seriesId: "s_ds2", tags: ["boss", "lord"] },
  { id: "c_ds2_sif", name: "Sif the Great Grey Wolf", image: img("Sif Great Grey Wolf"), description: "Artorias's loyal wolf who guards his grave with a sword.", seriesId: "s_ds2", tags: ["wolf", "loyal"] },

  // ── Skyrim ──
  { id: "c_sky_dragonborn", name: "Dragonborn (Dovahkiin)", image: img("Dragonborn"), description: "The Dragonborn hero of Skyrim who can absorb dragon souls.", seriesId: "s_sky", tags: ["protagonist", "dragonborn"] },
  { id: "c_sky_lydia", name: "Lydia", image: img("Lydia Skyrim"), description: "The Dragonborn's housecarl sworn to carry their burdens.", seriesId: "s_sky", tags: ["housecarl", "loyal"] },
  { id: "c_sky_alduin", name: "Alduin the World-Eater", image: img("Alduin"), description: "The dragon god of destruction destined to devour all of Nirn.", seriesId: "s_sky", tags: ["dragon", "villain"] },
  { id: "c_sky_paarthurnax", name: "Paarthurnax", image: img("Paarthurnax"), description: "The great dragon master of the Way of the Voice.", seriesId: "s_sky", tags: ["dragon", "mentor"] },
  { id: "c_sky_serana", name: "Serana", image: img("Serana"), description: "A pure-blood vampire and powerful ally from Dawnguard.", seriesId: "s_sky", tags: ["vampire", "ally"] },

  // ── Fallout ──
  { id: "c_fo_sole", name: "Sole Survivor", image: img("Sole Survivor Fallout"), description: "A pre-war citizen who wakes in the post-apocalypse to find their child.", seriesId: "s_fo", tags: ["protagonist", "pre-war"] },
  { id: "c_fo_nick", name: "Nick Valentine", image: img("Nick Valentine"), description: "A synth detective with a classic noir look and a good heart.", seriesId: "s_fo", tags: ["synth", "detective"] },
  { id: "c_fo_piper", name: "Piper Wright", image: img("Piper Wright"), description: "A journalist determined to expose the truth about the Institute.", seriesId: "s_fo", tags: ["journalist", "companion"] },
  { id: "c_fo_hancock", name: "John Hancock", image: img("John Hancock Fallout"), description: "A ghoulified mayor of Goodneighbor with a Robin Hood complex.", seriesId: "s_fo", tags: ["ghoul", "mayor"] },
  { id: "c_fo_dogmeat", name: "Dogmeat", image: img("Dogmeat"), description: "The Sole Survivor's loyal German Shepherd companion.", seriesId: "s_fo", tags: ["dog", "companion"] },

  // ── Assassin's Creed ──
  { id: "c_ac_ezio", name: "Ezio Auditore", image: img("Ezio Auditore"), description: "The charismatic Italian master assassin of the Renaissance.", seriesId: "s_ac", tags: ["assassin", "italian"] },
  { id: "c_ac_altair", name: "Altaïr Ibn-LaʼAhad", image: img("Altair"), description: "The original Assassin who rewrote the creed.", seriesId: "s_ac", tags: ["assassin", "original"] },
  { id: "c_ac_connor", name: "Ratonhnhaké:ton (Connor)", image: img("Connor Kenway"), description: "A half-Mohawk assassin during the American Revolution.", seriesId: "s_ac", tags: ["assassin", "mohawk"] },
  { id: "c_ac_edward", name: "Edward Kenway", image: img("Edward Kenway"), description: "A pirate who stumbled into the Assassin Brotherhood.", seriesId: "s_ac", tags: ["assassin", "pirate"] },
  { id: "c_ac_bayek", name: "Bayek of Siwa", image: img("Bayek of Siwa"), description: "The last Medjay and co-founder of the Hidden Ones.", seriesId: "s_ac", tags: ["medjay", "founder"] },
  { id: "c_ac_eivor", name: "Eivor Varinsdottir", image: img("Eivor"), description: "A Viking raider who discovers the secrets of the Norse gods.", seriesId: "s_ac", tags: ["viking", "wolf"] },

  // ── Halo ──
  { id: "c_halo_chief", name: "Master Chief (John-117)", image: img("Master Chief"), description: "The UNSC's greatest Spartan warrior and humanity's last hope.", seriesId: "s_halo", tags: ["spartan", "protagonist"] },
  { id: "c_halo_cortana", name: "Cortana", image: img("Cortana"), description: "Chief's loyal AI partner who sacrificed everything to save humanity.", seriesId: "s_halo", tags: ["ai", "partner"] },
  { id: "c_halo_arbiter", name: "The Arbiter (Thel 'Vadam)", image: img("The Arbiter"), description: "A disgraced Covenant Elite who becomes Chief's unlikely ally.", seriesId: "s_halo", tags: ["elite", "arbiter"] },
  { id: "c_halo_johnson", name: "Sergeant Johnson", image: img("Sergeant Johnson"), description: "The UNSC's most legendary ODST sergeant, always in the fight.", seriesId: "s_halo", tags: ["sergeant", "odst"] },
  { id: "c_halo_343", name: "343 Guilty Spark", image: img("343 Guilty Spark"), description: "The ancient Forerunner monitor of Installation 04.", seriesId: "s_halo", tags: ["monitor", "ai"] },

  // ── Resident Evil ──
  { id: "c_re_leon", name: "Leon S. Kennedy", image: img("Leon Kennedy"), description: "A rookie cop on his worst day ever who became a government agent.", seriesId: "s_re", tags: ["agent", "hero"] },
  { id: "c_re_claire", name: "Claire Redfield", image: img("Claire Redfield"), description: "A college student searching for her brother in Raccoon City.", seriesId: "s_re", tags: ["heroine", "biker"] },
  { id: "c_re_chris", name: "Chris Redfield", image: img("Chris Redfield"), description: "An S.T.A.R.S. veteran who punches boulders and fights bioterrorism.", seriesId: "s_re", tags: ["stars", "bsaa"] },
  { id: "c_re_jill", name: "Jill Valentine", image: img("Jill Valentine"), description: "The master of unlocking and survivor of the Nemesis.", seriesId: "s_re", tags: ["stars", "survivor"] },
  { id: "c_re_ada", name: "Ada Wong", image: img("Ada Wong"), description: "A mysterious spy who moves between all factions.", seriesId: "s_re", tags: ["spy", "mysterious"] },
  { id: "c_re_nemesis", name: "Nemesis", image: img("Nemesis"), description: "A relentless bioweapon created to hunt S.T.A.R.S. members.", seriesId: "s_re", tags: ["bioweapon", "pursuer"] },

  // ── Dragon Age ──
  { id: "c_da_hawke", name: "Hawke", image: img("Hawke Dragon Age"), description: "The Champion of Kirkwall who sparked a war between mages and templars.", seriesId: "s_da", tags: ["champion", "protagonist"] },
  { id: "c_da_inquisitor", name: "The Inquisitor", image: img("The Inquisitor"), description: "The Herald of Andraste who closes the Breach and leads the Inquisition.", seriesId: "s_da", tags: ["inquisitor", "herald"] },
  { id: "c_da_morrigan", name: "Morrigan", image: img("Morrigan Dragon Age"), description: "A mysterious apostate mage with hidden ties to the Old Gods.", seriesId: "s_da", tags: ["mage", "witch"] },
  { id: "c_da_alistair", name: "Alistair", image: img("Alistair"), description: "A bumbling but earnest Grey Warden and prince of Ferelden.", seriesId: "s_da", tags: ["grey-warden", "prince"] },
  { id: "c_da_solas", name: "Solas", image: img("Solas Dragon Age"), description: "An elven apostate whose true identity reshapes the entire world.", seriesId: "s_da", tags: ["mage", "mysterious"] },

  // ── Marvel Comics (616) ──
  { id: "c_mvc_wolverine", name: "Wolverine (Logan)", image: img("Wolverine Comics"), description: "A mutant with adamantium bones and a healing factor that won't quit.", seriesId: "s_mvc", tags: ["mutant", "x-men"] },
  { id: "c_mvc_deadpool", name: "Deadpool (Wade Wilson)", image: img("Deadpool Comics"), description: "The Merc with a Mouth who knows he's in a comic book.", seriesId: "s_mvc", tags: ["mercenary", "fourth-wall"] },
  { id: "c_mvc_storm", name: "Storm (Ororo Munroe)", image: img("Storm Comics"), description: "The Weather Witch and queen of the X-Men.", seriesId: "s_mvc", tags: ["mutant", "weather"] },
  { id: "c_mvc_magneto", name: "Magneto (Erik Lehnsherr)", image: img("Magneto"), description: "Master of Magnetism and the X-Men's greatest rival and sometimes ally.", seriesId: "s_mvc", tags: ["mutant", "villain"] },
  { id: "c_mvc_cyclops", name: "Cyclops (Scott Summers)", image: img("Cyclops"), description: "The field leader of the X-Men who fires optic blasts.", seriesId: "s_mvc", tags: ["x-men", "leader"] },
  { id: "c_mvc_jean", name: "Jean Grey (Phoenix)", image: img("Jean Grey"), description: "A powerful psychic mutant who becomes the cosmic Phoenix Force.", seriesId: "s_mvc", tags: ["mutant", "phoenix"] },

  // ── DC Comics ──
  { id: "c_dcc_batman", name: "Batman (Bruce Wayne)", image: img("Batman Comics"), description: "The Dark Knight of Gotham, the world's greatest detective.", seriesId: "s_dcc", tags: ["detective", "vigilante"] },
  { id: "c_dcc_superman", name: "Superman (Clark Kent)", image: img("Superman Comics"), description: "The Man of Steel, humanity's greatest champion.", seriesId: "s_dcc", tags: ["kryptonian", "hero"] },
  { id: "c_dcc_nightwing", name: "Nightwing (Dick Grayson)", image: img("Nightwing"), description: "The original Robin who stepped out of Batman's shadow.", seriesId: "s_dcc", tags: ["vigilante", "acrobat"] },
  { id: "c_dcc_green_lantern", name: "Green Lantern (Hal Jordan)", image: img("Green Lantern"), description: "A test pilot chosen by a power ring to guard Sector 2814.", seriesId: "s_dcc", tags: ["lantern", "pilot"] },
  { id: "c_dcc_lex_luthor", name: "Lex Luthor", image: img("Lex Luthor"), description: "The brilliant and relentless arch-enemy of Superman.", seriesId: "s_dcc", tags: ["villain", "genius"] },
  { id: "c_dcc_joker", name: "The Joker", image: img("Joker Comics"), description: "The Clown Prince of Crime who exists to torment Batman.", seriesId: "s_dcc", tags: ["villain", "chaos"] },

  // ── Invincible extras ──
  { id: "c_inv_robot", name: "Robot (Rudy Connors)", image: img("Robot Invincible"), description: "The Teen Team's genius strategist who evolves into something sinister.", seriesId: "s_inv", tags: ["genius", "robot"] },
  { id: "c_inv_eve", name: "Atom Eve", image: img("Atom Eve"), description: "A hero who can manipulate matter at will.", seriesId: "s_inv", tags: ["matter-manipulation", "hero"] },
  { id: "c_inv_angstrom", name: "Angstrom Levy", image: img("Angstrom Levy"), description: "A villain who absorbed dimensional knowledge and blames Mark for everything.", seriesId: "s_inv", tags: ["villain", "dimension"] },

  // ── Spawn ──
  { id: "c_spawn_spawn", name: "Spawn (Al Simmons)", image: img("Spawn"), description: "A CIA operative reborn as a hellspawn with a living suit of armor.", seriesId: "s_spawn", tags: ["protagonist", "hellspawn"] },
  { id: "c_spawn_violator", name: "The Violator (Clown)", image: img("Violator Clown"), description: "A demonic clown who masquerades as Spawn's nemesis.", seriesId: "s_spawn", tags: ["villain", "demon"] },
  { id: "c_spawn_cogliostro", name: "Cogliostro", image: img("Cogliostro"), description: "An old vagrant who secretly guides Spawn toward good.", seriesId: "s_spawn", tags: ["mentor", "immortal"] },
  { id: "c_spawn_wanda", name: "Wanda Blake", image: img("Wanda Blake"), description: "Al Simmons' widow whose love crosses life and death.", seriesId: "s_spawn", tags: ["love", "human"] },

  // ── TMNT ──
  { id: "c_tmnt_leo", name: "Leonardo", image: img("Leonardo TMNT"), description: "The blue-masked leader who fights with twin katana.", seriesId: "s_tmnt", tags: ["leader", "katana"] },
  { id: "c_tmnt_mikey", name: "Michelangelo", image: img("Michelangelo TMNT"), description: "The fun-loving turtle with nunchucks who loves pizza.", seriesId: "s_tmnt", tags: ["cheerful", "nunchucks"] },
  { id: "c_tmnt_raph", name: "Raphael", image: img("Raphael TMNT"), description: "The hot-headed red turtle who fights with twin sai.", seriesId: "s_tmnt", tags: ["fierce", "sai"] },
  { id: "c_tmnt_donnie", name: "Donatello", image: img("Donatello TMNT"), description: "The tech genius purple turtle who wields a bo staff.", seriesId: "s_tmnt", tags: ["genius", "tech"] },
  { id: "c_tmnt_shredder", name: "Shredder (Oroku Saki)", image: img("Shredder"), description: "The ruthless leader of the Foot Clan and the Turtles' nemesis.", seriesId: "s_tmnt", tags: ["villain", "foot-clan"] },

  // ── Saga ──
  { id: "c_saga_marko", name: "Marko", image: img("Marko Saga"), description: "A Wreath soldier who deserted to be with the woman he loves.", seriesId: "s_saga", tags: ["wreath", "pacifist"] },
  { id: "c_saga_alana", name: "Alana", image: img("Alana Saga"), description: "A Landfall soldier who fell in love with the enemy.", seriesId: "s_saga", tags: ["landfall", "fighter"] },
  { id: "c_saga_hazel", name: "Hazel", image: img("Hazel Saga"), description: "The narrator of her own story, born of two warring races.", seriesId: "s_saga", tags: ["narrator", "mixed"] },
  { id: "c_saga_will", name: "The Will", image: img("The Will Saga"), description: "A Freelancer manhunter with a personal code of justice.", seriesId: "s_saga", tags: ["freelancer", "hunter"] },

  // ── Watchmen ──
  { id: "c_wm_rorschach", name: "Rorschach (Walter Kovacs)", image: img("Rorschach"), description: "A ruthless masked vigilante who refuses to compromise.", seriesId: "s_wm", tags: ["vigilante", "obsessive"] },
  { id: "c_wm_manhattan", name: "Dr. Manhattan (Jon Osterman)", image: img("Doctor Manhattan"), description: "An omnipotent blue being who has transcended humanity entirely.", seriesId: "s_wm", tags: ["omnipotent", "blue"] },
  { id: "c_wm_nite_owl", name: "Nite Owl (Dan Dreiberg)", image: img("Nite Owl"), description: "A retired superhero who misses the old days.", seriesId: "s_wm", tags: ["retired", "hero"] },
  { id: "c_wm_silk_spectre", name: "Silk Spectre (Laurie Juspeczyk)", image: img("Silk Spectre"), description: "A heroine who inherited the mantle from her mother.", seriesId: "s_wm", tags: ["heroine", "fighter"] },
  { id: "c_wm_ozymandias", name: "Ozymandias (Adrian Veidt)", image: img("Ozymandias"), description: "The smartest man on earth who sacrificed millions for world peace.", seriesId: "s_wm", tags: ["villain", "genius"] },

  // ── The Boys Comics ──
  { id: "c_tbc_butcher", name: "Billy Butcher (Comics)", image: img("Billy Butcher Comics"), description: "The Compound V-enhanced leader of The Boys, brutal and brilliant.", seriesId: "s_tbc", tags: ["leader", "anti-hero"] },
  { id: "c_tbc_homelander", name: "Homelander (Comics)", image: img("Homelander Comics"), description: "The even more deranged comics version of The Boys' villain.", seriesId: "s_tbc", tags: ["villain", "supe"] },
  { id: "c_tbc_hughie", name: "Hughie Campbell (Comics)", image: img("Hughie Campbell"), description: "An ordinary man who joins The Boys after personal tragedy.", seriesId: "s_tbc", tags: ["protagonist", "ordinary"] },
  { id: "c_tbc_female", name: "The Female (Kimiko)", image: img("The Female"), description: "A lab-created super with incredible regeneration and combat skill.", seriesId: "s_tbc", tags: ["fighter", "regeneration"] },
];

// ── Seed Tests ─────────────────────────────────────────────────────────────────

export interface SeedTest {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  characterIds: string[];
  language: "en" | "tr";
}

const timg = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=400`;

export const SEED_TESTS: SeedTest[] = [
  // ── Anime (32) ──
  { id: "test_db_01", title: "Which Dragon Ball Character Are You?", description: "From pure-hearted Goku to cold-blooded Frieza — find out your Dragon Ball alter ego.", coverImage: timg("Dragon Ball Test"), characterIds: ["c_db_goku","c_db_vegeta","c_db_gohan","c_db_piccolo","c_db_trunks","c_db_bulma","c_db_goten","c_db_frieza"], language: "en" },
  { id: "test_na_01", title: "Which Naruto Character Are You?", description: "Believe it! Take this test to discover your inner ninja from the Hidden Leaf.", coverImage: timg("Naruto Test"), characterIds: ["c_na_naruto","c_na_sasuke","c_na_sakura","c_na_kakashi","c_na_itachi","c_na_pain","c_na_jiraiya","c_na_gaara","c_na_tsunade"], language: "en" },
  { id: "test_op_01", title: "Which Straw Hat Pirate Are You?", description: "Set sail! Discover which member of the Straw Hat crew matches your spirit.", coverImage: timg("One Piece Test"), characterIds: ["c_op_luffy","c_op_zoro","c_op_nami","c_op_sanji","c_op_robin","c_op_ace","c_op_usopp","c_op_chopper","c_op_boa","c_op_shanks"], language: "en" },
  { id: "test_bl_01", title: "Which Bleach Character Are You?", description: "Soul Reaper, Hollow, or Quincy? Find your place in the world of Bleach.", coverImage: timg("Bleach Test"), characterIds: ["c_bl_ichigo","c_bl_rukia","c_bl_aizen","c_bl_urahara","c_bl_byakuya"], language: "en" },
  { id: "test_at_01", title: "Which Attack on Titan Character Are You?", description: "In a world of Titans, which Survey Corps legend are you?", coverImage: timg("Attack on Titan Test"), characterIds: ["c_at_eren","c_at_mikasa","c_at_levi","c_at_armin","c_at_erwin"], language: "en" },
  { id: "test_dn_01", title: "Which Death Note Character Are You?", description: "Are you a god of the new world, or the world's greatest detective?", coverImage: timg("Death Note Test"), characterIds: ["c_dn_light","c_dn_l","c_dn_ryuk","c_dn_misa"], language: "en" },
  { id: "test_ds_01", title: "Which Demon Slayer Character Are You?", description: "Your blade holds the answer — which Demon Slayer hero are you?", coverImage: timg("Demon Slayer Test"), characterIds: ["c_ds_tanjiro","c_ds_nezuko","c_ds_zenitsu","c_ds_inosuke","c_ds_muzan"], language: "en" },
  { id: "test_jjk_01", title: "Which Jujutsu Kaisen Character Are You?", description: "Cursed energy flows through you — but whose?", coverImage: timg("Jujutsu Kaisen Test"), characterIds: ["c_jjk_yuji","c_jjk_megumi","c_jjk_nobara","c_jjk_gojo","c_jjk_sukuna"], language: "en" },
  { id: "test_hxh_01", title: "Which Hunter x Hunter Character Are You?", description: "Nen shapes who you are. Take the test and discover your Hunter type.", coverImage: timg("Hunter x Hunter Test"), characterIds: ["c_hxh_gon","c_hxh_killua","c_hxh_kurapika","c_hxh_hisoka","c_hxh_netero","c_hxh_leorio","c_hxh_meruem"], language: "en" },
  { id: "test_fma_01", title: "Which Fullmetal Alchemist Character Are You?", description: "Equivalent exchange — find out which FMA soul matches yours.", coverImage: timg("Fullmetal Alchemist Test"), characterIds: ["c_fma_ed","c_fma_al","c_fma_roy","c_fma_envy","c_fma_winry","c_fma_scar","c_fma_lust"], language: "en" },
  { id: "test_jojo_01", title: "Which JoJo Character Are You?", description: "WRYYY! Find out which JoJo's Bizarre Adventure protagonist (or villain) you are.", coverImage: timg("JoJo Test"), characterIds: ["c_jojo_giorno","c_jojo_jotaro","c_jojo_dio","c_jojo_josuke","c_jojo_kira","c_jojo_joseph"], language: "en" },
  { id: "test_bc_01", title: "Which Black Clover Character Are You?", description: "Magic or no magic — which wizard from the Clover Kingdom are you?", coverImage: timg("Black Clover Test"), characterIds: ["c_bc_asta","c_bc_yuno","c_bc_noelle","c_bc_yami","c_bc_luck"], language: "en" },
  { id: "test_mha_01", title: "Which My Hero Academia Character Are You?", description: "Plus Ultra! Discover your quirk — and your MHA counterpart.", coverImage: timg("My Hero Academia Test"), characterIds: ["c_mha_deku","c_mha_bakugo","c_mha_todoroki","c_mha_allmight","c_mha_afo","c_mha_ochaco","c_mha_shigaraki","c_mha_endeavor"], language: "en" },
  { id: "test_csm_01", title: "Which Chainsaw Man Character Are You?", description: "Devils, fiends, and hunters — which Chainsaw Man character are you?", coverImage: timg("Chainsaw Man Test"), characterIds: ["c_csm_denji","c_csm_power","c_csm_makima","c_csm_aki","c_csm_kobeni"], language: "en" },
  { id: "test_tg_01", title: "Which Tokyo Ghoul Character Are You?", description: "Human or Ghoul? Find your place in the shadows of Tokyo.", coverImage: timg("Tokyo Ghoul Test"), characterIds: ["c_tg_kaneki","c_tg_touka","c_tg_arima","c_tg_rize","c_tg_amon"], language: "en" },
  { id: "test_rz_01", title: "Which Re:Zero Character Are You?", description: "Even without Return by Death — which Re:Zero character mirrors your soul?", coverImage: timg("Re Zero Test"), characterIds: ["c_rz_subaru","c_rz_emilia","c_rz_rem","c_rz_ram","c_rz_beatrice"], language: "en" },
  { id: "test_ov_01", title: "Which Overlord Character Are You?", description: "Nazarick calls. Which Floor Guardian or Supreme Being are you?", coverImage: timg("Overlord Test"), characterIds: ["c_ov_ainz","c_ov_albedo","c_ov_shalltear","c_ov_demiurge","c_ov_cocytus"], language: "en" },
  { id: "test_ft_01", title: "Which Fairy Tail Guild Member Are You?", description: "Welcome to the guild! Which Fairy Tail mage are you?", coverImage: timg("Fairy Tail Test"), characterIds: ["c_ft_natsu","c_ft_lucy","c_ft_erza","c_ft_gray","c_ft_gajeel","c_ft_jellal"], language: "en" },
  { id: "test_cg_01", title: "Which Code Geass Character Are You?", description: "All hail — but whose side are you on in this chess game for the world?", coverImage: timg("Code Geass Test"), characterIds: ["c_cg_lelouch","c_cg_suzaku","c_cg_cc","c_cg_kallen","c_cg_schneizel"], language: "en" },
  { id: "test_sg_01", title: "Which Steins;Gate Character Are You?", description: "El Psy Kongroo. Which time-bending lab member are you?", coverImage: timg("Steins Gate Test"), characterIds: ["c_sg_okabe","c_sg_kurisu","c_sg_mayuri","c_sg_daru"], language: "en" },
  { id: "test_spy_01", title: "Which Spy x Family Character Are You?", description: "Operation Strix begins. Are you Spy, Assassin, or Esper?", coverImage: timg("Spy x Family Test"), characterIds: ["c_spy_loid","c_spy_yor","c_spy_anya","c_spy_damian"], language: "en" },
  { id: "test_blue_01", title: "Which Blue Lock Player Are You?", description: "Ego's Blue Lock demands ego. Which striker are you?", coverImage: timg("Blue Lock Test"), characterIds: ["c_blue_isagi","c_blue_bachira","c_blue_rin","c_blue_nagi","c_blue_shidou"], language: "en" },
  { id: "test_hq_01", title: "Which Haikyuu Character Are You?", description: "Serve, spike, or set — which volleyball player are you?", coverImage: timg("Haikyuu Test"), characterIds: ["c_hq_hinata","c_hq_kageyama","c_hq_tsukishima","c_hq_nishinoya","c_hq_bokuto"], language: "en" },
  { id: "test_sd_01", title: "Which Slam Dunk Player Are You?", description: "Hit the court — which Shohoku basketball player are you?", coverImage: timg("Slam Dunk Test"), characterIds: ["c_sd_hanamichi","c_sd_rukawa","c_sd_akagi","c_sd_mitsui"], language: "en" },
  { id: "test_vs_01", title: "Which Vinland Saga Character Are You?", description: "A true warrior has no enemies. Which Vinland Saga soul are you?", coverImage: timg("Vinland Saga Test"), characterIds: ["c_vs_thorfinn","c_vs_askeladd","c_vs_canute","c_vs_bjorn"], language: "en" },
  { id: "test_sl_01", title: "Which Solo Leveling Character Are You?", description: "The system has chosen you. Which Solo Leveling character are you?", coverImage: timg("Solo Leveling Test"), characterIds: ["c_sl_jinwoo","c_sl_cha","c_sl_beru","c_sl_igris"], language: "en" },
  { id: "test_dst_01", title: "Which Dr. Stone Character Are You?", description: "10 billion percent! Which Dr. Stone genius are you?", coverImage: timg("Dr Stone Test"), characterIds: ["c_dst_senku","c_dst_chrome","c_dst_kohaku","c_dst_gen","c_dst_tsukasa"], language: "en" },
  { id: "test_mp_01", title: "Which Mob Psycho 100 Character Are You?", description: "100%! Which psychic from Mob Psycho are you?", coverImage: timg("Mob Psycho Test"), characterIds: ["c_mp_mob","c_mp_reigen","c_mp_dimple","c_mp_ritsu"], language: "en" },
  { id: "test_opm_01", title: "Which One Punch Man Character Are You?", description: "Hero for fun — or hero for pay? Find your OPM match.", coverImage: timg("One Punch Man Test"), characterIds: ["c_opm_saitama","c_opm_genos","c_opm_speed","c_opm_blast","c_opm_tatsumaki","c_opm_garou"], language: "en" },
  { id: "test_pok_01", title: "Which Starter Pokémon Are You?", description: "You're about to embark on a Pokémon journey. Which icon are you?", coverImage: timg("Pokemon Test"), characterIds: ["c_pok_pikachu","c_pok_charizard","c_pok_mewtwo","c_pok_eevee","c_pok_gengar","c_pok_lucario","c_pok_greninja","c_pok_snorlax"], language: "en" },
  { id: "test_arc_01", title: "Which Arcane Character Are You?", description: "Piltover or Zaun — which Arcane hero or villain are you?", coverImage: timg("Arcane Test"), characterIds: ["c_arc_jinx","c_arc_vi","c_arc_jayce","c_arc_viktor","c_arc_silco"], language: "en" },
  { id: "test_kn_01", title: "Which Kaiju No. 8 Character Are You?", description: "The kaiju have arrived. Which Defense Force member are you?", coverImage: timg("Kaiju No 8 Test"), characterIds: ["c_kn_kafka","c_kn_mina","c_kn_reno","c_kn_iharu"], language: "en" },

  // ── TV (15) ──
  { id: "test_st_01", title: "Which Stranger Things Character Are You?", description: "The Upside Down calls. Which Hawkins hero are you?", coverImage: timg("Stranger Things Test"), characterIds: ["c_st_eleven","c_st_mike","c_st_dustin","c_st_hopper"], language: "en" },
  { id: "test_bb_01", title: "Which Breaking Bad Character Are You?", description: "Say my name. Which Breaking Bad legend are you?", coverImage: timg("Breaking Bad Test"), characterIds: ["c_bb_walt","c_bb_jesse","c_bb_gus","c_bb_saul"], language: "en" },
  { id: "test_bcs_01", title: "Which Better Call Saul Character Are You?", description: "It's all good, man. Which Better Call Saul character are you?", coverImage: timg("Better Call Saul Test"), characterIds: ["c_bcs_saul","c_bcs_mike","c_bcs_kim","c_bcs_lalo"], language: "en" },
  { id: "test_tb_01", title: "Which Character from The Boys Are You?", description: "Supes aren't always heroes. Which Boys character are you?", coverImage: timg("The Boys Test"), characterIds: ["c_tb_butcher","c_tb_homelander","c_tb_starlight","c_tb_mm"], language: "en" },
  { id: "test_wd_01", title: "Which Walking Dead Survivor Are You?", description: "In the apocalypse, who would you be? Find your Walking Dead match.", coverImage: timg("Walking Dead Test"), characterIds: ["c_wd_rick","c_wd_daryl","c_wd_negan","c_wd_michonne","c_wd_carol"], language: "en" },
  { id: "test_got_01", title: "Which Game of Thrones Character Are You?", description: "When you play the game of thrones, you win or you die. Who are you?", coverImage: timg("Game of Thrones Test"), characterIds: ["c_got_jon","c_got_dany","c_got_tyrion","c_got_arya","c_got_cersei","c_got_jaime","c_got_sansa","c_got_ned"], language: "en" },
  { id: "test_hotd_01", title: "Which House of the Dragon Character Are You?", description: "Green or Black? Which Targaryen (or Hightower) are you?", coverImage: timg("House of Dragon Test"), characterIds: ["c_hotd_rhaenyra","c_hotd_daemon","c_hotd_alicent","c_hotd_aemond","c_hotd_viserys"], language: "en" },
  { id: "test_sh_01", title: "Which Sherlock Character Are You?", description: "The game is on. Are you the detective, the doctor, or the villain?", coverImage: timg("Sherlock Test"), characterIds: ["c_sh_sherlock","c_sh_watson","c_sh_moriarty","c_sh_irene"], language: "en" },
  { id: "test_dw_01", title: "Which Doctor Who Character Are You?", description: "All of time and space. Which Doctor Who traveller are you?", coverImage: timg("Doctor Who Test"), characterIds: ["c_dw_doctor","c_dw_rose","c_dw_donna","c_dw_master"], language: "en" },
  { id: "test_luc_01", title: "Which Lucifer Character Are You?", description: "The Devil's in the details. Which Lucifer character are you?", coverImage: timg("Lucifer Test"), characterIds: ["c_luc_lucifer","c_luc_chloe","c_luc_amenadiel","c_luc_maze"], language: "en" },
  { id: "test_wed_01", title: "Which Wednesday Character Are You?", description: "Nevermore Academy awaits. Which Wednesday character are you?", coverImage: timg("Wednesday Test"), characterIds: ["c_wed_wednesday","c_wed_enid","c_wed_xavier","c_wed_bianca"], language: "en" },
  { id: "test_pb_01", title: "Which Prison Break Character Are You?", description: "Have a plan. Which Prison Break legend are you?", coverImage: timg("Prison Break Test"), characterIds: ["c_pb_michael","c_pb_lincoln","c_pb_tbag","c_pb_mahone"], language: "en" },
  { id: "test_mand_01", title: "Which Mandalorian Character Are You?", description: "This is the Way. Which Mandalorian character are you?", coverImage: timg("Mandalorian Test"), characterIds: ["c_mand_mando","c_mand_grogu","c_mand_bokatan","c_mand_ahsoka"], language: "en" },
  { id: "test_rick_01", title: "Which Rick and Morty Character Are You?", description: "Wubba lubba dub dub! Which dimension's hero are you?", coverImage: timg("Rick and Morty Test"), characterIds: ["c_rm_rick","c_rm_morty"], language: "en" },
  { id: "test_ava_01", title: "Which Avatar: The Last Airbender Character Are You?", description: "Earth. Fire. Air. Water. Only the Avatar can master all four — but which character are you?", coverImage: timg("Avatar ATLA Test"), characterIds: ["c_ava_aang","c_ava_katara","c_ava_zuko","c_ava_toph"], language: "en" },

  // ── Movies (13) ──
  { id: "test_mcu_01", title: "Which Avenger Are You?", description: "Assemble! Find out which Marvel hero you'd be in the MCU.", coverImage: timg("MCU Test"), characterIds: ["c_mcu_im","c_mcu_sm","c_mcu_thor","c_mcu_ca","c_mcu_hulk","c_mcu_bw","c_mcu_bp","c_mcu_wol"], language: "en" },
  { id: "test_dcu_01", title: "Which DC Character Are You?", description: "Hero or villain? Find out which DC universe character you are.", coverImage: timg("DC Universe Test"), characterIds: ["c_dcu_bm","c_dcu_sm","c_dcu_ww","c_dcu_fl","c_dcu_jok","c_dcu_hq"], language: "en" },
  { id: "test_sw_01", title: "Which Star Wars Character Are You?", description: "May the Force be with you — find your Star Wars identity.", coverImage: timg("Star Wars Test"), characterIds: ["c_sw_luke","c_sw_vader","c_sw_yoda","c_sw_rey","c_sw_obi","c_sw_han","c_sw_leia","c_sw_palpatine"], language: "en" },
  { id: "test_lotr_01", title: "Which Lord of the Rings Character Are You?", description: "One test to find them all. Which Fellowship member are you?", coverImage: timg("Lord of the Rings Test"), characterIds: ["c_lotr_frodo","c_lotr_gandalf","c_lotr_aragorn","c_lotr_legolas","c_lotr_gimli","c_lotr_sauron","c_lotr_sam"], language: "en" },
  { id: "test_hp_01", title: "Which Harry Potter Character Are You?", description: "Which Hogwarts legend are you? Accio your answer!", coverImage: timg("Harry Potter Test"), characterIds: ["c_hp_harry","c_hp_hermione","c_hp_ron","c_hp_voldemort","c_hp_dumbledore","c_hp_snape","c_hp_malfoy"], language: "en" },
  { id: "test_jp_01", title: "Which Jurassic Park Character Are You?", description: "Life finds a way. Which Jurassic Park legend are you?", coverImage: timg("Jurassic Park Test"), characterIds: ["c_jp_trex","c_jp_grant","c_jp_malcolm","c_jp_owen"], language: "en" },
  { id: "test_potc_01", title: "Which Pirates of the Caribbean Character Are You?", description: "Why is the rum gone? Find your pirate alter ego.", coverImage: timg("Pirates of the Caribbean Test"), characterIds: ["c_potc_jack","c_potc_will","c_potc_elizabeth","c_potc_barbossa"], language: "en" },
  { id: "test_mx_01", title: "Which Matrix Character Are You?", description: "Red pill or blue pill? Which Matrix legend are you?", coverImage: timg("Matrix Test"), characterIds: ["c_mx_neo","c_mx_trinity","c_mx_morpheus","c_mx_smith"], language: "en" },
  { id: "test_term_01", title: "Which Terminator Character Are You?", description: "I'll be back. Which Terminator character are you?", coverImage: timg("Terminator Test"), characterIds: ["c_term_t800","c_term_john","c_term_sarah","c_term_t1000"], language: "en" },
  { id: "test_jw_01", title: "Which John Wick Character Are You?", description: "Guns. Lots of guns. Which Continental legend are you?", coverImage: timg("John Wick Test"), characterIds: ["c_jw_john","c_jw_winston","c_jw_bowery","c_jw_viggo"], language: "en" },
  { id: "test_dune_01", title: "Which Dune Character Are You?", description: "The spice must flow. Which Dune legend are you?", coverImage: timg("Dune Test"), characterIds: ["c_dune_paul","c_dune_chani","c_dune_jessica","c_dune_baron","c_dune_stilgar"], language: "en" },
  { id: "test_spv_01", title: "Which Spider-Verse Character Are You?", description: "Anyone can wear the mask. Which Spider-Person are you?", coverImage: timg("Spider-Verse Test"), characterIds: ["c_spv_miles","c_spv_peter","c_spv_gwen","c_spv_peni","c_spv_noir"], language: "en" },
  { id: "test_mi_01", title: "Which Mission Impossible Agent Are You?", description: "Your mission, should you choose to accept it. Which IMF agent are you?", coverImage: timg("Mission Impossible Test"), characterIds: ["c_mi_ethan","c_mi_luther","c_mi_benji","c_mi_ilsa"], language: "en" },

  // ── Books (7) ──
  { id: "test_pj_01", title: "Which Percy Jackson Demigod Are You?", description: "Which Olympian is your divine parent? Find out your Camp Half-Blood identity.", coverImage: timg("Percy Jackson Test"), characterIds: ["c_pj_percy","c_pj_annabeth","c_pj_nico","c_pj_thalia"], language: "en" },
  { id: "test_hg_01", title: "Which Hunger Games Character Are You?", description: "May the odds be ever in your favor. Which District legend are you?", coverImage: timg("Hunger Games Test"), characterIds: ["c_hg_katniss","c_hg_peeta","c_hg_snow","c_hg_finnick"], language: "en" },
  { id: "test_narn_01", title: "Which Narnia Character Are You?", description: "For Narnia and for Aslan! Which Narnian hero (or villain) are you?", coverImage: timg("Narnia Test"), characterIds: ["c_narn_aslan","c_narn_lucy","c_narn_peter","c_narn_jadis"], language: "en" },
  { id: "test_mz_01", title: "Which Maze Runner Character Are You?", description: "WICKED is good. Which Glader are you?", coverImage: timg("Maze Runner Test"), characterIds: ["c_mz_thomas","c_mz_teresa","c_mz_newt","c_mz_minho"], language: "en" },
  { id: "test_div_01", title: "Which Divergent Character Are You?", description: "Faction before blood — or are you Divergent? Find out.", coverImage: timg("Divergent Test"), characterIds: ["c_div_tris","c_div_four","c_div_jeanine","c_div_peter"], language: "en" },
  { id: "test_sob_01", title: "Which Shadow and Bone Character Are You?", description: "The Fold awaits. Which Grisha (or Crow) are you?", coverImage: timg("Shadow and Bone Test"), characterIds: ["c_sob_alina","c_sob_darkling","c_sob_mal","c_sob_kaz"], language: "en" },
  { id: "test_er_01", title: "Which Eragon Character Are You?", description: "Riders and dragons — which Alagaësia legend are you?", coverImage: timg("Eragon Test"), characterIds: ["c_er_eragon","c_er_saphira","c_er_murtagh","c_er_brom"], language: "en" },

  // ── Games (20) ──
  { id: "test_lol_01", title: "Which League of Legends Champion Are You?", description: "Welcome to Summoner's Rift. Which LoL champion is your true form?", coverImage: timg("League of Legends Test"), characterIds: ["c_lol_vi","c_lol_jinx","c_lol_ekko","c_lol_yasuo","c_lol_thresh","c_lol_ahri","c_lol_lux","c_lol_zed","c_lol_leona"], language: "en" },
  { id: "test_val_01", title: "Which Valorant Agent Are You?", description: "Your agent has been selected. Which Valorant operative are you?", coverImage: timg("Valorant Test"), characterIds: ["c_val_jett","c_val_sage","c_val_reyna","c_val_neon","c_val_omen","c_val_killjoy","c_val_phoenix","c_val_chamber"], language: "en" },
  { id: "test_ow_01", title: "Which Overwatch Hero Are You?", description: "The world needs heroes. Which Overwatch champion are you?", coverImage: timg("Overwatch Test"), characterIds: ["c_ow_tracer","c_ow_genji","c_ow_reaper","c_ow_dva","c_ow_mercy","c_ow_hanzo","c_ow_pharah","c_ow_ana"], language: "en" },
  { id: "test_gi_01", title: "Which Genshin Impact Character Are You?", description: "Which Teyvat vision would you wield? Find your Genshin soulmate.", coverImage: timg("Genshin Impact Test"), characterIds: ["c_gi_lumine","c_gi_zhongli","c_gi_hu_tao","c_gi_venti","c_gi_raiden","c_gi_kazuha","c_gi_nahida","c_gi_furina"], language: "en" },
  { id: "test_hsr_01", title: "Which Honkai: Star Rail Character Are You?", description: "Board the Astral Express. Which Star Rail trailblazer are you?", coverImage: timg("Honkai Star Rail Test"), characterIds: ["c_hsr_stelle","c_hsr_bronya","c_hsr_seele","c_hsr_blade","c_hsr_kafka","c_hsr_jingliu"], language: "en" },
  { id: "test_mc_01", title: "Which Minecraft Character Are You?", description: "Build, mine, or haunt? Which Minecraft icon are you?", coverImage: timg("Minecraft Test"), characterIds: ["c_mc_steve","c_mc_alex","c_mc_creeper","c_mc_enderman"], language: "en" },
  { id: "test_gta_01", title: "Which GTA Protagonist Are You?", description: "Welcome to Los Santos — and beyond. Which GTA legend are you?", coverImage: timg("GTA Test"), characterIds: ["c_gta_cj","c_gta_tommy","c_gta_niko","c_gta_trevor","c_gta_michael","c_gta_franklin"], language: "en" },
  { id: "test_rdr_01", title: "Which Red Dead Redemption Character Are You?", description: "Outlaws to the end. Which Van der Linde gang member are you?", coverImage: timg("Red Dead Redemption Test"), characterIds: ["c_rdr_arthur","c_rdr_john","c_rdr_dutch","c_rdr_hosea","c_rdr_charles"], language: "en" },
  { id: "test_cp_01", title: "Which Cyberpunk 2077 Character Are You?", description: "Night City never sleeps. Which cyberpunk legend are you?", coverImage: timg("Cyberpunk Test"), characterIds: ["c_cp_vee","c_cp_johnny","c_cp_judy"], language: "en" },
  { id: "test_er2_01", title: "Which Elden Ring Character Are You?", description: "Arise, Tarnished. Which Elden Ring legend matches your spirit?", coverImage: timg("Elden Ring Test"), characterIds: ["c_er_malenia","c_er_radahn","c_er_ranni"], language: "en" },
  { id: "test_ds2_01", title: "Which Dark Souls Character Are You?", description: "Praise the sun! Which Dark Souls legend are you?", coverImage: timg("Dark Souls Test"), characterIds: ["c_ds2_solaire","c_ds2_siegmeyer","c_ds2_artorias","c_ds2_gwyn","c_ds2_sif"], language: "en" },
  { id: "test_sky_01", title: "Which Skyrim Character Are You?", description: "FUS RO DAH! Which Skyrim hero (or dragon) are you?", coverImage: timg("Skyrim Test"), characterIds: ["c_sky_dragonborn","c_sky_lydia","c_sky_alduin","c_sky_paarthurnax","c_sky_serana"], language: "en" },
  { id: "test_fo_01", title: "Which Fallout Character Are You?", description: "War never changes. Which Fallout survivor are you?", coverImage: timg("Fallout Test"), characterIds: ["c_fo_sole","c_fo_nick","c_fo_piper","c_fo_hancock","c_fo_dogmeat"], language: "en" },
  { id: "test_ac_01", title: "Which Assassin Are You?", description: "Nothing is true, everything is permitted. Which Assassin's Creed hero are you?", coverImage: timg("Assassins Creed Test"), characterIds: ["c_ac_ezio","c_ac_altair","c_ac_connor","c_ac_edward","c_ac_bayek","c_ac_eivor"], language: "en" },
  { id: "test_gow_01", title: "Which God of War Character Are You?", description: "Boy! Which God of War legend are you?", coverImage: timg("God of War Test"), characterIds: ["c_gow_kratos","c_gow_atreus","c_gow_baldur","c_gow_freya"], language: "en" },
  { id: "test_tlou_01", title: "Which The Last of Us Character Are You?", description: "In a world ravaged by cordyceps, which survivor are you?", coverImage: timg("The Last of Us Test"), characterIds: ["c_tlou_joel","c_tlou_ellie","c_tlou_abby","c_tlou_tess"], language: "en" },
  { id: "test_halo_01", title: "Which Halo Character Are You?", description: "Finish the fight. Which Halo legend are you?", coverImage: timg("Halo Test"), characterIds: ["c_halo_chief","c_halo_cortana","c_halo_arbiter","c_halo_johnson","c_halo_343"], language: "en" },
  { id: "test_re_01", title: "Which Resident Evil Character Are You?", description: "Don't use your ink ribbon on me. Which RE survivor are you?", coverImage: timg("Resident Evil Test"), characterIds: ["c_re_leon","c_re_claire","c_re_chris","c_re_jill","c_re_ada","c_re_nemesis"], language: "en" },
  { id: "test_zelda_01", title: "Which Zelda Character Are You?", description: "It's dangerous to go alone! Which Zelda legend are you?", coverImage: timg("Zelda Test"), characterIds: ["c_zelda_link","c_zelda_zelda","c_zelda_ganon"], language: "en" },
  { id: "test_da_01", title: "Which Dragon Age Character Are You?", description: "The Inquisition needs you. Which Dragon Age hero are you?", coverImage: timg("Dragon Age Test"), characterIds: ["c_da_hawke","c_da_inquisitor","c_da_morrigan","c_da_alistair","c_da_solas"], language: "en" },

  // ── Comics (3) ──
  { id: "test_mvc_01", title: "Which Marvel Comics Character Are You?", description: "With great power comes great responsibility. Which Marvel legend are you?", coverImage: timg("Marvel Comics Test"), characterIds: ["c_mvc_wolverine","c_mvc_deadpool","c_mvc_storm","c_mvc_magneto","c_mvc_cyclops","c_mvc_jean"], language: "en" },
  { id: "test_dcc_01", title: "Which DC Comics Character Are You?", description: "DC's finest — which Gotham or Metropolis legend are you?", coverImage: timg("DC Comics Test"), characterIds: ["c_dcc_batman","c_dcc_superman","c_dcc_nightwing","c_dcc_green_lantern","c_dcc_lex_luthor","c_dcc_joker"], language: "en" },
  { id: "test_wm_01", title: "Which Watchmen Character Are You?", description: "Who watches the Watchmen? Find out which mask you'd wear.", coverImage: timg("Watchmen Test"), characterIds: ["c_wm_rorschach","c_wm_manhattan","c_wm_nite_owl","c_wm_silk_spectre","c_wm_ozymandias"], language: "en" },
];

// ── Seed Duels ─────────────────────────────────────────────────────────────────

export interface SeedDuel {
  characterAId: string;
  characterBId: string;
  votesA: number;
  votesB: number;
  title?: string;
}

export const SEED_DUELS: SeedDuel[] = [
  // Classic anime rivalries
  { characterAId: "c_db_goku", characterBId: "c_na_naruto", votesA: 8200, votesB: 6100, title: "Goku vs Naruto" },
  { characterAId: "c_db_goku", characterBId: "c_db_vegeta", votesA: 7400, votesB: 6800, title: "Goku vs Vegeta" },
  { characterAId: "c_na_naruto", characterBId: "c_na_sasuke", votesA: 5900, votesB: 6300, title: "Naruto vs Sasuke" },
  { characterAId: "c_na_itachi", characterBId: "c_na_sasuke", votesA: 7100, votesB: 4200, title: "Itachi vs Sasuke" },
  { characterAId: "c_op_luffy", characterBId: "c_op_zoro", votesA: 5800, votesB: 5600, title: "Luffy vs Zoro" },
  { characterAId: "c_op_luffy", characterBId: "c_na_naruto", votesA: 4900, votesB: 5100, title: "Luffy vs Naruto" },
  { characterAId: "c_bl_ichigo", characterBId: "c_bl_aizen", votesA: 4800, votesB: 6100, title: "Ichigo vs Aizen" },
  { characterAId: "c_at_eren", characterBId: "c_at_levi", votesA: 3200, votesB: 7800, title: "Eren vs Levi" },
  { characterAId: "c_at_levi", characterBId: "c_jjk_gojo", votesA: 6200, votesB: 7400, title: "Levi vs Gojo" },
  { characterAId: "c_dn_light", characterBId: "c_dn_l", votesA: 5500, votesB: 6200, title: "Light vs L" },
  { characterAId: "c_jjk_gojo", characterBId: "c_jjk_sukuna", votesA: 8100, votesB: 7600, title: "Gojo vs Sukuna" },
  { characterAId: "c_jjk_yuji", characterBId: "c_jjk_megumi", votesA: 4200, votesB: 3900, title: "Yuji vs Megumi" },
  { characterAId: "c_hxh_gon", characterBId: "c_hxh_killua", votesA: 5100, votesB: 6800, title: "Gon vs Killua" },
  { characterAId: "c_hxh_hisoka", characterBId: "c_jojo_dio", votesA: 4700, votesB: 5300, title: "Hisoka vs DIO" },
  { characterAId: "c_fma_ed", characterBId: "c_fma_roy", votesA: 5600, votesB: 4800, title: "Edward vs Roy Mustang" },
  { characterAId: "c_ds_tanjiro", characterBId: "c_ds_muzan", votesA: 4900, votesB: 3100, title: "Tanjiro vs Muzan" },
  { characterAId: "c_mha_deku", characterBId: "c_mha_bakugo", votesA: 5200, votesB: 6100, title: "Deku vs Bakugo" },
  { characterAId: "c_mha_allmight", characterBId: "c_opm_saitama", votesA: 5800, votesB: 8900, title: "All Might vs Saitama" },
  { characterAId: "c_opm_saitama", characterBId: "c_db_goku", votesA: 7200, votesB: 9100, title: "Saitama vs Goku" },
  { characterAId: "c_csm_makima", characterBId: "c_rz_rem", votesA: 6400, votesB: 5200, title: "Makima vs Rem" },
  { characterAId: "c_csm_denji", characterBId: "c_tg_kaneki", votesA: 4400, votesB: 5100, title: "Denji vs Kaneki" },
  { characterAId: "c_jojo_jotaro", characterBId: "c_jojo_dio", votesA: 5900, votesB: 6700, title: "Jotaro vs DIO" },
  { characterAId: "c_jojo_giorno", characterBId: "c_jojo_kira", votesA: 7800, votesB: 3400, title: "Giorno vs Kira" },
  { characterAId: "c_ft_natsu", characterBId: "c_ft_erza", votesA: 4600, votesB: 5900, title: "Natsu vs Erza" },
  { characterAId: "c_cg_lelouch", characterBId: "c_dn_light", votesA: 6700, votesB: 5800, title: "Lelouch vs Light Yagami" },
  { characterAId: "c_pok_charizard", characterBId: "c_pok_mewtwo", votesA: 6200, votesB: 7100, title: "Charizard vs Mewtwo" },
  { characterAId: "c_pok_pikachu", characterBId: "c_pok_eevee", votesA: 8400, votesB: 4200, title: "Pikachu vs Eevee" },
  // Heroes vs Villains
  { characterAId: "c_mcu_im", characterBId: "c_dcu_bm", votesA: 7200, votesB: 7100, title: "Iron Man vs Batman" },
  { characterAId: "c_dcu_sm", characterBId: "c_mcu_thor", votesA: 6800, votesB: 6400, title: "Superman vs Thor" },
  { characterAId: "c_dcu_ww", characterBId: "c_mcu_bw", votesA: 7600, votesB: 4200, title: "Wonder Woman vs Black Widow" },
  { characterAId: "c_mcu_sm", characterBId: "c_dcu_fl", votesA: 6100, votesB: 5800, title: "Spider-Man vs The Flash" },
  { characterAId: "c_dcu_jok", characterBId: "c_bb_walt", votesA: 7400, votesB: 5900, title: "Joker vs Heisenberg" },
  { characterAId: "c_tb_homelander", characterBId: "c_dcu_sm", votesA: 4800, votesB: 8100, title: "Homelander vs Superman" },
  { characterAId: "c_inv_omni", characterBId: "c_tb_homelander", votesA: 5600, votesB: 4400, title: "Omni-Man vs Homelander" },
  { characterAId: "c_inv_mark", characterBId: "c_mcu_sm", votesA: 4700, votesB: 5600, title: "Invincible vs Spider-Man" },
  { characterAId: "c_mvc_wolverine", characterBId: "c_mvc_deadpool", votesA: 6800, votesB: 7200, title: "Wolverine vs Deadpool" },
  { characterAId: "c_mvc_magneto", characterBId: "c_dcc_batman", votesA: 6100, votesB: 5700, title: "Magneto vs Batman" },
  { characterAId: "c_wm_rorschach", characterBId: "c_dcc_batman", votesA: 5400, votesB: 6200, title: "Rorschach vs Batman" },
  { characterAId: "c_wm_manhattan", characterBId: "c_db_goku", votesA: 6900, votesB: 8300, title: "Dr. Manhattan vs Goku" },
  // Star Wars internal
  { characterAId: "c_sw_vader", characterBId: "c_sw_luke", votesA: 7200, votesB: 5400, title: "Vader vs Luke" },
  { characterAId: "c_sw_yoda", characterBId: "c_sw_palpatine", votesA: 6800, votesB: 5100, title: "Yoda vs Palpatine" },
  { characterAId: "c_sw_rey", characterBId: "c_sw_obi", votesA: 4200, votesB: 6100, title: "Rey vs Obi-Wan" },
  // Fantasy
  { characterAId: "c_lotr_gandalf", characterBId: "c_hp_dumbledore", votesA: 7800, votesB: 6200, title: "Gandalf vs Dumbledore" },
  { characterAId: "c_lotr_aragorn", characterBId: "c_lotr_legolas", votesA: 5400, votesB: 5900, title: "Aragorn vs Legolas" },
  { characterAId: "c_hp_harry", characterBId: "c_hp_hermione", votesA: 5200, votesB: 6700, title: "Harry vs Hermione" },
  { characterAId: "c_hp_voldemort", characterBId: "c_lotr_sauron", votesA: 4100, votesB: 7200, title: "Voldemort vs Sauron" },
  { characterAId: "c_pj_percy", characterBId: "c_hp_harry", votesA: 5800, votesB: 6100, title: "Percy Jackson vs Harry Potter" },
  { characterAId: "c_hg_katniss", characterBId: "c_pj_annabeth", votesA: 5700, votesB: 5200, title: "Katniss vs Annabeth" },
  // Game characters
  { characterAId: "c_gow_kratos", characterBId: "c_tlou_joel", votesA: 6900, votesB: 6200, title: "Kratos vs Joel" },
  { characterAId: "c_tlou_joel", characterBId: "c_rdr_arthur", votesA: 6800, votesB: 7400, title: "Joel vs Arthur Morgan" },
  { characterAId: "c_rdr_arthur", characterBId: "c_gow_kratos", votesA: 5900, votesB: 7100, title: "Arthur Morgan vs Kratos" },
  { characterAId: "c_gi_zhongli", characterBId: "c_gi_venti", votesA: 6400, votesB: 4900, title: "Zhongli vs Venti" },
  { characterAId: "c_gi_hu_tao", characterBId: "c_gi_raiden", votesA: 5800, votesB: 6100, title: "Hu Tao vs Raiden Shogun" },
  { characterAId: "c_lol_yasuo", characterBId: "c_lol_thresh", votesA: 5600, votesB: 4800, title: "Yasuo vs Thresh" },
  { characterAId: "c_lol_jinx", characterBId: "c_arc_jinx", votesA: 5200, votesB: 6400, title: "LoL Jinx vs Arcane Jinx" },
  { characterAId: "c_val_jett", characterBId: "c_val_reyna", votesA: 6100, votesB: 5800, title: "Jett vs Reyna" },
  { characterAId: "c_ow_tracer", characterBId: "c_ow_genji", votesA: 6400, votesB: 5900, title: "Tracer vs Genji" },
  { characterAId: "c_er_malenia", characterBId: "c_er_radahn", votesA: 7200, votesB: 6800, title: "Malenia vs Radahn" },
  { characterAId: "c_halo_chief", characterBId: "c_gow_kratos", votesA: 5800, votesB: 6700, title: "Master Chief vs Kratos" },
  { characterAId: "c_ac_ezio", characterBId: "c_ac_altair", votesA: 7400, votesB: 5600, title: "Ezio vs Altaïr" },
  { characterAId: "c_re_leon", characterBId: "c_re_chris", votesA: 6800, votesB: 5200, title: "Leon vs Chris" },
  { characterAId: "c_gta_trevor", characterBId: "c_gta_michael", votesA: 5400, votesB: 4800, title: "Trevor vs Michael" },
  // TV rivalries
  { characterAId: "c_bb_walt", characterBId: "c_bb_jesse", votesA: 6200, votesB: 5800, title: "Walter White vs Jesse" },
  { characterAId: "c_bb_gus", characterBId: "c_bb_walt", votesA: 7100, votesB: 5900, title: "Gus Fring vs Heisenberg" },
  { characterAId: "c_got_jon", characterBId: "c_got_dany", votesA: 5900, votesB: 6400, title: "Jon Snow vs Daenerys" },
  { characterAId: "c_got_tyrion", characterBId: "c_got_cersei", votesA: 6800, votesB: 5200, title: "Tyrion vs Cersei" },
  { characterAId: "c_got_arya", characterBId: "c_got_jaime", votesA: 6100, votesB: 5800, title: "Arya vs Jaime" },
  { characterAId: "c_hotd_rhaenyra", characterBId: "c_hotd_alicent", votesA: 6200, votesB: 5700, title: "Rhaenyra vs Alicent" },
  { characterAId: "c_hotd_daemon", characterBId: "c_hotd_aemond", votesA: 7200, votesB: 5900, title: "Daemon vs Aemond" },
  { characterAId: "c_sh_sherlock", characterBId: "c_sh_moriarty", votesA: 6400, votesB: 6200, title: "Sherlock vs Moriarty" },
  { characterAId: "c_tb_butcher", characterBId: "c_tb_homelander", votesA: 5800, votesB: 6100, title: "Butcher vs Homelander" },
  { characterAId: "c_wd_rick", characterBId: "c_wd_negan", votesA: 6400, votesB: 5900, title: "Rick vs Negan" },
  { characterAId: "c_wd_daryl", characterBId: "c_wd_michonne", votesA: 5800, votesB: 5600, title: "Daryl vs Michonne" },
  { characterAId: "c_st_eleven", characterBId: "c_mp_mob", votesA: 5900, votesB: 6400, title: "Eleven vs Mob" },
  { characterAId: "c_rm_rick", characterBId: "c_sg_okabe", votesA: 7100, votesB: 4800, title: "Rick Sanchez vs Okabe" },
  // Cross-universe dream matches
  { characterAId: "c_db_goku", characterBId: "c_mcu_thor", votesA: 8100, votesB: 5900, title: "Goku vs Thor" },
  { characterAId: "c_na_naruto", characterBId: "c_mcu_sm", votesA: 6200, votesB: 5800, title: "Naruto vs Spider-Man" },
  { characterAId: "c_at_levi", characterBId: "c_rdr_arthur", votesA: 5600, votesB: 6200, title: "Levi vs Arthur Morgan" },
  { characterAId: "c_jjk_gojo", characterBId: "c_db_vegeta", votesA: 6800, votesB: 5700, title: "Gojo vs Vegeta" },
  { characterAId: "c_cg_lelouch", characterBId: "c_got_tyrion", votesA: 7100, votesB: 5400, title: "Lelouch vs Tyrion" },
  { characterAId: "c_arc_jinx", characterBId: "c_csm_power", votesA: 6200, votesB: 5400, title: "Jinx vs Power" },
  { characterAId: "c_dune_paul", characterBId: "c_hp_harry", votesA: 5800, votesB: 5100, title: "Paul Atreides vs Harry Potter" },
  { characterAId: "c_mx_neo", characterBId: "c_halo_chief", votesA: 5400, votesB: 6100, title: "Neo vs Master Chief" },
  { characterAId: "c_jw_john", characterBId: "c_mi_ethan", votesA: 6800, votesB: 5700, title: "John Wick vs Ethan Hunt" },
  { characterAId: "c_term_t800", characterBId: "c_halo_chief", votesA: 5100, votesB: 6400, title: "T-800 vs Master Chief" },
  { characterAId: "c_potc_jack", characterBId: "c_ac_edward", votesA: 7200, votesB: 4800, title: "Jack Sparrow vs Edward Kenway" },
  { characterAId: "c_spv_miles", characterBId: "c_mcu_sm", votesA: 6400, votesB: 6100, title: "Miles Morales vs Peter Parker" },
  { characterAId: "c_spv_gwen", characterBId: "c_dcu_ww", votesA: 4800, votesB: 7200, title: "Spider-Gwen vs Wonder Woman" },
  { characterAId: "c_hsr_kafka", characterBId: "c_csm_makima", votesA: 5900, votesB: 6200, title: "Kafka vs Makima" },
  { characterAId: "c_fo_nick", characterBId: "c_cp_johnny", votesA: 5200, votesB: 6800, title: "Nick Valentine vs Johnny Silverhand" },
  { characterAId: "c_sky_dragonborn", characterBId: "c_er_malenia", votesA: 4800, votesB: 7100, title: "Dragonborn vs Malenia" },
  { characterAId: "c_rz_rem", characterBId: "c_ft_erza", votesA: 5800, votesB: 6400, title: "Rem vs Erza" },
  { characterAId: "c_spy_anya", characterBId: "c_st_eleven", votesA: 5600, votesB: 6200, title: "Anya vs Eleven" },
  { characterAId: "c_bl_aizen", characterBId: "c_jojo_dio", votesA: 6100, votesB: 6400, title: "Aizen vs DIO" },
  { characterAId: "c_narn_aslan", characterBId: "c_lotr_gandalf", votesA: 5900, votesB: 6800, title: "Aslan vs Gandalf" },
  { characterAId: "c_tmnt_leo", characterBId: "c_tmnt_raph", votesA: 5600, votesB: 6200, title: "Leonardo vs Raphael" },
  { characterAId: "c_spawn_spawn", characterBId: "c_wm_rorschach", votesA: 5400, votesB: 5200, title: "Spawn vs Rorschach" },
  { characterAId: "c_da_solas", characterBId: "c_sob_darkling", votesA: 5100, votesB: 5600, title: "Solas vs The Darkling" },
  // Iconic single-franchise matchups
  { characterAId: "c_db_gohan", characterBId: "c_db_vegeta", votesA: 4200, votesB: 6900, title: "Gohan vs Vegeta" },
  { characterAId: "c_op_sanji", characterBId: "c_op_zoro", votesA: 5800, votesB: 6200, title: "Sanji vs Zoro" },
  { characterAId: "c_hxh_kurapika", characterBId: "c_hxh_hisoka", votesA: 4800, votesB: 5600, title: "Kurapika vs Hisoka" },
  { characterAId: "c_ds_zenitsu", characterBId: "c_ds_inosuke", votesA: 5200, votesB: 5800, title: "Zenitsu vs Inosuke" },
  { characterAId: "c_mha_todoroki", characterBId: "c_mha_bakugo", votesA: 6400, votesB: 5800, title: "Todoroki vs Bakugo" },
  { characterAId: "c_opm_tatsumaki", characterBId: "c_opm_garou", votesA: 5900, votesB: 5400, title: "Tatsumaki vs Garou" },
  { characterAId: "c_vs_thorfinn", characterBId: "c_vs_askeladd", votesA: 5100, votesB: 6800, title: "Thorfinn vs Askeladd" },
  { characterAId: "c_blue_isagi", characterBId: "c_blue_rin", votesA: 4900, votesB: 5600, title: "Isagi vs Rin" },
  { characterAId: "c_hq_hinata", characterBId: "c_hq_kageyama", votesA: 5800, votesB: 6100, title: "Hinata vs Kageyama" },
  { characterAId: "c_sl_jinwoo", characterBId: "c_jjk_gojo", votesA: 6200, votesB: 7100, title: "Sung Jinwoo vs Gojo" },
  { characterAId: "c_dst_senku", characterBId: "c_sg_okabe", votesA: 5900, votesB: 5400, title: "Senku vs Okabe" },
  { characterAId: "c_re_jill", characterBId: "c_re_claire", votesA: 5700, votesB: 5200, title: "Jill Valentine vs Claire Redfield" },
  { characterAId: "c_lol_ahri", characterBId: "c_gi_nahida", votesA: 5400, votesB: 5800, title: "Ahri vs Nahida" },
  { characterAId: "c_hsr_blade", characterBId: "c_hsr_jingliu", votesA: 5600, votesB: 6100, title: "Blade vs Jingliu" },
  { characterAId: "c_bcs_kim", characterBId: "c_bcs_lalo", votesA: 5900, votesB: 6400, title: "Kim Wexler vs Lalo Salamanca" },
];
