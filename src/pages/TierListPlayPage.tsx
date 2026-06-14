import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Header } from "../components/Header";
import { useTranslation } from "../contexts/LanguageContext";
import { useTierList, useCharactersByIds, useUserTierListResult } from "../hooks/useFirestore";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { tierListResultsDb } from "../lib/db";
import { useToast } from "../hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import type { Character } from "../lib/db";

function CharAvatar({ char, size = "md" }: { char: Character; size?: "sm" | "md" }) {
  const s = size === "sm" ? "w-8 h-8" : "w-12 h-12";
  return (
    <img
      src={char.image}
      alt={char.name}
      className={`${s} rounded-lg object-cover border`}
      onError={(e) => {
        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(char.name)}&background=7C3AED&color=fff&size=80&bold=true`;
      }}
    />
  );
}

export default function TierListPlayPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: tierList, isLoading: loadingTl } = useTierList(id);
  const { data: characters = [], isLoading: loadingChars } = useCharactersByIds(
    tierList?.characterIds ?? []
  );
  const { data: existingResult } = useUserTierListResult(id, user?.id);

  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (existingResult) {
      setPlacements(existingResult.placements);
    }
  }, [existingResult]);

  const charMap = Object.fromEntries(characters.map((c) => [c.id, c]));

  const unplaced = characters.filter((c) => !placements[c.id]);
  const placedIn = (tierName: string) =>
    characters.filter((c) => placements[c.id] === tierName);

  const handleSelectChar = (charId: string) => {
    setSelected((prev) => (prev === charId ? null : charId));
  };

  const handlePlaceInTier = (tierName: string) => {
    if (!selected) return;
    setPlacements((prev) => ({ ...prev, [selected]: tierName }));
    setSelected(null);
  };

  const handleRemoveFromTier = (charId: string) => {
    setPlacements((prev) => {
      const next = { ...prev };
      delete next[charId];
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "Login required", description: "Please log in to save your tier list.", variant: "destructive" });
      return;
    }
    if (!id) return;
    const placedCount = Object.keys(placements).length;
    if (placedCount < characters.length) {
      const confirm = window.confirm(`You have ${characters.length - placedCount} unplaced characters. Submit anyway?`);
      if (!confirm) return;
    }
    setSubmitting(true);
    try {
      await tierListResultsDb.submit({ tierListId: id, userId: user.id, placements, submittedAt: new Date().toISOString() });
      qc.invalidateQueries({ queryKey: ["tierlist-result", id, user.id] });
      qc.invalidateQueries({ queryKey: ["tierlist-community", id] });
      toast({ title: t("msg_tierlist_submitted") });
      setLocation(`/tierlist/${id}/result`);
    } catch (e) {
      toast({ title: "Error", description: "Could not save your result.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

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
            <ArrowLeft size={16} className="mr-2" /> Back
          </Button>
        </main>
      </div>
    );
  }

  const allPlaced = characters.length > 0 && Object.keys(placements).length === characters.length;

  return (
    <div className="min-h-[100dvh] flex flex-col pb-24 md:pb-6">
      <Header />
      <main className="flex-1 container mx-auto px-2 sm:px-4 py-4 max-w-4xl">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setLocation(`/tierlist/${id}`)} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black leading-tight">{tierList.title}</h1>
            <p className="text-xs text-muted-foreground">{t("lbl_drag_hint")}</p>
          </div>
        </div>

        {selected && (
          <div className="fixed bottom-20 md:bottom-4 left-0 right-0 flex justify-center z-40 px-4 pointer-events-none">
            <div className="bg-primary text-primary-foreground rounded-2xl px-4 py-2 text-sm font-bold shadow-xl pointer-events-none">
              {charMap[selected]?.name} selected — tap a tier row to place
            </div>
          </div>
        )}

        <div className="space-y-1.5 mb-4">
          {tierList.tiers.map((tier) => {
            const placed = placedIn(tier.name);
            const isTarget = selected !== null;
            return (
              <div
                key={tier.name}
                onClick={() => isTarget && handlePlaceInTier(tier.name)}
                className={`flex items-stretch rounded-xl border-2 transition-all ${
                  isTarget
                    ? "cursor-pointer border-dashed hover:opacity-90 scale-[1.01]"
                    : "cursor-default"
                }`}
                style={{
                  borderColor: isTarget ? tier.color : `${tier.color}44`,
                  backgroundColor: isTarget ? `${tier.color}11` : `${tier.color}08`,
                }}
              >
                <div
                  className="flex items-center justify-center w-14 shrink-0 rounded-l-xl"
                  style={{ backgroundColor: `${tier.color}22` }}
                >
                  <span className="font-black text-sm" style={{ color: tier.color }}>
                    {tier.name}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 p-2 flex-1 min-h-[52px] items-center">
                  {placed.length === 0 && (
                    <span className="text-xs text-muted-foreground italic">
                      {isTarget ? "Drop here" : "Empty"}
                    </span>
                  )}
                  {placed.map((char) => (
                    <button
                      key={char.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromTier(char.id);
                      }}
                      className="flex items-center gap-1.5 bg-background/80 rounded-lg px-2 py-1 border hover:border-destructive/50 transition-colors group"
                      title="Click to remove"
                    >
                      <CharAvatar char={char} size="sm" />
                      <span className="text-xs font-semibold">{char.name}</span>
                      <span className="text-destructive opacity-0 group-hover:opacity-100 text-xs">×</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="border rounded-2xl bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">
              {t("lbl_unplaced")} ({unplaced.length})
            </h3>
            {allPlaced && (
              <span className="text-xs text-green-400 font-bold flex items-center gap-1">
                <CheckCircle size={12} /> All placed!
              </span>
            )}
          </div>
          {unplaced.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-2">All characters placed!</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {unplaced.map((char) => (
                <button
                  key={char.id}
                  onClick={() => handleSelectChar(char.id)}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 border-2 transition-all ${
                    selected === char.id
                      ? "border-primary bg-primary/10 scale-105 shadow-md"
                      : "border-border bg-background hover:border-primary/40"
                  }`}
                >
                  <CharAvatar char={char} size="sm" />
                  <span className="text-xs font-semibold">{char.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            {Object.keys(placements).length} / {characters.length} placed
          </p>
          <Button onClick={handleSubmit} disabled={submitting || Object.keys(placements).length === 0} className="gap-2">
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {t("btn_submit")}
          </Button>
        </div>
      </main>
    </div>
  );
}
