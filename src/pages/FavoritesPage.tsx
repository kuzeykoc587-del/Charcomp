import { Header } from "../components/Header";
import { TestCard } from "../components/TestCard";
import { useTranslation } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { useUserFavorites, useTests } from "../hooks/useFirestore";
import { Link } from "wouter";
import { Button } from "../components/ui/button";
import { Loader2, LogIn } from "lucide-react";

export default function FavoritesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: favoriteItems = [], isLoading: loadingFavs } = useUserFavorites(user?.id, "test");
  const { data: allTests = [], isLoading: loadingTests } = useTests({ sort: "popular" });

  const favoriteIds = new Set(favoriteItems.map((f) => f.itemId));
  const favoriteTests = allTests.filter((t) => favoriteIds.has(t.id));
  const isLoading = loadingFavs || loadingTests;

  if (!user) {
    return (
      <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
          <p className="text-muted-foreground text-lg text-center">Sign in to save your favorites.</p>
          <Link href="/login">
            <Button className="gap-2"><LogIn size={16} /> Sign In</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-black mb-8">{t("nav_favorites")}</h1>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : favoriteTests.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-xl">
            <p className="text-muted-foreground">{t("empty_favorites")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:columns-5 gap-4">
            {favoriteTests.map((test) => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
