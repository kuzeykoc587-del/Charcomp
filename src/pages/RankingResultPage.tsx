import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { Header } from "../components/Header";
import { ResultSummary } from "../components/ResultSummary";
import { Button } from "../components/ui/button";
import { useTranslation } from "../contexts/LanguageContext";
import { ArrowLeft, RotateCcw, Trophy, Loader2 } from "lucide-react";
import { sessionsDb, charactersDb } from "../lib/db";
import type { Character } from "../lib/db";

export default function RankingResultPage() {
  const { testId, sessionId } = useParams();
  const { t } = useTranslation();

  const [session, setSession] = useState<any>(null);
  const [charMap, setCharMap] = useState<Record<string, Character>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = sessionsDb.getRanking(sessionId || "");
    if (!s) { setLoading(false); return; }
    setSession(s);

    const allIds = s.results?.map((r: any) => r.characterId) ?? [];
    charactersDb.getManyByIds(allIds).then((chars) => {
      const map: Record<string, Character> = {};
      chars.forEach((c) => (map[c.id] = c));
      setCharMap(map);
      setLoading(false);
    });
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!session?.results) return null;

  const topResult = session.results[0];
  const champion = charMap[topResult?.characterId];

  if (!champion) return null;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-muted/10 pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-4 mt-8 space-y-16">
        <ResultSummary champion={champion} />

        <div className="flex flex-wrap justify-center gap-4">
          <Link href={`/play/${testId}/ranking`}>
            <Button size="lg" className="gap-2"><RotateCcw size={18} /> {t("btn_play_again")}</Button>
          </Link>
          <Link href={`/play/${testId}/tournament`}>
            <Button size="lg" variant="outline" className="gap-2"><Trophy size={18} /> {t("btn_try_tournament")}</Button>
          </Link>
          <Link href={`/test/${testId}`}>
            <Button size="lg" variant="ghost" className="gap-2"><ArrowLeft size={18} /> {t("btn_back_to_test")}</Button>
          </Link>
        </div>

        <div className="border-t pt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-8">{t("lbl_final_rankings")}</h2>
          <div className="space-y-3">
            {session.results.map((result: any, idx: number) => {
              const char = charMap[result.characterId];
              if (!char) return null;
              return (
                <div key={char.id} className={`flex items-center gap-4 p-4 rounded-xl border ${idx === 0 ? "bg-yellow-500/10 border-yellow-500/50" : "bg-card"}`}>
                  <div className={`font-black text-2xl w-8 text-center ${idx === 0 ? "text-yellow-500" : idx === 1 ? "text-gray-400" : idx === 2 ? "text-amber-600" : "text-muted-foreground"}`}>
                    #{result.rank}
                  </div>
                  <img src={char.image} alt={char.name} className="w-12 h-12 rounded-full object-cover border"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(char.name)}&background=7C3AED&color=fff&size=400&bold=true`; }}
                  />
                  <div className="flex-1 font-bold text-lg">{char.name}</div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-primary">{Math.round(result.winRate * 100)}%</div>
                    <div className="text-xs text-muted-foreground">{result.wins}W {result.losses}L</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
