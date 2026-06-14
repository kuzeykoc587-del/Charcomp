import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Header } from "../components/Header";
import { useTranslation } from "../contexts/LanguageContext";
import { useThisOrThat } from "../hooks/useFirestore";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Loader2, ArrowLeft, Shuffle } from "lucide-react";
import { thisOrThatDb, totVoteTracker } from "../lib/db";
import { useToast } from "../hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import type { ThisOrThat } from "../lib/db";

function VoteResult({ poll }: { poll: ThisOrThat }) {
  const { t } = useTranslation();
  const total = poll.votesA + poll.votesB;
  const pctA = total > 0 ? Math.round((poll.votesA / total) * 100) : 50;
  const pctB = 100 - pctA;

  return (
    <div className="space-y-4">
      <p className="text-center text-sm text-muted-foreground font-medium">{t("lbl_vote_results")}</p>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm font-bold mb-1">
            <span className="text-blue-400">{poll.optionA}</span>
            <span className="text-blue-400">{pctA}%</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{ width: `${pctA}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{poll.votesA.toLocaleString()} {t("lbl_votes")}</p>
        </div>
        <div>
          <div className="flex justify-between text-sm font-bold mb-1">
            <span className="text-rose-400">{poll.optionB}</span>
            <span className="text-rose-400">{pctB}%</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-rose-500 rounded-full transition-all duration-700" style={{ width: `${pctB}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{poll.votesB.toLocaleString()} {t("lbl_votes")}</p>
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground">{(total).toLocaleString()} total votes</p>
    </div>
  );
}

export default function ThisOrThatDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const { data: poll, isLoading } = useThisOrThat(id);
  const [voted, setVoted] = useState(false);
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    if (id) setVoted(totVoteTracker.hasVoted(id));
  }, [id]);

  const handleVote = async (side: "A" | "B") => {
    if (!id || voted || voting) return;
    setVoting(true);
    try {
      await thisOrThatDb.vote(id, side);
      totVoteTracker.markVoted(id);
      setVoted(true);
      qc.invalidateQueries({ queryKey: ["this-or-that-item", id] });
      qc.invalidateQueries({ queryKey: ["this-or-that"] });
      toast({ title: t("msg_vote_cast") });
    } catch {
      toast({ title: "Error", description: "Could not cast vote.", variant: "destructive" });
    } finally {
      setVoting(false);
    }
  };

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
          <p className="text-muted-foreground">Poll not found.</p>
          <Button variant="outline" onClick={() => setLocation("/this-or-that")}>
            <ArrowLeft size={16} className="mr-2" /> Back
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-lg">
        <button
          onClick={() => setLocation("/this-or-that")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="bg-card border rounded-2xl p-6 space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Shuffle size={18} className="text-sky-400" />
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                {t("lbl_this_or_that")}
              </span>
            </div>
            {poll.title && (
              <h1 className="text-xl font-black leading-tight">{poll.title}</h1>
            )}
            {poll.description && (
              <p className="text-sm text-muted-foreground mt-2">{poll.description}</p>
            )}
          </div>

          {voted ? (
            <VoteResult poll={poll} />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleVote("A")}
                disabled={voting}
                className="relative group rounded-2xl border-2 border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 hover:border-blue-500/60 transition-all p-4 text-center active:scale-95"
              >
                {voting && <Loader2 size={16} className="absolute top-2 right-2 animate-spin text-blue-400" />}
                {poll.imageA && (
                  <img src={poll.imageA} alt="" className="w-full h-28 object-cover rounded-xl mb-3" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                )}
                <p className="font-black text-base leading-snug text-blue-300">{poll.optionA}</p>
              </button>
              <button
                onClick={() => handleVote("B")}
                disabled={voting}
                className="relative group rounded-2xl border-2 border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 hover:border-rose-500/60 transition-all p-4 text-center active:scale-95"
              >
                {voting && <Loader2 size={16} className="absolute top-2 right-2 animate-spin text-rose-400" />}
                {poll.imageB && (
                  <img src={poll.imageB} alt="" className="w-full h-28 object-cover rounded-xl mb-3" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                )}
                <p className="font-black text-base leading-snug text-rose-300">{poll.optionB}</p>
              </button>
            </div>
          )}

          {!voted && (
            <p className="text-center text-xs text-muted-foreground">
              Tap an option to vote and see results
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
