import { useState, useMemo } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, X, Plus, Loader2, ChevronRight } from "lucide-react";
import { useTranslation } from "../contexts/LanguageContext";
import { CreateCharacterModal } from "./CreateCharacterModal";
import { useCharacters, useCharactersByIds, useUniverses } from "../hooks/useFirestore";
import { useQueryClient } from "@tanstack/react-query";
import type { Character } from "../lib/db";

interface CharacterPoolSelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

function CharCard({
  char,
  universeName,
  onAdd,
  onRemove,
  inPool,
}: {
  char: Character;
  universeName?: string;
  onAdd?: () => void;
  onRemove?: () => void;
  inPool?: boolean;
}) {
  return (
    <div
      onClick={inPool ? undefined : onAdd}
      className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
        inPool
          ? "bg-card border-primary/30 bg-primary/5"
          : "cursor-pointer hover:border-primary/50 hover:bg-muted/60 active:scale-[0.98]"
      }`}
    >
      <img
        src={char.image}
        alt={char.name}
        onError={(e) => {
          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(char.name)}&background=7C3AED&color=fff&size=80&bold=true`;
        }}
        className="w-9 h-9 rounded-lg object-cover shrink-0 border"
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold truncate leading-tight">{char.name}</p>
        {universeName && (
          <p className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5">{universeName}</p>
        )}
      </div>
      {inPool ? (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove?.(); }}
          className="shrink-0 text-muted-foreground hover:text-destructive transition-colors p-0.5 rounded"
        >
          <X size={13} />
        </button>
      ) : (
        <Plus size={13} className="text-primary shrink-0 opacity-60" />
      )}
    </div>
  );
}

export function CharacterPoolSelector({ selectedIds, onChange }: CharacterPoolSelectorProps) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [activeUniverseId, setActiveUniverseId] = useState<string | null>(null);

  // Always load universes (small collection)
  const { data: allUniverses = [], isLoading: loadingUniverses } = useUniverses();

  // Universe name map for quick lookups
  const universeNameMap = useMemo(
    () => Object.fromEntries(allUniverses.map((u) => [u.id, u.name])),
    [allUniverses]
  );

  // Load characters only when a universe is selected
  const { data: universeChars = [], isLoading: loadingUniverse } = useCharacters(
    activeUniverseId ? { seriesId: activeUniverseId } : undefined
  );

  // Load characters only when search is active (≥2 chars)
  const { data: searchResults = [], isLoading: loadingSearch } = useCharacters(
    searchTerm.length >= 2 ? { search: searchTerm } : undefined
  );

  // Load selected characters by ID (for pool panel - never fetches all)
  const { data: poolChars = [], isLoading: loadingPool } = useCharactersByIds(selectedIds);

  const addChar = (id: string) => {
    if (!selectedIds.includes(id)) onChange([...selectedIds, id]);
  };

  const removeChar = (id: string) => onChange(selectedIds.filter((s) => s !== id));

  const addAll = () => {
    const toAdd = universeChars.map((c) => c.id);
    onChange(Array.from(new Set([...selectedIds, ...toAdd])));
  };

  // Determine what to display in the browse panel
  const isSearchMode = searchTerm.length >= 2;
  const browseChars = isSearchMode
    ? searchResults
    : activeUniverseId
    ? universeChars
    : [];

  const unselectedBrowse = browseChars.filter((c) => !selectedIds.includes(c.id));
  const loading = isSearchMode ? loadingSearch : loadingUniverse;

  const activeUniverseName = activeUniverseId ? universeNameMap[activeUniverseId] : null;

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wide">
        {t("lbl_character_pool")}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ── Left: Browse panel ─────────────────────────────────── */}
        <div className="space-y-3">

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("ph_search_characters")}
              className="pl-9 h-9"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value.length >= 2) setActiveUniverseId(null);
              }}
            />
          </div>

          {/* Universe pills */}
          {!isSearchMode && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">Browse by Universe</p>
              {loadingUniverses ? (
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <Loader2 className="animate-spin" size={12} /> Loading...
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                  {allUniverses.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => setActiveUniverseId(activeUniverseId === u.id ? null : u.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                        activeUniverseId === u.id
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:border-primary/50 bg-muted/40"
                      }`}
                    >
                      <img
                        src={u.coverImage}
                        alt={u.name}
                        className="w-4 h-4 rounded-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                      {u.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Characters list */}
          <div>
            {/* Header row when universe or search active */}
            {(isSearchMode || activeUniverseId) && (
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground font-medium">
                  {isSearchMode ? `Results for "${searchTerm}"` : activeUniverseName}
                </p>
                {activeUniverseId && !isSearchMode && browseChars.length > 0 && (
                  <button
                    onClick={addAll}
                    className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                  >
                    <Plus size={11} /> Add all ({browseChars.length})
                  </button>
                )}
              </div>
            )}

            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground text-xs py-4 justify-center">
                <Loader2 className="animate-spin" size={14} /> Loading characters...
              </div>
            ) : !isSearchMode && !activeUniverseId ? (
              <div className="text-center py-8 border-2 border-dashed rounded-xl">
                <p className="text-xs text-muted-foreground">Select a universe above to browse characters</p>
              </div>
            ) : unselectedBrowse.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-xs text-muted-foreground">
                  {browseChars.length > 0 ? "All characters from this universe are in your pool!" : "No characters found."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-1.5 max-h-64 overflow-y-auto pr-1">
                {(unselectedBrowse || []).slice(0, 30).map((char) => (
                  <CharCard
                    key={char.id}
                    char={char}
                    universeName={universeNameMap[char.seriesId]}
                    onAdd={() => addChar(char.id)}
                  />
                ))}
                {unselectedBrowse.length > 30 && (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    +{unselectedBrowse.length - 30} more — refine your search
                  </p>
                )}
              </div>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 text-xs h-8"
            onClick={() => setCreateModalOpen(true)}
          >
            <Plus size={13} /> {t("btn_add_character")}
          </Button>
        </div>

        {/* ── Right: Pool panel ──────────────────────────────────── */}
        <div className="border rounded-2xl bg-muted/20 flex flex-col" style={{ minHeight: 280 }}>
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h4 className="font-bold text-sm">{t("lbl_character_pool")}</h4>
            <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
              selectedIds.length >= 2
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}>
              {selectedIds.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {loadingPool ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin text-primary" size={18} />
              </div>
            ) : poolChars.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-8 text-center gap-2">
                <ChevronRight size={24} className="text-muted-foreground/40 rotate-180" />
                <p className="text-xs text-muted-foreground">
                  Pool is empty.<br />Select a universe and click characters to add them.
                </p>
              </div>
            ) : (
              poolChars.map((char) => (
                <CharCard
                  key={char.id}
                  char={char}
                  universeName={universeNameMap[char.seriesId]}
                  onRemove={() => removeChar(char.id)}
                  inPool
                />
              ))
            )}
          </div>

          {selectedIds.length > 0 && (
            <div className="px-4 py-2 border-t">
              <button
                onClick={() => onChange([])}
                className="text-xs text-destructive/70 hover:text-destructive transition-colors font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedIds.length > 0 && selectedIds.length < 2 && (
        <p className="text-xs text-amber-500 font-medium">⚠ Need at least 2 characters</p>
      )}

      <CreateCharacterModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={(id) => {
          addChar(id);
          qc.invalidateQueries({ queryKey: ["characters"] });
          setCreateModalOpen(false);
        }}
      />
    </div>
  );
}
