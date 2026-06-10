import { useState, useEffect, useRef } from "react";
import { duelsDb } from "../lib/db";
import type { Duel, Character } from "../lib/db";
import { toast } from "sonner";

interface DuelCardProps {
  duel: Duel;
  charA: Character;
  charB: Character;
  onNext: () => void;
}

export function DuelCard({ duel, charA, charB, onNext }: DuelCardProps) {
  const [votedFor, setVotedFor] = useState<"A" | "B" | null>(null);
  const [votesA, setVotesA] = useState(duel.votesA);
  const [votesB, setVotesB] = useState(duel.votesB);
  const [pending, setPending] = useState(false);
  const nextTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setVotedFor(null);
    setVotesA(duel.votesA);
    setVotesB(duel.votesB);
    setPending(false);
    if (nextTimerRef.current) clearTimeout(nextTimerRef.current);
  }, [duel.id, duel.votesA, duel.votesB]);

  const totalVotes = votesA + votesB;
  const pctA = totalVotes > 0 ? Math.round((votesA / totalVotes) * 100) : 50;
  const pctB = 100 - pctA;

  const handleVote = async (choice: "A" | "B") => {
    if (votedFor || pending) return;

    const prevVotesA = votesA;
    const prevVotesB = votesB;

    setPending(true);
    setVotedFor(choice);
    if (choice === "A") setVotesA((v) => v + 1);
    else setVotesB((v) => v + 1);

    try {
      await duelsDb.vote(duel.id, choice);
      nextTimerRef.current = setTimeout(() => onNext(), 2000);
    } catch {
      setVotedFor(null);
      setVotesA(prevVotesA);
      setVotesB(prevVotesB);
      toast.error("Vote could not be saved. Please try again.");
    } finally {
      setPending(false);
    }
  };

  const clickable = !votedFor && !pending;

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl overflow-hidden border border-border shadow-2xl relative bg-card">
      <div className="flex flex-col md:flex-row h-[70vh] min-h-[500px]">

        {/* Character A */}
        <div
          className={`flex-1 relative group transition-all duration-500 overflow-hidden
            ${clickable ? "cursor-pointer" : "cursor-default"}
            ${votedFor && votedFor !== "A" ? "grayscale opacity-50" : ""}
            ${votedFor === "A" ? "md:flex-[1.2]" : ""}`}
          onClick={() => clickable && handleVote("A")}
        >
          <img
            src={charA.image}
            alt={charA.name}
            onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(charA.name)}&background=7C3AED&color=fff&size=400&bold=true`; }}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h2 className="text-3xl md:text-5xl font-black text-white drop-shadow-md mb-2">{charA.name}</h2>
            {votedFor && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mt-4">
                <div className="flex justify-between text-white/90 font-mono mb-2"><span>{pctA}%</span></div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden w-full backdrop-blur-md">
                  <div className="h-full bg-primary transition-all duration-1000 ease-out" style={{ width: `${pctA}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* VS Badge */}
        {!votedFor && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 bg-background rounded-full flex items-center justify-center font-black italic text-2xl border-4 border-primary shadow-2xl pointer-events-none">
            VS
          </div>
        )}

        {/* Character B */}
        <div
          className={`flex-1 relative group transition-all duration-500 overflow-hidden
            ${clickable ? "cursor-pointer" : "cursor-default"}
            ${votedFor && votedFor !== "B" ? "grayscale opacity-50" : ""}
            ${votedFor === "B" ? "md:flex-[1.2]" : ""}`}
          onClick={() => clickable && handleVote("B")}
        >
          <img
            src={charB.image}
            alt={charB.name}
            onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(charB.name)}&background=7C3AED&color=fff&size=400&bold=true`; }}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:text-right">
            <h2 className="text-3xl md:text-5xl font-black text-white drop-shadow-md mb-2">{charB.name}</h2>
            {votedFor && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mt-4">
                <div className="flex justify-between md:justify-end text-white/90 font-mono mb-2"><span>{pctB}%</span></div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden w-full backdrop-blur-md flex justify-end">
                  <div className="h-full bg-secondary transition-all duration-1000 ease-out" style={{ width: `${pctB}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {votedFor && (
        <div className="absolute top-4 right-4 z-20 animate-in fade-in duration-500">
          <div className="bg-background/80 backdrop-blur-md px-4 py-2 rounded-full text-sm font-mono border">
            {(votesA + votesB).toLocaleString()} votes
          </div>
        </div>
      )}
    </div>
  );
}
