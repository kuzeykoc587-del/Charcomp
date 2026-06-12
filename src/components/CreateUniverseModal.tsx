import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useTranslation } from "../contexts/LanguageContext";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../contexts/AuthContext";
import { universesDb, duplicateCheck } from "../lib/db";
import { ImageUpload } from "./ImageUpload";
import { Loader2, AlertTriangle } from "lucide-react";
import type { SeriesCategory } from "../lib/seedData";

interface CreateUniverseModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
}

const CATEGORIES: SeriesCategory[] = ["Anime", "TV", "Movie", "Game", "Comic", "Book", "Other"];

export function CreateUniverseModal({ open, onClose, onCreated }: CreateUniverseModalProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<SeriesCategory>("Other");
  const [loading, setLoading] = useState(false);
  const [dupWarning, setDupWarning] = useState(false);

  useEffect(() => {
    if (open) {
      setName("");
      setCoverImage("");
      setDescription("");
      setCategory("Other");
      setDupWarning(false);
    }
  }, [open]);

  const checkDuplicate = async () => {
    if (!name.trim()) return;
    try {
      const dup = await duplicateCheck.universe(name.trim());
      setDupWarning(Boolean(dup));
    } catch {
      setDupWarning(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const id = await universesDb.create({
        name: name.trim(),
        coverImage: coverImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1a1a2e&color=7C3AED&size=400&bold=true`,
        description,
        category,
        creatorId: user?.id ?? "anonymous",
      });
      toast({ title: "Success", description: t("msg_universe_created") });
      onCreated(id);
      onClose();
    } catch {
      toast({ title: "Error", description: "Failed to create universe", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{t("lbl_create_universe")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <ImageUpload value={coverImage} onChange={setCoverImage} />
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>{t("ph_universe_name")}</Label>
                <Input
                  value={name}
                  onChange={(e) => { setName(e.target.value); if (dupWarning) setDupWarning(false); }}
                  onBlur={checkDuplicate}
                  required
                />
                {dupWarning && (
                  <p className="text-amber-500 text-xs flex items-center gap-1">
                    <AlertTriangle size={12} /> {t("msg_duplicate_warning")}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label>Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as SeriesCategory)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c === "Book" ? t("cat_book") : c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description (optional)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("ph_universe_desc")}
              rows={2}
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || loading} className="gap-2">
              {loading && <Loader2 size={14} className="animate-spin" />}
              {t("btn_publish")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
