import { useState } from "react";
import { Header } from "../components/Header";
import { useTranslation } from "../contexts/LanguageContext";
import { UniverseCard } from "../components/UniverseCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Plus, Loader2, Search } from "lucide-react";
import { CreateUniverseModal } from "../components/CreateUniverseModal";
import { useUniverses } from "../hooks/useFirestore";
import { useQueryClient } from "@tanstack/react-query";
import type { SeriesCategory } from "../lib/seedData";

const CATEGORIES = ["All", "Anime", "TV", "Movie", "Game", "Comic", "Book", "Other"] as const;

export default function UniversesPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [category, setCategory] = useState<"All" | SeriesCategory>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const { data: universes = [], isLoading } = useUniverses(
    category === "All" && !searchTerm
      ? undefined
      : { category: category === "All" ? undefined : category, search: searchTerm || undefined }
  );

  const catLabel = (c: string) => {
    const map: Record<string, string> = {
      All: t("lbl_all_categories"),
      Anime: t("cat_anime"),
      TV: t("cat_tv"),
      Movie: t("cat_movie"),
      Game: t("cat_game"),
      Comic: t("cat_comic"),
      Book: t("cat_book"),
      Other: t("cat_other"),
    };
    return map[c] ?? c;
  };

  return (
    <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">

        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("ph_search_universes")}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={() => setCreateModalOpen(true)} className="gap-2 shrink-0">
            <Plus size={16} /> {t("lbl_create_universe")}
          </Button>
        </div>

        {!searchTerm && (
          <div className="flex gap-2 flex-wrap mb-6">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  category === cat ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                }`}
                onClick={() => setCategory(cat === "All" ? "All" : cat as SeriesCategory)}
              >
                {catLabel(cat)}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : universes.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-xl">
            {t("empty_universes")}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {universes.map(u => (
              <UniverseCard key={u.id} series={u as any} characterCount={u.characterCount} />
            ))}
          </div>
        )}
      </main>

      <CreateUniverseModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={() => {
          setCreateModalOpen(false);
          qc.invalidateQueries({ queryKey: ["universes"] });
        }}
      />
    </div>
  );
}
