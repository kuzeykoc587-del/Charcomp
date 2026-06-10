import { useState } from "react";
import { TestCard } from "../components/TestCard";
import { Header } from "../components/Header";
import { useTranslation } from "../contexts/LanguageContext";
import { Input } from "../components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useTests } from "../hooks/useFirestore";

const CATEGORIES = ["All", "Anime", "TV Series", "Movie", "Game", "Comic", "Book", "Other"];

export default function ExplorePage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const { data: tests = [], isLoading } = useTests({
    sort: "popular",
    search: search || undefined,
  });

  const filteredTests = tests.filter((test) => {
    if (search) {
      const matchesSearch = test.title.toLowerCase().includes(search.toLowerCase()) ||
        (test.description || "").toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;
    }
    if (category !== "All" && (test as any).category && (test as any).category !== category) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">

        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              className="pl-10 h-12 rounded-full bg-muted/50 border-transparent focus:border-primary focus:bg-background"
              placeholder="Search tests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex justify-center gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  category === cat ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                }`}
                onClick={() => setCategory(cat)}
              >
                {cat === "All" ? t("lbl_all_categories") : cat === "Book" ? t("cat_book") : cat}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : filteredTests.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-xl">
            {t("empty_tests")}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredTests.map((test) => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
