import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Header } from "../components/Header";
import { useTranslation } from "../contexts/LanguageContext";
import { useTierList, useTierListResult, useCharactersByIds } from "../hooks/useFirestore";
import { useAuth } from "../contexts/AuthContext";
import { tierListsDb, tierListResultsDb } from "../lib/db";
import { Button } from "../components/ui/button";
import { Loader2, ArrowLeft, Check, RotateCcw } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const TIER_COLORS: Record<string, string> = {
  S: "bg-red-500",
  A: "bg-orange-400",
  B: "bg-yellow-400",
  C: "bg-green-400",
  D: "bg-blue-400",
  E: "bg-purple-400",
  F: "bg-gray-400",
};

function tierColor(name: string) {
  return TIER_COLORS[name.toUpperCase()] ?? "bg-indigo-400";
}

export default function TierListPlayPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: tierList, isLoading: loadingTL } = useTierList(id);
  const { data: characters = [], isLoading: loadingChars } = useCharactersByIds(
    tierList?.characterIds ?? []
  );
  const { data: savedResult } = useTierListResult(user?.id, id);

  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [hasTrackedPlay, setHasTrackedPlay] = useState(false);

  useEffect(() => {
    if (savedResult?.placements) {
      setPlacements(savedResult.placements);
    }
  }, [savedResult]);

  useEffect(() => {
    if (tierList && !hasTrackedPlay) {
      setHasTrackedPlay(true);
      tierListsDb.incrementPlayCount(tierList.id).catch(() => {});
    }
  }, [tierList, hasTrackedPlay]);

  const unplaced = characters.filter(c => !placements[c.id]);
  const placed = (tier: string) => characters.filter(c => placements[c.id] === tier);

  const handleCharClick = (charId: string) => {
    if (selected === charId) {
      setSelected(null);
    } else {
      setSelected(charId);
    }
  };

  const handleTierClick = (tier: string) => {
    if (!selected) return;
    setPlacements(prev => ({ ...prev, [selected]: tier }));
    setSelected(null);
  };

  const handleRemoveFromTier = (charId: string) => {
    const next = { ...placements };
    delete next[charId];
    setPlacements(next);
    setSelected(null);
  };

  const handleReset = () => {
    setPlacements({});
    setSelected(null);
  };

  const handleSave = async () => {
    if (!user || !id) {
      toast({ title: "Kaydetmek için giriş yapın", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await tierListResultsDb.saveResult(user.id, id, placements);
      qc.invalidateQueries({ queryKey: ["tierlist-result", user.id, id] });
      toast({ title: t("msg_tierlist_saved") });
    } catch {
      toast({ title: "Kaydedilemedi", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const isLoading = loadingTL || loadingChars;

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      </div>
    );
  }

  if (!tierList) {
    return (
      <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
        <Header />
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <p className="text-muted-foreground">Tier list bulunamadı.</p>
          <Button variant="outline" onClick={() => setLocation("/tierlist")}>Geri Dön</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">

        <button
          onClick={() => setLocation("/tierlist")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft size={14} /> Tier Listler
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-black">{tierList.title}</h1>
          {tierList.description && (
            <p className="text-muted-foreground mt-1">{tierList.description}</p>
          )}
          {selected && (
            <p className="mt-2 text-sm text-primary font-medium animate-pulse">
              Seçili: {characters.find(c => c.id === selected)?.name} — bir tier satırına tıkla
            </p>
          )}
        </div>

        {/* Tier rows */}
        <div className="space-y-2 mb-6">
          {tierList.tierNames.map(tier => (
            <div
              key={tier}
              onClick={() => selected && handleTierClick(tier)}
              className={`flex items-start gap-2 border rounded-xl overflow-hidden transition-all ${
                selected ? "cursor-pointer hover:border-primary hover:shadow-md" : ""
              }`}
            >
              <div className={`${tierColor(tier)} w-12 min-h-[56px] flex items-center justify-center font-black text-white text-lg shrink-0 self-stretch`}>
                {tier}
              </div>
              <div className="flex flex-wrap gap-2 p-2 flex-1 min-h-[56px] items-center">
                {placed(tier).length === 0 && (
                  <span className="text-xs text-muted-foreground italic">
                    {selected ? "Buraya yerleştir" : "Boş"}
                  </span>
                )}
                {placed(tier).map(char => (
                  <button
                    key={char.id}
                    onClick={e => { e.stopPropagation(); handleRemoveFromTier(char.id); }}
                    className="flex flex-col items-center gap-0.5 group"
                    title={`${char.name} — kaldır`}
                  >
                    <div className="relative">
                      <img
                        src={char.image} alt={char.name}
                        onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(char.name)}&background=7C3AED&color=fff&size=400&bold=true`; }}
                        className="w-12 h-12 object-cover rounded border-2 border-transparent group-hover:border-destructive transition-all"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center text-white text-xs font-bold">×</div>
                    </div>
                    <span className="text-[9px] text-muted-foreground truncate max-w-[48px]">{char.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Unplaced pool */}
        <div className="border-2 border-dashed rounded-xl p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">{t("lbl_unplaced")}</h3>
          {unplaced.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-4">🎉 Tüm karakterler yerleştirildi!</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {unplaced.map(char => (
                <button
                  key={char.id}
                  onClick={() => handleCharClick(char.id)}
                  className={`flex flex-col items-center gap-0.5 transition-all ${
                    selected === char.id ? "scale-110 ring-2 ring-primary rounded" : "hover:scale-105"
                  }`}
                >
                  <img
                    src={char.image} alt={char.name}
                    onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(char.name)}&background=7C3AED&color=fff&size=400&bold=true`; }}
                    className={`w-14 h-14 object-cover rounded-lg border-2 transition-all ${
                      selected === char.id ? "border-primary" : "border-transparent"
                    }`}
                  />
                  <span className="text-[9px] text-muted-foreground truncate max-w-[56px]">{char.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleReset}
          >
            <RotateCcw size={14} /> Sıfırla
          </Button>
          <Button
            className="gap-2 flex-1"
            onClick={handleSave}
            disabled={saving || !user}
          >
            {saving ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />}
            {user ? t("btn_save_result") : "Kaydetmek için giriş yap"}
          </Button>
        </div>
      </main>
    </div>
  );
}
