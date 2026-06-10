import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { useTranslation } from "../contexts/LanguageContext";
import { testsDb, charactersDb, sessionsDb, recentlyPlayedDb } from "../lib/db";
import type { Test, Character } from "../lib/db";
import { Loader2 } from "lucide-react";

export default function TournamentPage() {
  const { testId } = useParams();
  const [, setLocation] = useLocation();
  const { t } = useTranslation();

  const [test, setTest] = useState<Test | null>(null);
  const [charMap, setCharMap] = useState<Record<string, Character>>({});
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    if (!testId || initialized.current) return;
    initialized.current = true;
    (async () => {
      const testData = await testsDb.getById(testId);
      if (!testData) { setLoading(false); return; }
      setTest(testData);

      recentlyPlayedDb.add(testId);
      testsDb.incrementPlayCount(testId).catch(() => {});

      const chars = await charactersDb.getManyByIds(testData.characterIds);
      const map: Record<string, Character> = {};
      chars.forEach((c) => (map[c.id] = c));
      setCharMap(map);

      const charIds = [...testData.characterIds].sort(() => Math.random() - 0.5);
      const matches: any[] = [];
      for (let i = 0; i < charIds.length; i += 2) {
        if (i + 1 < charIds.length) {
          matches.push({ characterAId: charIds[i], characterBId: charIds[i + 1] });
        } else {
          matches.push({ characterAId: charIds[i], characterBId: charIds[i], winnerId: charIds[i] });
        }
      }

      const initial = {
        id: `ts_${Date.now()}`,
        testId: testData.id,
        rounds: [{ name: t("round_1"), matches }],
        currentRoundIndex: 0,
        currentMatchIndex: 0,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setSession(initial);
      setLoading(false);
    })();
  }, [testId]);

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-black">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }
  if (!test || !session) return null;

  const currentRound = session.rounds[session.currentRoundIndex];
  const currentMatch = currentRound?.matches[session.currentMatchIndex];
  const charA = charMap[currentMatch?.characterAId];
  const charB = charMap[currentMatch?.characterBId];

  const handleSelect = (winnerId: string) => {
    const newSession = JSON.parse(JSON.stringify(session));
    const r = newSession.rounds[newSession.currentRoundIndex];
    r.matches[newSession.currentMatchIndex].winnerId = winnerId;

    let nextMatchIndex = newSession.currentMatchIndex + 1;
    while (nextMatchIndex < r.matches.length && r.matches[nextMatchIndex].winnerId) {
      nextMatchIndex++;
    }

    if (nextMatchIndex < r.matches.length) {
      newSession.currentMatchIndex = nextMatchIndex;
    } else {
      const winners = r.matches.map((m: any) => m.winnerId);
      if (winners.length === 1) {
        newSession.completed = true;
        newSession.champion = winners[0];
        sessionsDb.saveTournament(newSession);
        setLocation(`/result/${test.id}/tournament/${newSession.id}`);
        return;
      }
      const nextMatches: any[] = [];
      for (let i = 0; i < winners.length; i += 2) {
        if (i + 1 < winners.length) {
          nextMatches.push({ characterAId: winners[i], characterBId: winners[i + 1] });
        } else {
          nextMatches.push({ characterAId: winners[i], characterBId: winners[i], winnerId: winners[i] });
        }
      }
      let roundName = `Round ${newSession.currentRoundIndex + 2}`;
      if (nextMatches.length === 1) roundName = t("round_final");
      else if (nextMatches.length === 2) roundName = t("round_semi");
      else if (nextMatches.length === 4) roundName = t("round_quarter");

      newSession.rounds.push({ name: roundName, matches: nextMatches });
      newSession.currentRoundIndex++;
      newSession.currentMatchIndex = 0;
    }

    setSession(newSession);
    sessionsDb.saveTournament(newSession);
  };

  if (!charA || !charB) return null;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-black pb-20 md:pb-0">
      <div className="p-3 flex items-center justify-between text-white/70 border-b border-white/10 z-10 shrink-0">
        <span className="font-bold text-primary text-sm">{currentRound.name}</span>
        <span className="text-xs font-mono tracking-widest opacity-60">
          {test.title.length > 20 ? test.title.slice(0, 20) + "…" : test.title}
        </span>
        <span className="font-mono text-xs tracking-widest">
          {session.currentMatchIndex + 1}/{currentRound.matches.length}
        </span>
      </div>

      <div className="flex-1 flex flex-col md:flex-row relative min-h-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 bg-black rounded-full flex items-center justify-center font-black italic text-lg md:text-2xl border-4 border-primary shadow-2xl text-white pointer-events-none">
          VS
        </div>

        {[charA, charB].map((char, idx) => (
          <div
            key={char.id}
            className="relative cursor-pointer group flex-1 overflow-hidden"
            style={{ minHeight: "calc(50dvh - 2rem)" }}
            onClick={() => handleSelect(char.id)}
            data-testid={`btn-select-char${idx === 0 ? "A" : "B"}`}
          >
            <img
              src={char.image}
              alt={char.name}
              className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
              onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(char.name)}&background=7C3AED&color=fff&size=400&bold=true`; }}
            />
            <div className={`absolute inset-0 transition-colors ${idx === 0 ? "bg-gradient-to-t from-black/90 via-black/20 to-transparent group-hover:via-primary/10" : "bg-gradient-to-b from-black/90 via-black/20 to-transparent md:bg-gradient-to-t group-hover:via-secondary/10"}`} />
            <div className={`absolute inset-0 ${idx === 0 ? "bg-primary/0 group-hover:bg-primary/15" : "bg-secondary/0 group-hover:bg-secondary/15"} transition-colors`} />
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
              <h3 className="text-white font-black text-2xl md:text-4xl leading-tight drop-shadow-md">{char.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
