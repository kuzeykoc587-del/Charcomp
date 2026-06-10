import { Trophy } from "lucide-react";
import { useTranslation } from "../contexts/LanguageContext";
import type { Character } from "../lib/db";

interface ResultSummaryProps {
  champion: Character;
  runnerUp?: Character;
}

export function ResultSummary({ champion, runnerUp }: ResultSummaryProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center text-center space-y-6 w-full max-w-2xl mx-auto py-8">
      <div className="relative">
        <div className="absolute -inset-4 bg-yellow-500/30 rounded-full blur-2xl animate-pulse" />
        <img
          src={champion.image}
          alt={champion.name}
          onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(champion.name)}&background=7C3AED&color=fff&size=400&bold=true`; }}
          className="relative w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-4 border-yellow-500 shadow-2xl z-10"
        />
        <div className="absolute -top-6 -right-6 md:-top-8 md:-right-8 rotate-12 z-20">
          <Trophy className="w-16 h-16 md:w-24 md:h-24 text-yellow-500 drop-shadow-lg" />
        </div>
      </div>

      <div>
        <h2 className="text-xl md:text-2xl text-primary font-bold tracking-widest uppercase mb-2">{t("lbl_champion")}</h2>
        <h1 className="text-4xl md:text-6xl font-black drop-shadow-sm">{champion.name}</h1>
      </div>

      {runnerUp && (
        <div className="mt-8 p-4 bg-muted/50 rounded-2xl flex items-center gap-4 border w-full max-w-sm justify-center">
          <div className="text-right">
            <div className="text-xs text-muted-foreground uppercase font-bold">{t("lbl_runner_up")}</div>
            <div className="font-bold text-lg">{runnerUp.name}</div>
          </div>
          <img
            src={runnerUp.image}
            alt={runnerUp.name}
            onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(runnerUp.name)}&background=7C3AED&color=fff&size=400&bold=true`; }}
            className="w-16 h-16 rounded-full object-cover border-2 border-muted-foreground"
          />
        </div>
      )}
    </div>
  );
}
