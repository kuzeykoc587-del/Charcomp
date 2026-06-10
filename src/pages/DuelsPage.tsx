import { useState } from "react";
import { Header } from "../components/Header";
import { DuelCard } from "../components/DuelCard";
import { Button } from "../components/ui/button";
import { RotateCcw, Plus, Loader2 } from "lucide-react";
import { useDuels, useCharactersByIds } from "../hooks/useFirestore";
import { useAuth } from "../contexts/AuthContext";
import { CreateDuelModal } from "../components/CreateDuelModal";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "../contexts/LanguageContext";

export default function DuelsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const { data: duels = [], isLoading } = useDuels();

  // Collect all unique character IDs from duels
  const allCharIds = Array.from(new Set(duels.flatMap((d) => [d.characterAId, d.characterBId])));
  const { data: allChars = [] } = useCharactersByIds(allCharIds);
  const charMap = Object.fromEntries(allChars.map((c) => [c.id, c]));

  const handleNext = () => {
    if (currentIndex + 1 >= duels.length) {
      setCompleted(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setCompleted(false);
  };

  const duel = duels[currentIndex];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-muted/20 pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center">

        {isLoading ? (
          <Loader2 className="animate-spin text-primary" size={32} />
        ) : duels.length === 0 ? (
          <div className="text-center space-y-6 max-w-md mx-auto py-20">
            <h1 className="text-4xl font-black mb-4">{t("empty_duels")}</h1>
            <p className="text-muted-foreground mb-8">Be the first to create a character duel!</p>
            {user && (
              <Button size="lg" onClick={() => setCreateOpen(true)} className="gap-2 w-full">
                <Plus size={18} /> {t("btn_create_duel")}
              </Button>
            )}
          </div>
        ) : completed ? (
          <div className="text-center space-y-6 max-w-md mx-auto py-20">
            <h1 className="text-4xl font-black mb-4">{t("msg_all_duels_seen")}</h1>
            <p className="text-muted-foreground mb-8">{t("msg_thanks_for_voting")}</p>
            <Button size="lg" onClick={handleRestart} className="gap-2 w-full">
              <RotateCcw size={18} /> {t("btn_start_over")}
            </Button>
          </div>
        ) : (
          <>
            <div className="w-full flex items-center justify-between max-w-5xl mb-4 gap-4">
              <div className="text-sm font-mono text-muted-foreground tracking-widest uppercase">
                {`${t("lbl_duel")} ${currentIndex + 1} / ${duels.length}`}
              </div>
              {user && (
                <Button size="sm" variant="outline" onClick={() => setCreateOpen(true)} className="gap-1">
                  <Plus size={14} /> {t("btn_create_duel")}
                </Button>
              )}
            </div>

            <div className="w-full max-w-5xl">
              {duel && charMap[duel.characterAId] && charMap[duel.characterBId] && (
                <DuelCard
                  key={duel.id}
                  duel={duel}
                  charA={charMap[duel.characterAId]}
                  charB={charMap[duel.characterBId]}
                  onNext={handleNext}
                />
              )}
            </div>

            <div className="mt-8 flex gap-4">
              <button onClick={handleNext} className="text-sm text-muted-foreground hover:text-foreground font-medium px-4 py-2">
                {t("btn_skip")}
              </button>
            </div>
          </>
        )}
      </main>

      <CreateDuelModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => {
          setCreateOpen(false);
          qc.invalidateQueries({ queryKey: ["duels"] });
        }}
      />
    </div>
  );
}
