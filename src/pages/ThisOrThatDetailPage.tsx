import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Header } from "../components/Header";
import { useThisOrThat } from "../hooks/useFirestore";
import { Button } from "../components/ui/button";
import { Loader2, ArrowLeft, Shuffle, Trophy, RotateCcw } from "lucide-react";
import { thisOrThatDb } from "../lib/db";
import type { ThisOrThat, TotOption } from "../lib/db";
import { useQueryClient } from "@tanstack/react-query";

function LegacyVoteView({ poll }: { poll: ThisOrThat }) {
  const [voted, setVoted] = useState(false);
  const [voting, setVoting] = useState(false);
  const qc = useQueryClient();

  const total = (poll.votesA ?? 0) + (poll.votesB ?? 0);
  const pctA = total > 0 ? Math.round(((poll.votesA ?? 0) / total) * 100) : 50;
  const pctB = 100 - pctA;

  const handleVote = async (side: "A" | "B") => {
    if (voted || voting) return;
    setVoting(true);
    try {
      await thisOrThatDb.vote(poll.id, side);
      setVoted(true);
      qc.invalidateQueries({ queryKey: ["this-or-that-item", poll.id] });
    } catch { /* silent */ } finally { setVoting(false); }
  };

  if (voted) {
    return (
      <div className="space-y-4">
        <p className="text-center text-sm text-muted-foreground font-medium">Oy Sonuçları</p>
        {[
          { label: poll.optionA ?? "", pct: pctA, votes: poll.votesA ?? 0, color: "blue" },
          { label: poll.optionB ?? "", pct: pctB, votes: poll.votesB ?? 0, color: "rose" },
        ].map(({ label, pct, votes, color }) => (
          <div key={label}>
            <div className="flex justify-between text-sm font-bold mb-1">
              <span className={`text-${color}-400`}>{label}</span>
              <span className={`text-${color}-400`}>{pct}%</span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div className={`h-full bg-${color}-500 rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{votes.toLocaleString()} oy</p>
          </div>
        ))}
        <p className="text-center text-xs text-muted-foreground">{total.toLocaleString()} toplam oy</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {["A" as const, "B" as const].map(side => {
        const label = side === "A" ? poll.optionA : poll.optionB;
        const img = side === "A" ? poll.imageA : poll.imageB;
        const color = side === "A" ? "blue" : "rose";
        return (
          <button
            key={side}
            onClick={() => handleVote(side)}
            disabled={voting}
            className={`relative group rounded-2xl border-2 border-${color}-500/30 bg-${color}-500/10 hover:bg-${color}-500/20 hover:border-${color}-500/60 transition-all p-4 text-center active:scale-95`}
          >
            {voting && <Loader2 size={16} className={`absolute top-2 right-2 animate-spin text-${color}-400`} />}
            {img && (
              <img src={img} alt="" className="w-full h-28 object-cover rounded-xl mb-3"
                onError={e => { console.warn("[IMAGE] failed to load", img); (e.target as HTMLImageElement).style.display = "none"; }} />
            )}
            <p className={`font-black text-base leading-snug text-${color}-300`}>{label}</p>
          </button>
        );
      })}
    </div>
  );
}

type PlayState = "playing" | "finished";

function TournamentPlay({ poll }: { poll: ThisOrThat }) {
  const opts = poll.options ?? [];
  const [round, setRound] = useState(0);
  const [survivor, setSurvivor] = useState<TotOption>(opts[0]);
  const [playState, setPlayState] = useState<PlayState>("playing");
  const [choosing, setChoosing] = useState(false);
  const qc = useQueryClient();

  const totalRounds = opts.length - 1;
  const challenger = opts[round + 1];

  const handlePick = async (winner: TotOption) => {
    if (choosing || playState === "finished") return;
    setChoosing(true);

    const nextRound = round + 1;
    if (nextRound >= totalRounds) {
      setSurvivor(winner);
      setPlayState("finished");
      try {
        await thisOrThatDb.incrementPlayCount(poll.id);
        qc.invalidateQueries({ queryKey: ["this-or-that"] });
        qc.invalidateQueries({ queryKey: ["this-or-that-item", poll.id] });
      } catch { /* silent */ }
    } else {
      setSurvivor(winner);
      setRound(nextRound);
    }

    setChoosing(false);
  };

  const restart = () => {
    setRound(0);
    setSurvivor(opts[0]);
    setPlayState("playing");
  };

  if (playState === "finished") {
    return (
      <div className="text-center space-y-6">
        <div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy size={24} className="text-yellow-400" />
            <h2 className="text-xl font-black">Kazanan!</h2>
          </div>
          <p className="text-sm text-muted-foreground">{totalRounds} karşılaştırma sonrası</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-6">
          {survivor.imageUrl && (
            <img
              src={survivor.imageUrl}
              alt={survivor.text}
              className="w-full max-h-48 object-cover rounded-xl mb-4"
              onError={e => { console.warn("[IMAGE] failed to load", survivor.imageUrl); (e.target as HTMLImageElement).style.display = "none"; }}
            />
          )}
          <p className="text-2xl font-black text-yellow-300">{survivor.text}</p>
          {survivor.description && (
            <p className="text-sm text-muted-foreground mt-2">{survivor.description}</p>
          )}
        </div>

        <Button onClick={restart} variant="outline" className="gap-2">
          <RotateCcw size={16} /> Tekrar Oyna
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Karşılaştırma</span>
          <span className="font-mono font-bold">{round + 1} / {totalRounds}</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((round + 1) / totalRounds) * 100}%` }}
          />
        </div>
      </div>

      {/* VS */}
      <div className="relative">
        <div className="grid grid-cols-2 gap-3">
          {[survivor, challenger].map((opt, i) => {
            const color = i === 0 ? "sky" : "violet";
            return (
              <button
                key={opt.id}
                onClick={() => handlePick(opt)}
                disabled={choosing}
                className={`relative group rounded-2xl border-2 border-${color}-500/30 bg-${color}-500/10 hover:bg-${color}-500/20 hover:border-${color}-500/60 transition-all p-4 text-center active:scale-95 min-h-[120px] flex flex-col items-center justify-center gap-3`}
              >
                {choosing && (
                  <Loader2 size={16} className={`absolute top-2 right-2 animate-spin text-${color}-400`} />
                )}
                {opt.imageUrl && (
                  <img
                    src={opt.imageUrl}
                    alt={opt.text}
                    className="w-full h-32 object-cover rounded-xl"
                    onError={e => { console.warn("[IMAGE] failed to load", opt.imageUrl); (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                )}
                <p className={`font-black text-base leading-snug text-${color}-300`}>{opt.text}</p>
                {opt.description && (
                  <p className="text-xs text-muted-foreground leading-snug">{opt.description}</p>
                )}
              </button>
            );
          })}
        </div>

        {/* VS badge */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <div className="w-8 h-8 rounded-full bg-background border-2 border-border flex items-center justify-center shadow">
            <span className="text-[9px] font-black text-muted-foreground">VS</span>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">Tercih ettiğin seçeneğe tıkla</p>
    </div>
  );
}

export default function ThisOrThatDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { data: poll, isLoading } = useThisOrThat(id);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={32} />
        </main>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 p-4">
          <p className="text-muted-foreground">Oyun bulunamadı.</p>
          <Button variant="outline" onClick={() => setLocation("/this-or-that")}>
            <ArrowLeft size={16} className="mr-2" /> Geri
          </Button>
        </main>
      </div>
    );
  }

  const isNewFormat = Array.isArray(poll.options) && poll.options.length >= 2;

  return (
    <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-lg">
        <button
          onClick={() => setLocation("/this-or-that")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Geri
        </button>

        <div className="bg-card border rounded-2xl p-6 space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Shuffle size={18} className="text-sky-400" />
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Bu mu O mu
              </span>
            </div>
            {poll.coverImage && (
              <img
                src={poll.coverImage}
                alt={poll.title}
                className="w-full max-h-40 object-cover rounded-xl mb-4"
                onError={e => { console.warn("[IMAGE] failed to load", poll.coverImage); (e.target as HTMLImageElement).style.display = "none"; }}
              />
            )}
            {poll.title && (
              <h1 className="text-xl font-black leading-tight">{poll.title}</h1>
            )}
            {poll.description && (
              <p className="text-sm text-muted-foreground mt-2">{poll.description}</p>
            )}
            {isNewFormat && (
              <p className="text-xs text-muted-foreground mt-1">
                {poll.options!.length} seçenek ·{" "}
                {(poll.playCount ?? 0) > 0 ? `${poll.playCount?.toLocaleString()} oynanma` : "Yeni"}
              </p>
            )}
          </div>

          {/* Play area */}
          {isNewFormat ? (
            <TournamentPlay key={poll.id} poll={poll} />
          ) : (
            <LegacyVoteView poll={poll} />
          )}
        </div>
      </main>
    </div>
  );
}
