import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "../contexts/AuthContext";
import { Header } from "../components/Header";
import { TestCard } from "../components/TestCard";
import { Button } from "../components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import {
  useTestsByCreator, useUserFavorites, useTests,
  useUniversesByCreator, useCharactersByCreator, useDuelsByCreator,
  useUserTierVotes, useCharactersByIds,
} from "../hooks/useFirestore";
import { useTranslation } from "../contexts/LanguageContext";
import { universesDb, charactersDb, duelsDb } from "../lib/db";
import { ConfirmModal } from "../components/ConfirmModal";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "../hooks/use-toast";

type Tab = "created" | "universes" | "characters" | "duels" | "favorites" | "tier-votes";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("created");
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string } | null>(null);

  if (!user) {
    setLocation("/login");
    return null;
  }

  const { data: myTests = [], isLoading: loadingTests } = useTestsByCreator(user.id);
  const { data: myUniverses = [], isLoading: loadingUniverses } = useUniversesByCreator(user.id);
  const { data: myCharacters = [], isLoading: loadingChars } = useCharactersByCreator(user.id);
  const { data: myDuels = [], isLoading: loadingDuels } = useDuelsByCreator(user.id);
  const { data: myTierVotes = [], isLoading: loadingTierVotes } = useUserTierVotes(user.id);
  const { data: tierVoteCharacters = [] } = useCharactersByIds(myTierVotes.map(v => v.characterId));
  const { data: favoriteItems = [] } = useUserFavorites(user.id, "test");
  const { data: allTests = [], isLoading: loadingAll } = useTests({ sort: "popular" });

  const favoriteIds = new Set(favoriteItems.map((f) => f.itemId));
  const favoriteTests = allTests.filter((t) => favoriteIds.has(t.id));

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "created", label: "Tests", count: myTests.length },
    { key: "universes", label: t("lbl_my_universes"), count: myUniverses.length },
    { key: "characters", label: t("lbl_my_characters"), count: myCharacters.length },
    { key: "duels", label: t("lbl_my_duels"), count: myDuels.length },
    { key: "favorites", label: t("lbl_my_favorites"), count: favoriteTests.length },
    { key: "tier-votes", label: "My Tier Votes", count: myTierVotes.length },
  ];

  const isLoading = tab === "created" ? loadingTests
    : tab === "universes" ? loadingUniverses
    : tab === "characters" ? loadingChars
    : tab === "duels" ? loadingDuels
    : tab === "tier-votes" ? loadingTierVotes
    : loadingAll;

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === "universe") {
        await universesDb.softDelete(deleteTarget.id, user.id);
        qc.invalidateQueries({ queryKey: ["universes-by-creator", user.id] });
        qc.invalidateQueries({ queryKey: ["universes"] });
      } else if (deleteTarget.type === "character") {
        await charactersDb.softDelete(deleteTarget.id, user.id);
        qc.invalidateQueries({ queryKey: ["characters-by-creator", user.id] });
        qc.invalidateQueries({ queryKey: ["characters"] });
      } else if (deleteTarget.type === "duel") {
        await duelsDb.softDelete(deleteTarget.id, user.id);
        qc.invalidateQueries({ queryKey: ["duels-by-creator", user.id] });
        qc.invalidateQueries({ queryKey: ["duels"] });
      }
      toast({ title: t("msg_deleted") });
    } catch {
      toast({ title: "Error", description: "Could not delete.", variant: "destructive" });
    }
  };

  const tierVoteCharMap = Object.fromEntries(tierVoteCharacters.map(c => [c.id, c]));

  const TIER_COLORS: Record<string, string> = {
    S: "bg-yellow-500 text-black",
    A: "bg-orange-500 text-black",
    B: "bg-blue-500 text-white",
    C: "bg-green-600 text-white",
    D: "bg-muted text-muted-foreground",
  };

  return (
    <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
      <Header />

      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-10 flex flex-col md:flex-row items-center gap-6">
          <img
            src={user.avatar}
            alt={user.name}
            onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=7C3AED&color=fff&size=400&bold=true`; }}
            className="w-28 h-28 rounded-full border-4 border-background shadow-xl object-cover"
          />
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-black mb-1">{user.name}</h1>
            {user.bio && <p className="text-muted-foreground mb-2">{user.bio}</p>}
            <p className="text-sm text-muted-foreground mb-3">{user.email}</p>
            <div className="flex gap-5 justify-center md:justify-start font-mono text-sm flex-wrap">
              <div><strong className="text-primary text-lg">{myTests.length}</strong> Tests</div>
              <div><strong className="text-primary text-lg">{myUniverses.length}</strong> Universes</div>
              <div><strong className="text-primary text-lg">{myCharacters.length}</strong> Characters</div>
              <div><strong className="text-secondary text-lg">{favoriteTests.length}</strong> Favorites</div>
            </div>
          </div>
          <div>
            <Button variant="outline" onClick={() => { logout(); setLocation("/"); }}>Logout</Button>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex gap-1 border-b mb-8 pb-px overflow-x-auto">
          {tabs.map(({ key, label, count }) => (
            <button
              key={key}
              className={`pb-2 font-bold px-3 border-b-2 transition-colors shrink-0 text-sm flex items-center gap-1.5 ${tab === key ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              onClick={() => setTab(key)}
            >
              {label}
              {count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : (
          <>
            {/* Tests */}
            {tab === "created" && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {myTests.map((test) => <TestCard key={test.id} test={test} />)}
                </div>
                {myTests.length === 0 && <Empty label="No tests created yet." />}
              </>
            )}

            {/* Universes */}
            {tab === "universes" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {myUniverses.map((u) => (
                    <div key={u.id} className="border rounded-2xl bg-card overflow-hidden hover:border-primary/40 transition-all">
                      <Link href={`/universe/${u.id}`}>
                        <img
                          src={u.coverImage}
                          alt={u.name}
                          onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=1a1a2e&color=7C3AED&size=400&bold=true`; }}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-3">
                          <p className="font-bold text-sm">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.category} · {u.characterCount} characters</p>
                        </div>
                      </Link>
                      <div className="px-3 pb-3">
                        <button
                          onClick={() => setDeleteTarget({ type: "universe", id: u.id })}
                          className="text-xs text-destructive flex items-center gap-1 hover:underline"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {myUniverses.length === 0 && <Empty label="No universes created yet." />}
              </>
            )}

            {/* Characters */}
            {tab === "characters" && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {myCharacters.map((c) => (
                    <div key={c.id} className="border rounded-2xl bg-card overflow-hidden hover:border-primary/40 transition-all">
                      <img
                        src={c.image}
                        alt={c.name}
                        onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=7C3AED&color=fff&size=400&bold=true`; }}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="p-2">
                        <p className="font-bold text-xs truncate">{c.name}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-muted-foreground">{c.wins ?? 0}W {c.losses ?? 0}L</span>
                          <button
                            onClick={() => setDeleteTarget({ type: "character", id: c.id })}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {myCharacters.length === 0 && <Empty label="No characters created yet." />}
              </>
            )}

            {/* Duels */}
            {tab === "duels" && (
              <>
                <div className="space-y-3">
                  {myDuels.map((d) => (
                    <div key={d.id} className="border rounded-2xl bg-card p-4 flex items-center justify-between gap-4">
                      <div className="text-sm font-medium">
                        {d.title || `Duel #${d.id.slice(0, 6)}`}
                        <p className="text-xs text-muted-foreground">{d.votesA + d.votesB} total votes</p>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="text-xs text-muted-foreground">{d.votesA}A · {d.votesB}B</span>
                        <button
                          onClick={() => setDeleteTarget({ type: "duel", id: d.id })}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {myDuels.length === 0 && <Empty label="No duels created yet." />}
              </>
            )}

            {/* Favorites */}
            {tab === "favorites" && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {favoriteTests.map((test) => <TestCard key={test.id} test={test} />)}
                </div>
                {favoriteTests.length === 0 && <Empty label={t("empty_favorites")} />}
              </>
            )}

            {/* Tier Votes */}
            {tab === "tier-votes" && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {myTierVotes.map((vote) => {
                    const char = tierVoteCharMap[vote.characterId];
                    if (!char) return null;
                    return (
                      <div key={vote.id} className="border rounded-2xl bg-card overflow-hidden">
                        <img
                          src={char.image}
                          alt={char.name}
                          onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(char.name)}&background=7C3AED&color=fff&size=400&bold=true`; }}
                          className="w-full aspect-square object-cover"
                        />
                        <div className="p-2 flex items-center justify-between">
                          <p className="font-bold text-xs truncate flex-1">{char.name}</p>
                          <span className={`text-xs font-black px-1.5 py-0.5 rounded ${TIER_COLORS[vote.tier]}`}>
                            {vote.tier}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {myTierVotes.length === 0 && <Empty label="No tier votes yet. Go to the Tierlist to rate characters!" />}
              </>
            )}
          </>
        )}
      </main>

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={t("lbl_confirm_delete")}
        description={t("msg_confirm_delete")}
      />
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="text-muted-foreground text-center py-12 border-2 border-dashed rounded-xl">
      {label}
    </div>
  );
}
