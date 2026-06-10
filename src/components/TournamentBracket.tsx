interface Match {
  characterAId: string;
  characterBId: string;
  winnerId?: string;
}

interface Round {
  name: string;
  matches: Match[];
}

interface TournamentBracketProps {
  rounds: Round[];
  championId?: string;
  charMap?: Record<string, { id: string; name: string; image: string }>;
}

export function TournamentBracket({ rounds, championId, charMap = {} }: TournamentBracketProps) {
  const getChar = (id: string) => charMap[id] ?? { id, name: id.slice(0, 8), image: `https://ui-avatars.com/api/?name=${id.slice(0, 2)}&background=7C3AED&color=fff&size=400&bold=true` };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      {rounds.map((round, rIndex) => (
        <div key={rIndex} className="bg-card p-4 rounded-xl border">
          <h3 className="font-bold text-lg mb-4 text-center text-primary">{round.name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {round.matches.map((match, mIndex) => {
              const charA = getChar(match.characterAId);
              const charB = getChar(match.characterBId);
              const isAWinner = match.winnerId === charA.id;
              const isBWinner = match.winnerId === charB.id;

              return (
                <div key={mIndex} className="flex flex-col border rounded-lg overflow-hidden">
                  <div className={`p-2 flex items-center gap-3 ${isAWinner ? "bg-primary/20 font-bold" : ""}`}>
                    <img
                      src={charA.image}
                      alt={charA.name}
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(charA.name)}&background=7C3AED&color=fff&size=400&bold=true`; }}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className={championId === charA.id ? "text-yellow-500 drop-shadow-sm" : ""}>{charA.name}</span>
                  </div>
                  <div className="h-px bg-border w-full" />
                  <div className={`p-2 flex items-center gap-3 ${isBWinner ? "bg-primary/20 font-bold" : ""}`}>
                    <img
                      src={charB.image}
                      alt={charB.name}
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(charB.name)}&background=7C3AED&color=fff&size=400&bold=true`; }}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className={championId === charB.id ? "text-yellow-500 drop-shadow-sm" : ""}>{charB.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
