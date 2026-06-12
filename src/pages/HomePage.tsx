import { useState } from "react";
import { Header } from "../components/Header";
import { TestCard } from "../components/TestCard";
import { useTranslation } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { useTests, useUserFavorites, useRecentlyPlayedTests } from "../hooks/useFirestore";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Loader2, Search } from "lucide-react";

type Filter = "popular" | "new" | "trending" | "favorites" | "mine" | "recent";

export default function HomePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [filter, setFilter] = useState<Filter>("popular");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: allTests = [], isLoading } = useTests({
    sort: (filter === "popular" || filter === "favorites" || filter === "mine" || filter === "recent")
      ? "popular"
      : filter,
    search: searchTerm.length >= 2 ? searchTerm : undefined,
  });

  const { data: userFavorites = [] } = useUserFavorites(
    filter === "favorites" ? user?.id : undefined,
    "test"
  );
  const favoriteIds = new Set(userFavorites.map(f => f.itemId));
  const recentTests = useRecentlyPlayedTests(allTests);

  const filteredTests = (() => {
    if (filter === "favorites") return allTests.filter(t => favoriteIds.has(t.id));
    if (filter === "mine") return allTests.filter(t => user && t.creatorId === user.id);
    if (filter === "recent") return recentTests;
    return allTests;
  })();

  const filters: { key: Filter; label: string; requiresAuth?: boolean }[] = [
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
      <main className="flex-1 container mx-auto px-4 py-6">

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("ph_search_tests")}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {!searchTerm && (
          <div className="flex overflow-x-auto pb-3 gap-2 mb-6 hide-scrollbar">
            {filters.map(({ key, label, requiresAuth }) => {
              if (requiresAuth && !user) return null;
              return (
                <Button
                  key={key}
                  variant={filter === key ? "default" : "outline"}
                  onClick={() => setFilter(key)}
                  className="rounded-full shrink-0"
                  size="sm"
                >
                  {label}
                </Button>
              );
            })}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-xl">
            <p className="text-muted-foreground">{t("empty_tests")}</p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
            {filteredTests.map(test => (
              <div key={test.id} className="break-inside-avoid">
                <TestCard test={test} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
