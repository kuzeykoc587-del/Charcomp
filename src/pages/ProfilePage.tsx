import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../contexts/AuthContext";
import { Header } from "../components/Header";
import { TestCard } from "../components/TestCard";
import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";
import { useTestsByCreator, useUserFavorites, useTests } from "../hooks/useFirestore";
import { useTranslation } from "../contexts/LanguageContext";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const [tab, setTab] = useState<"created" | "liked" | "favorites">("created");

  if (!user) {
    setLocation("/login");
    return null;
  }

  const { data: myTests = [], isLoading: loadingMine } = useTestsByCreator(user.id);
  const { data: favoriteItems = [] } = useUserFavorites(user.id, "test");
  const { data: allTests = [], isLoading: loadingAll } = useTests({ sort: "popular" });

  const favoriteIds = new Set(favoriteItems.map((f) => f.itemId));
  const favoriteTests = allTests.filter((t) => favoriteIds.has(t.id));

  const isLoading = tab === "created" ? loadingMine : tab === "favorites" ? loadingAll : false;

  return (
    <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
      <Header />

      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center gap-8">
          <img
            src={user.avatar}
            alt={user.name}
            onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=7C3AED&color=fff&size=400&bold=true`; }}
            className="w-32 h-32 rounded-full border-4 border-background shadow-xl object-cover"
          />
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-black mb-2">{user.name}</h1>
            {user.bio && <p className="text-muted-foreground text-lg mb-4">{user.bio}</p>}
            <p className="text-sm text-muted-foreground mb-4">{user.email}</p>
            <div className="flex gap-6 justify-center md:justify-start font-mono text-sm">
              <div><strong className="text-primary text-xl">{myTests.length}</strong> Created</div>
              <div><strong className="text-secondary text-xl">{favoriteTests.length}</strong> Favorites</div>
            </div>
          </div>
          <div>
            <Button variant="outline" onClick={() => { logout(); setLocation("/"); }}>Logout</Button>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex gap-4 border-b mb-8 pb-px overflow-x-auto">
          {(["created", "favorites"] as const).map((key) => (
            <button
              key={key}
              className={`pb-2 font-bold text-lg px-4 border-b-2 transition-colors shrink-0 ${tab === key ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              onClick={() => setTab(key)}
            >
              {key === "created" ? "Created" : "Favorites"}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {tab === "created" && myTests.map((test) => <TestCard key={test.id} test={test} />)}
              {tab === "favorites" && favoriteTests.map((test) => <TestCard key={test.id} test={test} />)}
            </div>
            {tab === "created" && myTests.length === 0 && (
              <div className="text-muted-foreground text-center py-12 border-2 border-dashed rounded-xl">No created tests yet.</div>
            )}
            {tab === "favorites" && favoriteTests.length === 0 && (
              <div className="text-muted-foreground text-center py-12 border-2 border-dashed rounded-xl">{t("empty_favorites")}</div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
