import { useState } from "react";
import { Link } from "wouter";
import { Header } from "../components/Header";
import { useTranslation } from "../contexts/LanguageContext";
import { Input } from "../components/ui/input";
import { Search, Loader2, Globe, Users, PlayCircle } from "lucide-react";
import { searchDb } from "../lib/db";
import { useQuery } from "@tanstack/react-query";

export default function SearchPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchDb.all(query),
    enabled: query.trim().length >= 2,
    staleTime: 15_000,
  });

  const hasResults = data && (data.universes.length + data.characters.length + data.tests.length) > 0;

  return (
    <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-black mb-6">{t("nav_search")}</h1>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("ph_search")}
            className="pl-12 py-6 text-lg"
            autoFocus
          />
        </div>

        {query.length >= 2 && isLoading && (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={28} /></div>
        )}

        {query.length >= 2 && !isLoading && !hasResults && (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
            {t("lbl_no_results")}
          </div>
        )}

        {data && hasResults && (
          <div className="space-y-8">
            {/* Universes */}
            {data.universes.length > 0 && (
              <section>
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Globe size={18} className="text-primary" /> Universes
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.universes.map((u) => (
                    <Link key={u.id} href={`/universe/${u.id}`}>
                      <div className="flex items-center gap-3 p-3 border rounded-xl hover:border-primary transition-colors cursor-pointer bg-card">
                        <img
                          src={u.coverImage}
                          alt={u.name}
                          onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=1a1a2e&color=7C3AED&size=400&bold=true`; }}
                          className="w-12 h-12 rounded-lg object-cover bg-muted"
                        />
                        <div>
                          <p className="font-bold text-sm">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.category} · {u.characterCount} chars</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Characters */}
            {data.characters.length > 0 && (
              <section>
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Users size={18} className="text-primary" /> Characters
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {data.characters.map((c) => (
                    <Link key={c.id} href={`/universe/${c.seriesId}`}>
                      <div className="flex items-center gap-3 p-3 border rounded-xl hover:border-primary transition-colors cursor-pointer bg-card">
                        <img
                          src={c.image}
                          alt={c.name}
                          onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=7C3AED&color=fff&size=400&bold=true`; }}
                          className="w-10 h-10 rounded-full object-cover bg-muted"
                        />
                        <div className="overflow-hidden">
                          <p className="font-bold text-sm truncate">{c.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{c.tags?.[0] ?? ""}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Tests */}
            {data.tests.length > 0 && (
              <section>
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <PlayCircle size={18} className="text-primary" /> Tests
                </h2>
                <div className="space-y-2">
                  {data.tests.map((test) => (
                    <Link key={test.id} href={`/test/${test.id}`}>
                      <div className="flex items-center gap-4 p-3 border rounded-xl hover:border-primary transition-colors cursor-pointer bg-card">
                        <img
                          src={test.coverImage}
                          alt={test.title}
                          className="w-12 h-12 rounded-lg object-cover bg-muted"
                        />
                        <div className="flex-1 overflow-hidden">
                          <p className="font-bold text-sm truncate">{test.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{test.description}</p>
                        </div>
                        <div className="text-xs text-muted-foreground font-mono shrink-0">
                          {test.playCount.toLocaleString()} plays
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {query.length < 2 && (
          <div className="text-center py-12 text-muted-foreground">
            <Search size={48} className="mx-auto mb-4 opacity-20" />
            <p>Type at least 2 characters to search</p>
          </div>
        )}
      </main>
    </div>
  );
}
