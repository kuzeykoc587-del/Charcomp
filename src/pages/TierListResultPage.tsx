import { useParams, useLocation } from "wouter";
import { Header } from "../components/Header";
import { useTranslation } from "../contexts/LanguageContext";
import { useTierList, useCharactersByIds, useUserTierListResult, useCommunityTierListResults } from "../hooks/useFirestore";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Loader2, ArrowLeft, Users, User } from "lucide-react";
import type { Character, TierList } from "../lib/db";
import { useMemo } from "react";

function CharChip({ char, highlight }: { char: Character; highlight?: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 rounded-lg px-2 py-1 border ${highlight ? "bg-primary/10 border-primary/30" : "bg-background/60"}`}>
      <img
        src={char.image}
        alt={char.name}
        className="w-6 h-6 rounded object-cover"
        onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(char.name)}&background=7C3AED&color=fff&size=40&bold=true`; }}
      />
      <span className="text-xs font-semibold">{char.name}</span>
    </div>
  );
}

function TierRow({
  tier,
  color,
  chars,
  diff,
}: {
  tier: string;
  color: string;
  chars: Character[];
  diff?: Set<string>;
}) {
  return (
    <div
      className="flex items-stretch rounded-xl border"
      style={{ borderColor: `${color}33`, backgroundColor: `${color}08` }}
    >
      <div
        className="flex items-center justify-center w-12 shrink-0 rounded-l-xl"
        style={{ backgroundColor: `${color}22` }}
      >
        <span className="font-black text-sm" style={{ color }}>{tier}</span>
      </div>
      <div className="flex flex-wrap gap-1.5 p-2 flex-1 min-h-[48px] items-center">
        {chars.length === 0 ? (
          <span className="text-xs text-muted-foreground italic">Empty</span>
        ) : (
          chars.map((c) => (
            <CharChip key={c.id} char={c} highlight={diff?.has(c.id)} />
          ))
        )}
      </div>
    </div>
  );
}

function computeCommunityPlacements(
  results: { placements: Record<string, string> }[],
  tiers: string[]
): Record<string, string> {
  const counts: Record<string, Record<string, number>> = {};
  for (const r of results) {
    for (const [charId, tier] of Object.entries(r.placements)) {
      if (!counts[charId]) counts[charId] = {};
      counts[charId][tier] = (counts[charId][tier] ?? 0) + 1;
    }
  }
  const result: Record<string, string> = {};
  for (const [charId, tierCounts] of Object.entries(counts)) {
    let best = tiers[tiers.length - 1];
    let bestCount = 0;
    for (const [tier, count] of Object.entries(tierCounts)) {
      const idx = tiers.indexOf(tier);
      if (count > bestCount || (count === bestCount && idx < tiers.indexOf(best))) {
        best = tier;
        bestCount = count;
      }
    }
    result[charId] = best;
  }
  return result;
}

export default function TierListResultPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: tierList, isLoading: loadingTl } = useTierList(id);
  const { data: characters = [], isLoading: loadingChars } = useCharactersByIds(
    tierList?.characterIds ?? []
  );
  const { data: myResult, isLoading: loadingMine } = useUserTierListResult(id, user?.id);
  const { data: communityResults = [], isLoading: loadingCommunity } = useCommunityTierListResults(id);

  const charMap = Object.fromEntries(characters.map((c) => [c.id, c]));

  const communityPlacements = useMemo(() => {
    if (!tierList) return {};
    const tierNames = tierList.tiers.map((t) => t.name);
    return computeCommunityPlacements(communityResults, tierNames);
  }, [communityResults, tierList]);

  const diffChars = useMemo(() => {
    if (!myResult) return new Set<string>();
    const diff = new Set<string>();
    for (const charId of Object.keys(myResult.placements)) {
      if (communityPlacements[charId] && communityPlacements[charId] !== myResult.placements[charId]) {
        diff.add(charId);
      }
    }
    return diff;
  }, [myResult, communityPlacements]);

  const isLoading = loadingTl || loadingChars || loadingMine || loadingCommunity;

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

  if (!tierList) {
    return (
      <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-4 p-4">
          <p className="text-muted-foreground">Tier list not found.</p>
          <Button variant="outline" onClick={() => setLocation("/tierlists")}>
            <ArrowLeft size={16} className="mr-2" /> Back
          </Button>
        </main>
      </div>
    );
  }

  const getCharsForTierIn = (placements: Record<string, string>, tierName: string) =>
    Object.entries(placements)
      .filter(([, t]) => t === tierName)
      .map(([id]) => charMap[id])
      .filter(Boolean) as Character[];

  return (
    <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-2 sm:px-4 py-4 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setLocation(`/tierlist/${id}`)} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black">{tierList.title}</h1>
            <p className="text-xs text-muted-foreground">{communityResults.length} total submissions</p>
          </div>
        </div>

        {!myResult && (
          <div className="border rounded-2xl bg-card p-6 text-center mb-6">
            <p className="text-muted-foreground mb-4">You haven't completed this tier list yet.</p>
            <Button onClick={() => setLocation(`/tierlist/${id}/play`)}>Play now</Button>
          </div>
        )}

        {myResult && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <User size={16} className="text-primary" />
                <h2 className="font-black text-base">{t("lbl_your_result")}</h2>
              </div>
              <div className="space-y-1.5">
                {tierList.tiers.map((tier) => (
                  <TierRow
                    key={tier.name}
                    tier={tier.name}
                    color={tier.color}
                    chars={getCharsForTierIn(myResult.placements, tier.name)}
                    diff={diffChars}
                  />
                ))}
              </div>
              {diffChars.size > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Highlighted characters differ from community consensus.
                </p>
              )}
            </div>

            {communityResults.length > 1 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users size={16} className="text-amber-400" />
                  <h2 className="font-black text-base">{t("lbl_community_result")}</h2>
                  <span className="text-xs text-muted-foreground">({communityResults.length} voters)</span>
                </div>
                <div className="space-y-1.5">
                  {tierList.tiers.map((tier) => (
                    <TierRow
                      key={tier.name}
                      tier={tier.name}
                      color={tier.color}
                      chars={getCharsForTierIn(communityPlacements, tier.name)}
                    />
                  ))}
                </div>
              </div>
            )}

            {communityResults.length <= 1 && (
              <div className="border rounded-xl bg-card p-4 text-center text-muted-foreground text-sm">
                <Users size={20} className="mx-auto mb-2 opacity-40" />
                Community results will appear once more people complete this tier list.
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setLocation(`/tierlist/${id}/play`)} className="flex-1">
                Redo
              </Button>
              <Button onClick={() => setLocation("/tierlists")} className="flex-1">
                Browse Tier Lists
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
