import { useState } from "react";
import { Header } from "../components/Header";
import { useTranslation } from "../contexts/LanguageContext";
import { useTierLists } from "../hooks/useFirestore";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Loader2, Search, Plus, LayoutList, Users, Play } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "../contexts/AuthContext";

export default function TierListsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: tierLists = [], isLoading } = useTierLists(
    searchTerm.length >= 2 ? { search: searchTerm } : undefined
  );

  return (
    <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">

        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("ph_search_tierlists")}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          {user && (
            <Link href="/create/tierlist">
              <Button className="gap-2 shrink-0">
                <Plus size={16} /> {t("btn_create_tierlist")}
              </Button>
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : tierLists.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-xl space-y-4">
            <LayoutList className="mx-auto text-muted-foreground" size={40} />
            <p className="text-muted-foreground">{t("empty_tierlists")}</p>
            {user && (
              <Link href="/create/tierlist">
                <Button className="gap-2">
                  <Plus size={16} /> {t("btn_create_tierlist")}
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tierLists.map(tl => (
              <Link key={tl.id} href={`/tierlist/${tl.id}`}>
                <div className="group border rounded-xl overflow-hidden bg-card hover:border-primary transition-all cursor-pointer shadow-sm hover:shadow-md">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {tl.coverImage ? (
                      <img
                        src={tl.coverImage} alt={tl.title}
                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                        <LayoutList size={32} className="text-primary/50" />
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 flex gap-1 flex-wrap">
                      {tl.tierNames.slice(0, 5).map(tier => (
                        <span key={tier} className="bg-black/60 backdrop-blur-sm text-white text-xs px-1.5 py-0.5 rounded font-bold">
                          {tier}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-sm truncate group-hover:text-primary transition-colors">{tl.title}</h3>
                    {tl.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{tl.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users size={11} /> {tl.characterIds.length}
                      </span>
                      <span className="flex items-center gap-1">
                        <Play size={11} /> {tl.playCount}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
