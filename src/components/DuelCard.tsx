import { useState, useEffect, useRef } from "react";
import { duelsDb, duelVoteTracker } from "../lib/db";
import type { Duel, Character } from "../lib/db";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface DuelCardProps {
  duel: Duel;
  charA: Character;
  charB: Character;
  onNext: () => void;
}

// Store which side was voted per duel
const VOTED_SIDE_KEY = "charcomp_voted_sides";
const getVotedSide = (id: string): "A" | "B" | null => {
  try {
    const map = JSON.parse(localStorage.getItem(VOTED_SIDE_KEY) || "{}");
    return map[id] ?? null;
  } catch { return null; }
};
const markVotedSide = (id: string, side: "A" | "B") => {
  try {
    const map = JSON.parse(localStorage.getItem(VOTED_SIDE_KEY) || "{}");
    map[id] = side;
    localStorage.setItem(VOTED_SIDE_KEY, JSON.stringify(map));
  } catch { /* ignore */ }
};

export function DuelCard({ duel, charA, charB, onNext }: DuelCardProps) {
  const { user } = useAuth();
  const alreadyVoted = duelVoteTracker.hasVoted(duel.id);
  const alreadyVotedSide = getVotedSide(duel.id);

  const [votedFor, setVotedFor] = useState<"A" | "B" | null>(alreadyVoted ? alreadyVotedSide : null);
  const [votesA, setVotesA] = useState(duel.votesA);
  const [votesB, setVotesB] = useState(duel.votesB);
  const [pending, setPending] = useState(false);
  const [showResults, setShowResults] = useState(alreadyVoted);
  const [cooldown, setCooldown] = useState(false);
  const nextTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cooldownRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Synchronous lock to prevent any race between re-renders
  const votingLock = useRef(false);

  useEffect(() => {
    const voted = duelVoteTracker.hasVoted(duel.id);
    const side = getVotedSide(duel.id);
    setVotedFor(voted ? side : null);
    setShowResults(voted);
    setVotesA(duel.votesA);
    setVotesB(duel.votesB);
    setPending(false);
    setCooldown(false);
    votingLock.current = false;
    if (nextTimerRef.current) clearTimeout(nextTimerRef.current);
    if (cooldownRef.current) clearTimeout(cooldownRef.current);
  }, [duel.id, duel.votesA, duel.votesB]);

  const totalVotes = votesA + votesB;
  const pctA = totalVotes > 0 ? Math.round((votesA / totalVotes) * 100) : 50;
  const pctB = 100 - pctA;

  const handleVote = async (choice: "A" | "B") => {
    // Hard guard — synchronous lock prevents any race or double-tap
    if (votingLock.current || votedFor !== null || pending || showResults || cooldown) return;
    votingLock.current = true;

    if (duelVoteTracker.hasVoted(duel.id)) {
      const side = getVotedSide(duel.id);
      toast.info("You already voted on this duel.");
      setVotedFor(side);
      setShowResults(true);
      votingLock.current = false;
      return;
    }

    const prevVotesA = votesA;
    const prevVotesB = votesB;

    // Apply cooldown immediately (prevents spam even if state hasn't updated)
    setCooldown(true);
    setPending(true);
    setVotedFor(choice);
    setShowResults(true);
    if (choice === "A") setVotesA((v) => v + 1);
    else setVotesB((v) => v + 1);

    try {
      await duelsDb.vote(duel.id, choice, user?.id);
      duelVoteTracker.markVoted(duel.id);
      markVotedSide(duel.id, choice);
      nextTimerRef.current = setTimeout(() => onNext(), 2000);
    } catch {
      setVotedFor(null);
      setShowResults(false);
      setVotesA(prevVotesA);
      setVotesB(prevVotesB);
      votingLock.current = false;
      toast.error("Vote could not be saved. Please try again.");
    } finally {
      setPending(false);
      // Cooldown lasts 1.5s even on error to prevent rapid spam
      cooldownRef.current = setTimeout(() => {
        setCooldown(false);
        votingLock.current = false;
      }, 1500);
    }
  };

  const clickable = !votedFor && !pending && !showResults && !cooldown;
  const winnerA = votesA >= votesB;

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl overflow-hidden border border-border shadow-2xl relative bg-card">
      <div className="flex flex-col md:flex-row h-[70vh] min-h-[500px]">

        {/* Character A */}
        <div
          className={`flex-1 relative group transition-all duration-500 overflow-hidden select-none
            ${clickable ? "cursor-pointer" : "cursor-default"}
            ${showResults && !winnerA ? "opacity-60" : ""}
            ${showResults && winnerA ? "md:flex-[1.2]" : ""}`}
          onClick={() => clickable && handleVote("A")}
        >
          <img
            src={charA.image}
            alt={charA.name}
            onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(charA.name)}&background=7C3AED&color=fff&size=400&bold=true`; }}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* Loading overlay for A */}
          {pending && votedFor === "A" && (
            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
              <Loader2 size={32} className="text-white animate-spin" />
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h2 className="text-3xl md:text-5xl font-black text-white drop-shadow-md mb-2">{charA.name}</h2>
            {showResults && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mt-4">
                <div className="flex justify-between text-white/90 font-mono mb-2">
                  <span className="text-xl font-black">{pctA}%</span>
                  <span className="text-sm opacity-70">{votesA.toLocaleString()} votes</span>
                </div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden w-full backdrop-blur-md">
                  <div className="h-full bg-primary transition-all duration-1000 ease-out" style={{ width: `${pctA}%` }} />
                </div>
                {votedFor === "A" && (
                  <p className="text-xs text-primary font-bold mt-1.5">✓ Your vote</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* VS Badge */}
        {!showResults && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 bg-background rounded-full flex items-center justify-center font-black italic text-2xl border-4 border-primary shadow-2xl pointer-events-none">
            {cooldown ? <Loader2 size={20} className="animate-spin text-primary" /> : "VS"}
          </div>
        )}

        {/* Character B */}
        <div
          className={`flex-1 relative group transition-all duration-500 overflow-hidden select-none
            ${clickable ? "cursor-pointer" : "cursor-default"}
            ${showResults && winnerA ? "opacity-60" : ""}
            ${showResults && !winnerA ? "md:flex-[1.2]" : ""}`}
          onClick={() => clickable && handleVote("B")}
        >
          <img
            src={charB.image}
            alt={charB.name}
            onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(charB.name)}&background=7C3AED&color=fff&size=400&bold=true`; }}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* Loading overlay for B */}
          {pending && votedFor === "B" && (
            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
              <Loader2 size={32} className="text-white animate-spin" />
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-8 md:text-right">
            <h2 className="text-3xl md:text-5xl font-black text-white drop-shadow-md mb-2">{charB.name}</h2>
            {showResults && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mt-4">
                <div className="flex justify-between md:justify-end text-white/90 font-mono mb-2">
                  <span className="text-sm opacity-70 md:order-2">{votesB.toLocaleString()} votes</span>
                  <span className="text-xl font-black">{pctB}%</span>
                </div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden w-full backdrop-blur-md flex justify-end">
                  <div className="h-full bg-secondary transition-all duration-1000 ease-out" style={{ width: `${pctB}%` }} />
                </div>
                {votedFor === "B" && (
                  <p className="text-xs text-secondary font-bold mt-1.5">✓ Your vote</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showResults && (
        <div className="absolute top-4 right-4 z-20 animate-in fade-in duration-500">
          <div className="bg-background/80 backdrop-blur-md px-4 py-2 rounded-full text-sm font-mono border">
            {(votesA + votesB).toLocaleString()} total votes
          </div>
        </div>
      )}

      {alreadyVoted && !pending && (
        <div className="absolute top-4 left-4 z-20">
          <div className="bg-muted/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border text-muted-foreground">
            Already voted {alreadyVotedSide ? `· ${alreadyVotedSide === "A" ? charA.name : charB.name}` : ""}
          </div>
        </div>
      )}

      {cooldown && !pending && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-background/80 backdrop-blur-md px-4 py-2 rounded-full text-xs font-medium border flex items-center gap-2">
            <Loader2 size={12} className="animate-spin" /> Saving vote...
          </div>
        </div>
      )}
    </div>
  );
}
