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
import { charactersDb, duplicateCheck } from "../lib/db";
import { useUniverses } from "../hooks/useFirestore";
import { ImageUpload } from "./ImageUpload";
import { Loader2, AlertTriangle } from "lucide-react";

interface CreateCharacterModalProps {
  open: boolean;
  onClose: () => void;
  defaultSeriesId?: string;
  onCreated: (charId: string) => void;
}

export function CreateCharacterModal({ open, onClose, defaultSeriesId, onCreated }: CreateCharacterModalProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [seriesId, setSeriesId] = useState(defaultSeriesId || "");
  const [loading, setLoading] = useState(false);
  const [dupWarning, setDupWarning] = useState(false);

  const { data: universes = [] } = useUniverses();

  useEffect(() => {
    if (open) { setName(""); setImage(""); setDescription(""); setSeriesId(defaultSeriesId || ""); setDupWarning(false); }
  }, [open, defaultSeriesId]);

  const checkDuplicate = async () => {
    if (!name || !seriesId) return;
    const isDup = await duplicateCheck.character(name, seriesId);
    setDupWarning(isDup);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !seriesId) return;
    setLoading(true);
    try {
      const id = await charactersDb.create({
        name,
        image: image || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7C3AED&color=fff&size=400&bold=true`,
        description,
        seriesId,
        tags: [],
        creatorId: user?.id ?? "anonymous",
      });
      toast({ title: "Success", description: t("msg_character_created") });
      onCreated(id);
      onClose();
    } catch {
      toast({ title: "Error", description: "Failed to create character", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{t("lbl_create_character")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <ImageUpload value={image} onChange={setImage} shape="portrait" />
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>{t("ph_char_name")}</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                <Label>{t("lbl_select_series")}</Label>
                <Select value={seriesId} onValueChange={setSeriesId} required>
                  <SelectTrigger><SelectValue placeholder="Select Universe" /></SelectTrigger>
                  <SelectContent className="max-h-48">
                    {universes.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description (optional)</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" disabled={!name || !seriesId || loading} className="gap-2">
              {loading && <Loader2 size={14} className="animate-spin" />}
              {t("btn_publish")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
