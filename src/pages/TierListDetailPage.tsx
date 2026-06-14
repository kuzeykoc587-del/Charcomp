import { useParams, useLocation } from "wouter";
import { Header } from "../components/Header";
import { useTranslation } from "../contexts/LanguageContext";
import { useTierList, useCharactersByIds, useUserTierListResult, useCommunityTierListResults } from "../hooks/useFirestore";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Loader2, ArrowLeft, Play, LayoutList, Users, User } from "lucide-react";
import type { Character } from "../lib/db";
import { useMemo } from "react";

function CharAvatar({ char }: { char: Character }) {
  return (
    <div className="flex flex-col items-center gap-1 w-16">
      <img
        src={char.image}
        alt={char.name}
        className="w-14 h-14 rounded-xl object-cover border"
        onError={(e) => {
          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(char.name)}&background=7C3AED&color=fff&size=80&bold=true`;
        }}
      />
      <p className="text-[10px] text-center leading-tight font-medium truncate w-full">{char.name}</p>
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
    let best = tiers[tiers.length - 1] ?? "D";
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

export default function TierListDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: tierList, isLoading: loadingTl } = useTierList(id);
  const { data: characters = [], isLoading: loadingChars } = useCharactersByIds(
    tierList?.characterIds ?? []
  );
  const { data: myResult } = useUserTierListResult(id, user?.id);
  const { data: communityResults = [] } = useCommunityTierListResults(id);

  const communityPlacements = useMemo(() => {
    if (!tierList || communityResults.length === 0) return {};
    return computeCommunityPlacements(communityResults, tierList.tiers.map(t => t.name));
  }, [communityResults, tierList]);

  const isLoading = loadingTl || loadingChars;

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
            <ArrowLeft size={16} className="mr-2" /> Back to Tier Lists
          </Button>
        </main>
      </div>
    );
  }

  const charMap = Object.fromEntries(characters.map(c => [c.id, c]));

  return (
    <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-3xl">
        <button
          onClick={() => setLocation("/tierlists")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Tier Lists
        </button>

        <div className="bg-card border rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
              <LayoutList size={22} className="text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-black leading-tight">{tierList.title}</h1>
              {tierList.description && (
                <p className="text-muted-foreground text-sm mt-1">{tierList.description}</p>
              )}
              <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users size={12} />
                  {tierList.playCount > 0 ? `${tierList.playCount} plays` : "Yeni"}
                </span>
                <span>{tierList.characterIds.length} characters</span>
                {communityResults.length > 1 && (
                  <span className="text-amber-500 font-medium">{communityResults.length} community submissions</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-1.5 flex-wrap mb-6">
            {(tierList.tiers || []).map((tier) => (
              <span
                key={tier.name}
                className="px-3 py-1 rounded-lg text-sm font-black"
                style={{ backgroundColor: `${tier.color}22`, color: tier.color, border: `1px solid ${tier.color}44` }}
              >
                {tier.name}
              </span>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1 gap-2"
              onClick={() => setLocation(`/tierlist/${id}/play`)}
            >
              <Play size={18} />
              {myResult ? "Play Again" : t("btn_play")}
            </Button>
            {myResult && (
              <Button
                size="lg"
                variant="outline"
                className="flex-1"
                onClick={() => setLocation(`/tierlist/${id}/result`)}
              >
                {t("btn_see_results")}
              </Button>
            )}
          </div>
        </div>

        {/* Community Tier Preview */}
        {communityResults.length > 1 && (
          <div className="bg-card border rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Users size={16} className="text-amber-400" />
              <h2 className="font-black text-sm">Community Tier List</h2>
              <span className="text-xs text-muted-foreground ml-auto">{communityResults.length} voters</span>
            </div>
            <div className="space-y-1.5">
              {(tierList.tiers || []).map((tier) => {
                const charsInTier = Object.entries(communityPlacements)
                  .filter(([, t]) => t === tier.name)
                  .map(([id]) => charMap[id])
                  .filter(Boolean) as Character[];
                return (
                  <div
                    key={tier.name}
                    className="flex items-stretch rounded-xl border overflow-hidden"
                    style={{ borderColor: `${tier.color}33`, backgroundColor: `${tier.color}08` }}
                  >
                    <div
                      className="flex items-center justify-center w-10 shrink-0"
                      style={{ backgroundColor: `${tier.color}22` }}
                    >
                      <span className="font-black text-xs" style={{ color: tier.color }}>{tier.name}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 p-2 flex-1 min-h-[40px] items-center">
                      {charsInTier.length === 0 ? (
                        <span className="text-xs text-muted-foreground italic">—</span>
                      ) : (
                        charsInTier.slice(0, 8).map((c) => (
                          <div key={c.id} className="flex items-center gap-1 bg-background/60 rounded px-1.5 py-0.5 border">
                            <img src={c.image} alt={c.name} className="w-5 h-5 rounded object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=7C3AED&color=fff&size=40&bold=true`; }} />
                            <span className="text-[10px] font-semibold">{c.name}</span>
                          </div>
                        ))
                      )}
                      {charsInTier.length > 8 && (
                        <span className="text-[10px] text-muted-foreground">+{charsInTier.length - 8}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {myResult && (
              <button
                onClick={() => setLocation(`/tierlist/${id}/result`)}
                className="mt-3 text-xs text-primary font-semibold hover:underline flex items-center gap-1"
              >
                <User size={12} /> Compare with your result
              </button>
            )}
          </div>
        )}

        {characters.length > 0 && (
          <div>
            <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-wide mb-3">
              Characters in Pool ({characters.length})
            </h2>
            <div className="flex flex-wrap gap-3">
              {characters.map((char) => (
                <CharAvatar key={char.id} char={char} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
