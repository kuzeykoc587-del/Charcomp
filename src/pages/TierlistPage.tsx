import { useMemo, useState } from "react";
import { Header } from "../components/Header";
import { Loader2, BarChart3 } from "lucide-react";
import { useCharacters, useUserTierVote, useVoteTier } from "../hooks/useFirestore";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "../contexts/LanguageContext";
import { useToast } from "../hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import type { Character, TierVote } from "../lib/db";
import { tierVotesDb } from "../lib/db";

const TIERS: TierVote["tier"][] = ["S", "A", "B", "C", "D"];
const TIER_COLORS: Record<TierVote["tier"], string> = {
  S: "bg-yellow-500/20 border-yellow-500 text-yellow-400",
  A: "bg-orange-500/20 border-orange-500 text-orange-400",
  B: "bg-blue-500/20 border-blue-500 text-blue-400",
  C: "bg-green-500/20 border-green-600 text-green-400",
  D: "bg-muted border-border text-muted-foreground",
};
const TIER_SCORE_COLORS: Record<TierVote["tier"], string> = {
  S: "text-yellow-400",
  A: "text-orange-400",
  B: "text-blue-400",
  C: "text-green-400",
  D: "text-muted-foreground",
};

function avgToTier(avg: number): TierVote["tier"] | null {
  if (avg >= 4.5) return "S";
  if (avg >= 3.5) return "A";
  if (avg >= 2.5) return "B";
  if (avg >= 1.5) return "C";
  if (avg >= 1.0) return "D";
  return null;
}

function CharacterTierCard({ char }: { char: Character }) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { data: myVote } = useUserTierVote(user?.id, char.id);
  const voteTier = useVoteTier();

  const communityTier = char.tierCount ? avgToTier(char.tierAverage ?? 0) : null;
  const voteCount = char.tierCount ?? 0;

  const handleVote = async (tier: TierVote["tier"]) => {
    if (!user) {
      toast({ title: "Login required", description: "Please log in to rate characters.", variant: "destructive" });
      return;
    }
    try {
      await voteTier.mutateAsync({ userId: user.id, characterId: char.id, tier });
      toast({ title: t("msg_tier_vote_saved") });
    } catch {
      toast({ title: "Error", description: "Could not save your rating.", variant: "destructive" });
    }
  };

  return (
    <div className="border rounded-2xl bg-card p-4 space-y-3">
      <div className="flex items-center gap-3">
        <img
          src={char.image}
          alt={char.name}
          onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(char.name)}&background=7C3AED&color=fff&size=100&bold=true`; }}
          className="w-14 h-14 rounded-xl object-cover border"
        />
        <div className="flex-1 min-w-0">
          <p className="font-black text-sm truncate">{char.name}</p>
          <div className="flex items-center gap-2 mt-1">
            {communityTier ? (
              <span className={`text-xs font-black px-2 py-0.5 rounded-full border ${TIER_COLORS[communityTier]}`}>
                {communityTier}
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">{t("lbl_unranked")}</span>
            )}
            {voteCount > 0 && (
              <span className="text-xs text-muted-foreground">{voteCount} votes · avg {(char.tierAverage ?? 0).toFixed(1)}</span>
            )}
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-2">{t("lbl_rate_character")}:</p>
        <div className="flex gap-1">
          {TIERS.map((tier) => (
            <button
              key={tier}
              onClick={() => handleVote(tier)}
              className={`flex-1 py-1.5 rounded-lg text-sm font-black border transition-all ${
                myVote?.tier === tier
                  ? TIER_COLORS[tier] + " ring-2 ring-offset-1 ring-offset-background"
                  : "border-border bg-muted/30 text-muted-foreground hover:border-primary/40"
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
        {myVote && (
          <p className="text-xs text-muted-foreground mt-1 text-center">
            Your rating: <span className={`font-bold ${TIER_SCORE_COLORS[myVote.tier]}`}>{myVote.tier}</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default function TierlistPage() {
  const { t } = useTranslation();
  const { data: characters = [], isLoading } = useCharacters();
  const [selectedTier, setSelectedTier] = useState<TierVote["tier"] | "all">("all");

  const grouped = useMemo(() => {
    const tiers: Record<TierVote["tier"], Character[]> = { S: [], A: [], B: [], C: [], D: [] };
    const unranked: Character[] = [];

    for (const char of characters) {
      if (!char.tierCount || char.tierCount === 0) {
        unranked.push(char);
      } else {
        const tier = avgToTier(char.tierAverage ?? 0);
        if (tier) tiers[tier].push(char);
        else unranked.push(char);
      }
    }

    for (const tier of TIERS) {
      tiers[tier].sort((a, b) => (b.tierAverage ?? 0) - (a.tierAverage ?? 0));
    }

    return { tiers, unranked };
  }, [characters]);

  const allCharsForVoting = useMemo(() => {
    if (selectedTier === "all") return characters;
    if (selectedTier) {
      return characters.filter(c => avgToTier(c.tierAverage ?? 0) === selectedTier || (!c.tierCount));
    }
    return characters;
  }, [characters, selectedTier]);

  return (
    <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="text-primary" size={28} />
          <h1 className="text-3xl font-black">{t("lbl_community_tierlist")}</h1>
        </div>

        {/* Community Tier Board */}
        <div className="mb-8 border rounded-2xl overflow-hidden bg-card">
          <div className="p-4 border-b">
            <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Community Results</h2>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={28} /></div>
          ) : (
            <div>
              {TIERS.map((tier) => (
                <div key={tier} className={`flex items-start gap-4 border-b last:border-0 p-3 ${TIER_COLORS[tier].split(" ")[0]}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black border-2 shrink-0 ${TIER_COLORS[tier]}`}>
                    {tier}
                  </div>
                  <div className="flex flex-wrap gap-2 flex-1 min-h-[48px] items-center">
                    {grouped.tiers[tier].length === 0 ? (
                      <span className="text-xs text-muted-foreground italic">No characters yet</span>
                    ) : (
                      grouped.tiers[tier].map(char => (
                        <div key={char.id} className="flex items-center gap-1.5 bg-background/60 rounded-lg px-2 py-1 border">
                          <img
                            src={char.image}
                            alt={char.name}
                            onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(char.name)}&background=7C3AED&color=fff&size=40&bold=true`; }}
                            className="w-6 h-6 rounded object-cover"
                          />
                          <span className="text-xs font-semibold">{char.name}</span>
                          <span className="text-xs text-muted-foreground">({(char.tierAverage ?? 0).toFixed(1)})</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
              <div className="flex items-start gap-4 p-3 bg-muted/20">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xs font-black border-2 border-border text-muted-foreground shrink-0">
                  ?
                </div>
                <div className="flex flex-wrap gap-2 flex-1 min-h-[48px] items-center">
                  {grouped.unranked.length === 0 ? (
                    <span className="text-xs text-muted-foreground italic">All characters rated!</span>
                  ) : (
                    grouped.unranked.map(char => (
                      <div key={char.id} className="flex items-center gap-1.5 bg-background/60 rounded-lg px-2 py-1 border opacity-60">
                        <img
                          src={char.image}
                          alt={char.name}
                          onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(char.name)}&background=7C3AED&color=fff&size=40&bold=true`; }}
                          className="w-6 h-6 rounded object-cover"
                        />
                        <span className="text-xs font-semibold">{char.name}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rate Characters */}
        <div>
          <h2 className="text-xl font-black mb-4">Rate Characters</h2>
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={28} /></div>
          ) : characters.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-2xl">{t("empty_tierlist")}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {characters.map(char => (
                <CharacterTierCard key={char.id} char={char} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
