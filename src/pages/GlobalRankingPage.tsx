import { useMemo } from "react";
import { Header } from "../components/Header";
import { Loader2, Trophy, TrendingUp, TrendingDown } from "lucide-react";
import { useGlobalRanking } from "../hooks/useFirestore";
import { useUniverses } from "../hooks/useFirestore";
import { useTranslation } from "../contexts/LanguageContext";
import type { Character } from "../lib/db";

function tierBadge(score: number) {
  if (score >= 15) return { label: "S", color: "bg-yellow-500 text-black" };
  if (score >= 9) return { label: "A", color: "bg-orange-500 text-black" };
  if (score >= 3) return { label: "B", color: "bg-blue-500 text-white" };
  if (score >= -3) return { label: "C", color: "bg-green-600 text-white" };
  return { label: "D", color: "bg-muted text-muted-foreground" };
}

export default function GlobalRankingPage() {
  const { t } = useTranslation();
  const { data: characters = [], isLoading } = useGlobalRanking();
  const { data: universes = [] } = useUniverses();

  const universeMap = useMemo(
    () => Object.fromEntries(universes.map(u => [u.id, u.name])),
    [universes]
  );

  const ranked = useMemo(() => {
    return [...characters]
      .map(c => ({
        ...c,
        score: (c.wins ?? 0) * 3 - (c.losses ?? 0),
      }))
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if ((b.wins ?? 0) !== (a.wins ?? 0)) return (b.wins ?? 0) - (a.wins ?? 0);
        return (b.totalDuels ?? 0) - (a.totalDuels ?? 0);
      });
  }, [characters]);

  return (
    <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <Trophy className="text-primary" size={28} />
          <h1 className="text-3xl font-black">{t("lbl_global_ranking")}</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : ranked.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-2xl">
            <Trophy size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-medium">{t("empty_ranking")}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {ranked.map((char, idx) => {
              const badge = tierBadge(char.score);
              const winRate = char.totalDuels
                ? Math.round(((char.wins ?? 0) / char.totalDuels) * 100)
                : 0;

              return (
                <div
                  key={char.id}
                  className={`flex items-center gap-4 p-4 rounded-2xl border bg-card transition-all hover:border-primary/40 ${idx < 3 ? "border-primary/30 bg-primary/5" : ""}`}
                >
                  {/* Rank */}
                  <div className="w-10 text-center shrink-0">
                    {idx === 0 ? (
                      <span className="text-2xl">🥇</span>
                    ) : idx === 1 ? (
                      <span className="text-2xl">🥈</span>
                    ) : idx === 2 ? (
                      <span className="text-2xl">🥉</span>
                    ) : (
                      <span className="text-lg font-black text-muted-foreground">#{idx + 1}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <img
                    src={char.image}
                    alt={char.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(char.name)}&background=7C3AED&color=fff&size=100&bold=true`;
                    }}
                    className="w-14 h-14 rounded-xl object-cover border-2 border-border shrink-0"
                  />

                  {/* Name + Universe */}
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-base truncate">{char.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {universeMap[char.seriesId] ?? "—"}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-0.5 text-xs text-green-500 font-semibold">
                        <TrendingUp size={12} /> {char.wins ?? 0}W
                      </span>
                      <span className="flex items-center gap-0.5 text-xs text-red-500 font-semibold">
                        <TrendingDown size={12} /> {char.losses ?? 0}L
                      </span>
                      <span className="text-xs text-muted-foreground">{winRate}% WR</span>
                    </div>
                  </div>

                  {/* Score badge */}
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <span className={`text-xs font-black px-2 py-0.5 rounded-full ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-lg font-black text-primary">{char.score > 0 ? `+${char.score}` : char.score}</span>
                    <span className="text-xs text-muted-foreground">{t("lbl_score")}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
