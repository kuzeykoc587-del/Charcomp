import { useState } from "react";
import { Header } from "../components/Header";
import { useTranslation } from "../contexts/LanguageContext";
import { UniverseCard } from "../components/UniverseCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Plus, Loader2, Search } from "lucide-react";
import { CreateUniverseModal } from "../components/CreateUniverseModal";
import { useUniverses } from "../hooks/useFirestore";
import { useAuth } from "../contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import type { SeriesCategory } from "../lib/seedData";

const CATEGORIES = ["All", "Anime", "TV", "Movie", "Game", "Comic", "Book", "Other"] as const;
const PAGE_SIZE = 20;

export default function UniversesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [category, setCategory] = useState<"All" | SeriesCategory>("All");
  const [search, setSearch] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

  const { data: universes = [], isLoading } = useUniverses(
    category === "All" ? undefined : { category }
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

  const filtered = universes.filter((u) =>
    !search || u.name.toLowerCase().includes(search.toLowerCase())
  );
  const visible = filtered.slice(0, displayCount);
  const hasMore = filtered.length > displayCount;

  return (
    <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-6xl">

        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9 rounded-full bg-muted/50 border-transparent focus:border-primary focus:bg-background"
                placeholder={`Search universes...`}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setDisplayCount(PAGE_SIZE); }}
              />
            </div>
            {user ? (
              <Button onClick={() => setCreateModalOpen(true)} size="sm" className="gap-2 shrink-0">
                <Plus size={14} /> {t("lbl_create_universe")}
              </Button>
            ) : (
              <Button onClick={() => setCreateModalOpen(true)} size="sm" variant="outline" className="gap-2 shrink-0">
                <Plus size={14} /> {t("lbl_create_universe")}
              </Button>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  category === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                }`}
                onClick={() => { setCategory(cat === "All" ? "All" : cat as SeriesCategory); setDisplayCount(PAGE_SIZE); }}
              >
                {catLabel(cat)}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-xl">
            {t("empty_universes")}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {visible.map((u) => (
                <UniverseCard key={u.id} series={u as any} characterCount={u.characterCount} />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button variant="outline" onClick={() => setDisplayCount((n) => n + PAGE_SIZE)}>
                  {t("btn_load_more")}
                </Button>
              </div>
            )}
          </>
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
