import { useState } from "react";
import { Image, CheckCheck, Loader2 } from "lucide-react";
import { ImageUpload } from "./ImageUpload";
import { Button } from "./ui/button";
import { testsDb, type Test } from "../lib/db";
import { useAuth } from "../contexts/AuthContext";

interface CoverEditModalProps {
  test: Test;
  onClose: () => void;
  onSaved: () => void;
}

export function CoverEditModal({ test, onClose, onSaved }: CoverEditModalProps) {
  const { user } = useAuth();
  const [coverImage, setCoverImage] = useState(test.coverImage);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      await testsDb.update(test.id, {
        coverImage,
        updatedAt: new Date().toISOString(),
        updatedBy: user.id,
      });
      onSaved();
      onClose();
    } catch {
      setError("Kayıt başarısız. Lütfen tekrar dene.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center p-4 overflow-y-auto bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative bg-card border rounded-2xl shadow-2xl w-full max-w-sm my-4 z-10"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5">
          <h3 className="font-bold text-base mb-1 flex items-center gap-2">
            <Image size={16} className="text-primary" /> Kapak Düzenle
          </h3>
          <p className="text-xs text-muted-foreground mb-4 truncate">{test.title}</p>

          <ImageUpload value={coverImage} onChange={setCoverImage} shape="square" />

          {error && <p className="text-xs text-destructive mt-3">{error}</p>}

          <div className="flex gap-2 mt-5">
            <Button
              onClick={save}
              disabled={saving || !coverImage}
              className="flex-1 gap-1.5"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCheck size={14} />}
              Kaydet
            </Button>
            <Button variant="outline" onClick={onClose} disabled={saving}>
              İptal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
