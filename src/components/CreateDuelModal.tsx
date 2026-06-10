import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useTranslation } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { duelsDb, duplicateCheck } from "../lib/db";
import { useCharacters } from "../hooks/useFirestore";
import { useToast } from "../hooks/use-toast";
import { Search, Loader2, X } from "lucide-react";

interface CreateDuelModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateDuelModal({ open, onClose, onCreated }: CreateDuelModalProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();

  const [searchA, setSearchA] = useState("");
  const [searchB, setSearchB] = useState("");
  const [charA, setCharA] = useState<any>(null);
  const [charB, setCharB] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const { data: resultsA = [] } = useCharacters(searchA.length >= 2 ? { search: searchA } : undefined);
  const { data: resultsB = [] } = useCharacters(searchB.length >= 2 ? { search: searchB } : undefined);

  const filteredA = resultsA.filter((c) => c.id !== charB?.id).slice(0, 6);
  const filteredB = resultsB.filter((c) => c.id !== charA?.id).slice(0, 6);

  const handleCreate = async () => {
    if (!charA || !charB || !user) return;
    setLoading(true);
    try {
      await duelsDb.create({ characterAId: charA.id, characterBId: charB.id, creatorId: user.id });
      toast({ title: "Success", description: t("msg_duel_created") });
      onCreated();
      setCharA(null);
      setCharB(null);
      setSearchA("");
      setSearchB("");
    } catch {
      toast({ title: "Error", description: "Failed to create duel", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const CharPicker = ({
    label, selected, onSelect, searchVal, onSearch, results,
  }: {
    label: string; selected: any; onSelect: (c: any) => void;
    searchVal: string; onSearch: (v: string) => void; results: any[];
  }) => (
    <div className="space-y-2">
      <p className="text-sm font-bold text-muted-foreground">{label}</p>
      {selected ? (
        <div className="flex items-center gap-3 p-2 border rounded-lg bg-muted/30">
          <img src={selected.image} alt={selected.name}
            onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selected.name)}&background=7C3AED&color=fff&size=400&bold=true`; }}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-bold text-sm flex-1">{selected.name}</span>
          <button onClick={() => onSelect(null)} className="text-muted-foreground hover:text-destructive">
            <X size={16} />
          </button>
        </div>
      ) : (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchVal}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search character..."
              className="pl-9 h-9"
            />
          </div>
          {searchVal.length >= 2 && results.length > 0 && (
            <div className="border rounded-lg overflow-hidden max-h-48 overflow-y-auto">
              {results.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { onSelect(c); onSearch(""); }}
                  className="flex items-center gap-3 p-2 w-full hover:bg-muted transition-colors text-left"
                >
                  <img src={c.image} alt={c.name}
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=7C3AED&color=fff&size=400&bold=true`; }}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium">{c.name}</span>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{t("lbl_create_duel")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <CharPicker
            label={t("lbl_select_char_a")}
            selected={charA}
            onSelect={setCharA}
            searchVal={searchA}
            onSearch={setSearchA}
            results={filteredA}
          />

          <div className="flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center font-black italic text-primary">
              VS
            </div>
          </div>

          <CharPicker
            label={t("lbl_select_char_b")}
            selected={charB}
            onSelect={setCharB}
            searchVal={searchB}
            onSearch={setSearchB}
            results={filteredB}
          />

          <div className="pt-2">
            <Button
              className="w-full gap-2"
              disabled={!charA || !charB || loading}
              onClick={handleCreate}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {t("btn_create_duel")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
