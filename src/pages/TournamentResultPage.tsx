import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { Header } from "../components/Header";
import { ResultSummary } from "../components/ResultSummary";
import { TournamentBracket } from "../components/TournamentBracket";
import { Button } from "../components/ui/button";
import { useTranslation } from "../contexts/LanguageContext";
import { ArrowLeft, RotateCcw, ListOrdered, Loader2 } from "lucide-react";
import { sessionsDb, charactersDb } from "../lib/db";
import type { Character } from "../lib/db";

export default function TournamentResultPage() {
  const { testId, sessionId } = useParams();
  const { t } = useTranslation();

  const [session, setSession] = useState<any>(null);
  const [champion, setChampion] = useState<Character | null>(null);
  const [runnerUp, setRunnerUp] = useState<Character | null>(null);
  const [charMap, setCharMap] = useState<Record<string, Character>>({});

  useEffect(() => {
    const s = sessionsDb.getTournament(sessionId || "");
    if (!s) return;
    setSession(s);

    const allIds = Array.from(new Set(
      s.rounds.flatMap((r: any) => r.matches.flatMap((m: any) => [m.characterAId, m.characterBId]))
    )) as string[];

    charactersDb.getManyByIds(allIds).then((chars) => {
      const map: Record<string, Character> = {};
      chars.forEach((c) => (map[c.id] = c));
      setCharMap(map);
      if (s.champion) setChampion(map[s.champion] ?? null);
      const finalRound = s.rounds[s.rounds.length - 1];
      const finalMatch = finalRound?.matches[0];
      if (finalMatch) {
        const runnerUpId = finalMatch.characterAId === s.champion ? finalMatch.characterBId : finalMatch.characterAId;
        setRunnerUp(map[runnerUpId] ?? null);
      }
    });
  }, [sessionId]);

  if (!session || !champion) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-muted/10 pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-4 mt-8 space-y-16">
        <ResultSummary champion={champion} runnerUp={runnerUp ?? undefined} />

        <div className="flex flex-wrap justify-center gap-4">
          <Link href={`/play/${testId}/tournament`}>
            <Button size="lg" className="gap-2"><RotateCcw size={18} /> {t("btn_play_again")}</Button>
          </Link>
          <Link href={`/play/${testId}/ranking`}>
            <Button size="lg" variant="outline" className="gap-2"><ListOrdered size={18} /> {t("btn_try_ranking")}</Button>
          </Link>
          <Link href={`/test/${testId}`}>
            <Button size="lg" variant="ghost" className="gap-2"><ArrowLeft size={18} /> {t("btn_back_to_test")}</Button>
          </Link>
        </div>

        <div className="border-t pt-16">
          <h2 className="text-3xl font-black text-center mb-12">{t("mode_tournament")}</h2>
          <TournamentBracket rounds={session.rounds} championId={champion.id} charMap={charMap} />
        </div>
      </main>
    </div>
  );
}
