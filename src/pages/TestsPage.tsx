import { useState } from "react";
import { Header } from "../components/Header";
import { TestCard } from "../components/TestCard";
import { useTranslation } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { useTests, useUserFavorites, useRecentlyPlayedTests } from "../hooks/useFirestore";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Loader2, Search } from "lucide-react";

type SortFilter = "popular" | "new" | "trending" | "favorites" | "mine" | "recent";

const CATEGORIES = ["All", "Anime", "TV Series", "Movie", "Game", "Comic", "Book", "Other"];

export default function TestsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [sort, setSort] = useState<SortFilter>("popular");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const { data: allTests = [], isLoading } = useTests({
    sort: (sort === "favorites" || sort === "mine" || sort === "recent") ? "popular" : sort,
  });

  const { data: userFavorites = [] } = useUserFavorites(
    sort === "favorites" ? user?.id : undefined,
    "test"
  );
  const favoriteIds = new Set(userFavorites.map((f) => f.itemId));
  const recentTests = useRecentlyPlayedTests(allTests);

  const filteredTests = (() => {
    let list = allTests;
    if (sort === "favorites") list = list.filter((t) => favoriteIds.has(t.id));
    else if (sort === "mine") list = list.filter((t) => user && t.creatorId === user.id);
    else if (sort === "recent") list = recentTests;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description || "").toLowerCase().includes(q)
      );
    }
    if (category !== "All") {
      list = list.filter((t) => (t as any).category === category || !(t as any).category);
    }
    return list;
  })();

  const sortFilters: { key: SortFilter; label: string; requiresAuth?: boolean }[] = [
    { key: "popular", label: t("filter_popular") },
    { key: "new", label: t("filter_new") },
    { key: "trending", label: t("filter_trending") },
    { key: "favorites", label: t("filter_favorites"), requiresAuth: true },
    { key: "mine", label: t("filter_my_tests"), requiresAuth: true },
    { key: "recent", label: t("filter_recent") },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-6xl">

        <div className="mb-6 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9 rounded-full bg-muted/50 border-transparent focus:border-primary focus:bg-background"
              placeholder={`${t("nav_search")} ${t("home_category_tests").toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex overflow-x-auto pb-1 gap-2 hide-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-colors ${
                  category === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                }`}
                onClick={() => setCategory(cat)}
              >
                {cat === "All" ? t("lbl_all_categories") : cat === "Book" ? t("cat_book") : cat}
              </button>
            ))}
          </div>

          <div className="flex overflow-x-auto pb-1 gap-2 hide-scrollbar">
            {sortFilters.map(({ key, label, requiresAuth }) => {
              if (requiresAuth && !user) return null;
              return (
                <Button
                  key={key}
                  variant={sort === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSort(key)}
                  className="rounded-full shrink-0"
                >
                  {label}
                </Button>
              );
            })}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-xl">
            <p className="text-muted-foreground">{t("empty_tests")}</p>
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
