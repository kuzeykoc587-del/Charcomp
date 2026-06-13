import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, X, Plus, Loader2 } from "lucide-react";
import { useTranslation } from "../contexts/LanguageContext";
import { CreateCharacterModal } from "./CreateCharacterModal";
import { useCharacters, useUniverses, useCharactersByIds } from "../hooks/useFirestore";
import type { Character } from "../lib/db";
import { useQueryClient } from "@tanstack/react-query";

interface CharacterPoolSelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

const FALLBACK = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7C3AED&color=fff&size=400&bold=true`;

export function CharacterPoolSelector({ selectedIds, onChange }: CharacterPoolSelectorProps) {
  const { t } = useTranslation();
  const qc = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [activeUniverse, setActiveUniverse] = useState<string | null>(null);

  // Local cache: id → full Character object.
  // This is the sole source of truth for the pool panel.
  // Characters are stored the moment they are clicked — instant and persistent
  // across universe/search mode switches.
  const [charCache, setCharCache] = useState<Map<string, Character>>(new Map());

  // ── Firestore queries ──────────────────────────────────────────────────────

  const { data: allUniverses = [], isLoading: loadingUniverses } = useUniverses();

  const { data: browseChars = [], isLoading: loadingBrowse } = useCharacters(
    activeUniverse ? { seriesId: activeUniverse } : undefined
  );

  const { data: searchResults = [], isLoading: loadingSearch } = useCharacters(
    searchTerm.length >= 2 ? { search: searchTerm } : undefined
  );

  // Hydrate cache for selectedIds not yet stored locally
  // (covers pre-existing IDs when editing a test, and newly created characters).
  const idsNotCached = selectedIds.filter((id) => !charCache.has(id));
  const { data: hydratedChars = [] } = useCharactersByIds(idsNotCached);

  useEffect(() => {
    if (hydratedChars.length === 0) return;
    setCharCache((prev) => {
      const next = new Map(prev);
      hydratedChars.forEach((c) => next.set(c.id, c));
      return next;
    });
  }, [hydratedChars]);

  // ── Universe name lookup ───────────────────────────────────────────────────

  const universeMap = new Map(allUniverses.map((u) => [u.id, u.name]));

  // ── Mutations ─────────────────────────────────────────────────────────────

  const addChar = (char: Character) => {
    if (selectedIds.includes(char.id)) return;
    setCharCache((prev) => new Map(prev).set(char.id, char));
    onChange([...selectedIds, char.id]);
  };

  const removeChar = (id: string) => {
    setCharCache((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
    onChange(selectedIds.filter((s) => s !== id));
  };

  // ── Derived display lists ──────────────────────────────────────────────────

  // Pool: ordered by insertion order (selectedIds order), resolved from cache.
  const poolChars = selectedIds
    .map((id) => charCache.get(id))
    .filter((c): c is Character => Boolean(c));

  // Browse panel: exclude already-selected characters.
  const displayChars =
    searchTerm.length >= 2
      ? searchResults.filter((c) => !selectedIds.includes(c.id))
      : browseChars.filter((c) => !selectedIds.includes(c.id));

  const isSearching = searchTerm.length >= 2;

  // ── Shared card renderer ───────────────────────────────────────────────────

  function CharCard({ char }: { char: Character }) {
    return (
      <button
        onClick={() => addChar(char)}
        className="flex items-center gap-2 p-2 rounded-lg border hover:border-primary hover:bg-muted text-left transition-colors w-full"
      >
        <img
          src={char.image}
          alt={char.name}
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK(char.name); }}
          className="w-9 h-9 rounded-md object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate leading-tight">{char.name}</p>
          <p className="text-[11px] text-muted-foreground truncate leading-tight">
            {universeMap.get(char.seriesId) ?? char.seriesId}
          </p>
        </div>
        <Plus className="w-4 h-4 text-primary shrink-0" />
      </button>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ── Left: Browse / Search ─────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("ph_search_characters")}
              className="pl-9"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value) setActiveUniverse(null);
              }}
            />
          </div>

          {/* Search results */}
          {isSearching ? (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Search Results</h4>
              {loadingSearch ? (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Loader2 className="animate-spin" size={14} /> Searching...
                </div>
              ) : displayChars.length === 0 ? (
                <p className="text-sm text-muted-foreground">No characters found.</p>
              ) : (
                <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                  {displayChars.map((char) => (
                    <CharCard key={char.id} char={char} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Universe browser */
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Browse by Universe</h4>

              {loadingUniverses ? (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Loader2 className="animate-spin" size={14} /> Loading...
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                  {allUniverses.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => setActiveUniverse(activeUniverse === u.id ? null : u.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        activeUniverse === u.id
                          ? "bg-primary text-primary-foreground border-primary"
                          : "hover:border-primary"
                      }`}
                    >
                      {u.name}
                    </button>
                  ))}
                </div>
              )}

              {activeUniverse && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    {universeMap.get(activeUniverse)}
                  </h4>

                  {loadingBrowse ? (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Loader2 className="animate-spin" size={14} /> Loading...
                    </div>
                  ) : displayChars.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      All characters from this universe are already in the pool.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                      {displayChars.map((char) => (
                        <CharCard key={char.id} char={char} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => setCreateModalOpen(true)}
          >
            <Plus size={16} /> {t("btn_add_character")}
          </Button>
        </div>

        {/* ── Right: Selected Pool ───────────────────────────────────────── */}
        <div className="border rounded-xl p-4 bg-muted/30 flex flex-col h-[500px]">
          <div className="flex items-center justify-between mb-4 pb-2 border-b">
            <h3 className="font-bold">{t("lbl_character_pool")}</h3>
            <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
              {selectedIds.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-2">
            {poolChars.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm text-center px-4">
                Empty pool — tap a character on the left to add it.
              </div>
            ) : (
              poolChars.map((char) => (
                <div
                  key={char.id}
                  className="flex items-center gap-3 p-2 bg-card border rounded-lg shadow-sm"
                >
                  <img
                    src={char.image}
                    alt={char.name}
                    onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK(char.name); }}
                    className="w-10 h-10 rounded-md object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate leading-tight">{char.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate leading-tight">
                      {universeMap.get(char.seriesId) ?? char.seriesId}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                    onClick={() => removeChar(char.id)}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <CreateCharacterModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={(id) => {
          // Character was just created — add its ID to the pool.
          // The useCharactersByIds hydration hook will resolve the full object
          // and populate charCache automatically via the useEffect above.
          if (!selectedIds.includes(id)) {
            onChange([...selectedIds, id]);
          }
          qc.invalidateQueries({ queryKey: ["characters"] });
        }}
      />
    </div>
  );
}
