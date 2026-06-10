import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, X, Plus, Loader2 } from "lucide-react";
import { useTranslation } from "../contexts/LanguageContext";
import { CreateCharacterModal } from "./CreateCharacterModal";
import { useCharacters, useUniverses } from "../hooks/useFirestore";
import { useQueryClient } from "@tanstack/react-query";

interface CharacterPoolSelectorProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export function CharacterPoolSelector({ selectedIds, onChange }: CharacterPoolSelectorProps) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [activeUniverse, setActiveUniverse] = useState<string | null>(null);

  const { data: allUniverses = [], isLoading: loadingUniverses } = useUniverses();
  const { data: allCharacters = [], isLoading: loadingChars } = useCharacters(
    activeUniverse ? { seriesId: activeUniverse } : undefined
  );
  const { data: searchResults = [] } = useCharacters(
    searchTerm.length >= 2 ? { search: searchTerm } : undefined
  );

  const selectedCharacters = allCharacters.filter((c) => selectedIds.includes(c.id));
  // Also keep characters from selection that may be from other universes
  const selectedFromSearch = searchTerm.length >= 2
    ? searchResults.filter((c) => selectedIds.includes(c.id))
    : [];

  const addSeries = (seriesId: string) => {
    const toAdd = allCharacters.filter((c) => c.seriesId === seriesId).map((c) => c.id);
    onChange(Array.from(new Set([...selectedIds, ...toAdd])));
  };

  const addChar = (id: string) => {
    if (!selectedIds.includes(id)) onChange([...selectedIds, id]);
  };

  const removeChar = (id: string) => onChange(selectedIds.filter((s) => s !== id));

  // Characters to show in right panel (all characters that are selected)
  const { data: poolCharsRaw = [] } = useCharacters(undefined);
  const poolChars = poolCharsRaw.filter((c) => selectedIds.includes(c.id));

  const displayResults = searchTerm.length >= 2
    ? searchResults.filter((c) => !selectedIds.includes(c.id)).slice(0, 10)
    : allCharacters.filter((c) => !selectedIds.includes(c.id));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Left: Browser */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("ph_search_characters")}
              className="pl-9"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); if (e.target.value) setActiveUniverse(null); }}
            />
          </div>

          {searchTerm.length >= 2 ? (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Search Results</h4>
              {displayResults.length === 0 ? (
                <p className="text-sm text-muted-foreground">No characters found.</p>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
                  {displayResults.map((char) => (
                    <button
                      key={char.id}
                      onClick={() => addChar(char.id)}
                      className="flex items-center gap-2 p-2 rounded-md border hover:border-primary hover:bg-muted text-left transition-colors"
                    >
                      <img src={char.image} alt={char.name}
                        onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(char.name)}&background=7C3AED&color=fff&size=400&bold=true`; }}
                        className="w-8 h-8 rounded object-cover"
                      />
                      <span className="text-sm font-medium truncate flex-1">{char.name}</span>
                      <Plus className="w-4 h-4 text-primary shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Browse by Universe</h4>
              {loadingUniverses ? (
                <div className="flex items-center gap-2 text-muted-foreground text-sm"><Loader2 className="animate-spin" size={14} /> Loading...</div>
              ) : (
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                  {allUniverses.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => setActiveUniverse(activeUniverse === u.id ? null : u.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        activeUniverse === u.id ? "bg-primary text-primary-foreground border-primary" : "hover:border-primary"
                      }`}
                    >
                      {u.name}
                    </button>
                  ))}
                </div>
              )}

              {activeUniverse && (
                <div className="space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      {allUniverses.find(u => u.id === activeUniverse)?.name}
                    </h4>
                    <Button size="sm" variant="ghost" className="text-xs h-6 gap-1" onClick={() => addSeries(activeUniverse)}>
                      <Plus size={12} /> Add all
                    </Button>
                  </div>
                  {loadingChars ? (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm"><Loader2 className="animate-spin" size={14} /> Loading...</div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                      {allCharacters.filter((c) => !selectedIds.includes(c.id)).map((char) => (
                        <button
                          key={char.id}
                          onClick={() => addChar(char.id)}
                          className="flex items-center gap-2 p-2 rounded-md border hover:border-primary hover:bg-muted text-left transition-colors"
                        >
                          <img src={char.image} alt={char.name}
                            onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(char.name)}&background=7C3AED&color=fff&size=400&bold=true`; }}
                            className="w-8 h-8 rounded object-cover"
                          />
                          <span className="text-sm font-medium truncate flex-1">{char.name}</span>
                          <Plus className="w-4 h-4 text-primary shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <Button variant="outline" className="w-full gap-2" onClick={() => setCreateModalOpen(true)}>
            <Plus size={16} /> {t("btn_add_character")}
          </Button>
        </div>

        {/* Right: Pool */}
        <div className="border rounded-xl p-4 bg-muted/30 flex flex-col h-[500px]">
          <div className="flex items-center justify-between mb-4 pb-2 border-b">
            <h3 className="font-bold">{t("lbl_character_pool")}</h3>
            <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">{selectedIds.length}</span>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-2">
            {poolChars.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                Empty pool. Add characters!
              </div>
            ) : (
              poolChars.map((char) => (
                <div key={char.id} className="flex items-center justify-between p-2 bg-card border rounded-lg shadow-sm">
                  <div className="flex items-center gap-3">
                    <img src={char.image} alt={char.name}
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(char.name)}&background=7C3AED&color=fff&size=400&bold=true`; }}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                    <span className="font-medium text-sm">{char.name}</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0" onClick={() => removeChar(char.id)}>
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
          addChar(id);
          qc.invalidateQueries({ queryKey: ["characters"] });
        }}
      />
    </div>
  );
}
