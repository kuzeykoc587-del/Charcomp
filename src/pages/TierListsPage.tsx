import { useState } from "react";
import { Link } from "wouter";
import { Header } from "../components/Header";
import { useTranslation } from "../contexts/LanguageContext";
import { useTierLists } from "../hooks/useFirestore";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Loader2, Plus, LayoutList, Search } from "lucide-react";
import { TierListCard } from "../components/TierListCard";

const PAGE_SIZE = 20;

export default function TierListsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

  const { data: tierLists = [], isLoading } = useTierLists(50);

  const filtered = tierLists.filter((tl) =>
    !search || tl.title.toLowerCase().includes(search.toLowerCase())
  );
  const visible = (filtered || []).slice(0, displayCount);
  const hasMore = filtered.length > displayCount;

  return (
    <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-6xl">

        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9 rounded-full bg-muted/50 border-transparent focus:border-primary focus:bg-background"
                placeholder={`Search tier lists...`}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setDisplayCount(PAGE_SIZE); }}
              />
            </div>
            <div className="flex gap-2 shrink-0">
              {user ? (
                <Link href="/create/tierlist">
                  <Button size="sm" className="gap-2">
                    <Plus size={14} /> {t("btn_create_tierlist")}
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button size="sm" variant="outline" className="gap-2">
                    <Plus size={14} /> {t("btn_create_tierlist")}
                  </Button>
                </Link>
              )}
              <Link href="/community-tierlist">
                <Button size="sm" variant="ghost" className="text-xs text-muted-foreground hidden sm:flex">
                  Community Votes
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-xl">
            <LayoutList size={40} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">{t("empty_tierlists")}</p>
            {user ? (
              <Link href="/create/tierlist">
                <Button className="gap-2"><Plus size={16} /> {t("btn_create_tierlist")}</Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="outline">Login to create</Button>
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {visible.map((tl) => (
                <TierListCard key={tl.id} tl={tl} />
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
    </div>
  );
}
