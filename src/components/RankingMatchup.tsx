import type { Character } from "../lib/db";
import { CharacterCard } from "./CharacterCard";

interface RankingMatchupProps {
  characterA: Character;
  characterB: Character;
  onSelect: (winnerId: string) => void;
  progressText: string;
}

export function RankingMatchup({ characterA, characterB, onSelect, progressText }: RankingMatchupProps) {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      <div className="mb-8 px-4 py-2 bg-muted rounded-full font-mono text-sm tracking-widest text-muted-foreground border">
        {progressText}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        <CharacterCard character={characterA} onClick={() => onSelect(characterA.id)} />
        <CharacterCard character={characterB} onClick={() => onSelect(characterB.id)} />
      </div>
    </div>
  );
}
