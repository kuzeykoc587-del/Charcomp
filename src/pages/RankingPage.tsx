import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { useTranslation } from "../contexts/LanguageContext";
import { testsDb, charactersDb, sessionsDb, recentlyPlayedDb } from "../lib/db";
import type { Test, Character } from "../lib/db";
import { Loader2 } from "lucide-react";

export default function RankingPage() {
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

      const charIds = [...testData.characterIds];
      const comparisons: any[] = [];

      if (charIds.length <= 16) {
        for (let i = 0; i < charIds.length; i++) {
          for (let j = i + 1; j < charIds.length; j++) {
            comparisons.push({ characterAId: charIds[i], characterBId: charIds[j] });
          }
        }
        comparisons.sort(() => Math.random() - 0.5);
      } else {
        const maxComparisons = 40;
        const seen = new Set<string>();
        let attempts = 0;
        while (comparisons.length < maxComparisons && attempts < 10000) {
          attempts++;
          const i = Math.floor(Math.random() * charIds.length);
          let j = Math.floor(Math.random() * charIds.length);
          while (j === i) j = Math.floor(Math.random() * charIds.length);
          const a = Math.min(i, j);
          const b = Math.max(i, j);
          const key = `${a}-${b}`;
          if (!seen.has(key)) {
            seen.add(key);
            comparisons.push({ characterAId: charIds[i], characterBId: charIds[j] });
          }
        }
      }

      const initial = {
        id: `rs_${Date.now()}`,
        testId: testData.id,
        comparisons,
        currentIndex: 0,
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

  const currentComparison = session.comparisons[session.currentIndex];
  const charA = charMap[currentComparison?.characterAId];
  const charB = charMap[currentComparison?.characterBId];

  const handleSelect = (winnerId: string) => {
    const newSession = JSON.parse(JSON.stringify(session));
    newSession.comparisons[newSession.currentIndex].winnerId = winnerId;

    if (newSession.currentIndex < newSession.comparisons.length - 1) {
      newSession.currentIndex++;
    } else {
      newSession.completed = true;
      const scores: Record<string, { wins: number; losses: number }> = {};
      test.characterIds.forEach((id) => (scores[id] = { wins: 0, losses: 0 }));

      newSession.comparisons.forEach((comp: any) => {
        if (!comp.winnerId) return;
        if (comp.winnerId === comp.characterAId) {
          scores[comp.characterAId].wins++;
          scores[comp.characterBId].losses++;
        } else {
          scores[comp.characterBId].wins++;
          scores[comp.characterAId].losses++;
        }
      });

      const results = Object.entries(scores)
        .map(([id, stats]) => ({
          characterId: id,
          wins: stats.wins,
          losses: stats.losses,
          winRate: stats.wins / (stats.wins + stats.losses || 1),
        }))
        .sort((a, b) => b.winRate - a.winRate);

      newSession.results = results.map((r, i) => ({ ...r, rank: i + 1 }));
      sessionsDb.saveRanking(newSession);
      setLocation(`/result/${test.id}/ranking/${newSession.id}`);
      return;
    }

    setSession(newSession);
    sessionsDb.saveRanking(newSession);
  };

  if (!charA || !charB) return null;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-black pb-20 md:pb-0">
      <div className="w-full bg-muted/30 h-1 z-30 shrink-0">
        <div className="bg-primary h-1 transition-all" style={{ width: `${(session.currentIndex / session.comparisons.length) * 100}%` }} />
      </div>

      <div className="p-3 flex items-center justify-between text-white/70 border-b border-white/10 z-10 shrink-0">
        <span className="font-bold text-primary text-sm">{t("mode_ranking")}</span>
        <span className="text-xs font-mono tracking-widest opacity-60">
          {test.title.length > 20 ? test.title.slice(0, 20) + "…" : test.title}
        </span>
        <span className="font-mono text-xs tracking-widest">
          {session.currentIndex + 1}/{session.comparisons.length}
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
