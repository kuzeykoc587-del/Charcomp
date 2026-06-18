import { useState } from "react";
import { Link } from "wouter";
import { useTranslation } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { universesDb } from "../lib/db";
import { ImageUpload } from "./ImageUpload";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, CheckCheck, Pencil, Globe } from "lucide-react";
import type { Universe } from "../lib/db";
import type { SeriesCategory } from "../lib/seedData";

interface UniverseCardProps {
  series: Universe;
  characterCount?: number;
}

const CATEGORIES: SeriesCategory[] = ["Anime", "TV", "Movie", "Game", "Comic", "Book", "Other"];

function UniverseEditModal({ universe, onClose, onSaved }: { universe: Universe; onClose: () => void; onSaved: () => void }) {
  const { user } = useAuth();
  const [name, setName] = useState(universe.name);
  const [description, setDescription] = useState(universe.description);
  const [coverImage, setCoverImage] = useState(universe.coverImage);
  const [category, setCategory] = useState<SeriesCategory>(universe.category);
  const [status, setStatus] = useState<NonNullable<Universe["status"]>>(universe.status ?? "published");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    if (!user || !name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await universesDb.update(universe.id, {
        name: name.trim(),
        description: description.trim(),
        coverImage,
        category,
        status,
        updatedAt: new Date().toISOString(),
        updatedBy: user.id,
      });
      onSaved();
      onClose();
    } catch (e) {
      setError("Kayıt başarısız. Lütfen tekrar dene.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center p-4 overflow-y-auto bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative bg-card border rounded-2xl shadow-2xl w-full max-w-lg my-8 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5">
          <h3 className="font-bold text-base mb-4 flex items-center gap-2">
            <Globe size={16} /> Evren Düzenle
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Ad *</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Açıklama</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full text-sm bg-muted border rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Kapak Görseli</label>
              <ImageUpload value={coverImage} onChange={setCoverImage} shape="square" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SeriesCategory)}
                className="w-full text-sm bg-muted border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Durum</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as NonNullable<Universe["status"]>)}
                className="w-full text-sm bg-muted border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="published">Yayınlanan</option>
                <option value="pending">Bekleyen</option>
                <option value="hidden">Gizli</option>
                <option value="rejected">Reddedilen</option>
              </select>
            </div>
          </div>
          {error && <p className="text-xs text-destructive mt-3">{error}</p>}
          <div className="flex gap-2 mt-5">
            <Button onClick={save} disabled={saving || !name.trim()} className="flex-1 gap-1.5">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCheck size={14} />} Kaydet
            </Button>
            <Button variant="outline" onClick={onClose} disabled={saving}>İptal</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function UniverseCard({ series, characterCount }: UniverseCardProps) {
  const { t } = useTranslation();
  const { roleInfo } = useAuth();
  const qc = useQueryClient();
  const count = characterCount ?? series.characterCount ?? 0;
  const [editOpen, setEditOpen] = useState(false);

  const isAdmin = roleInfo?.isAdmin ?? false;

  return (
    <>
      {editOpen && (
        <UniverseEditModal
          universe={series}
          onClose={() => setEditOpen(false)}
          onSaved={() => {
            qc.invalidateQueries({ queryKey: ["universes"] });
            qc.invalidateQueries({ queryKey: ["universe", series.id] });
            qc.invalidateQueries({ queryKey: ["admin-universes-status"] });
          }}
        />
      )}
      <div className="relative">
        {isAdmin && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setEditOpen(true);
            }}
            title="Düzenle"
            className="absolute top-2 right-2 z-30 flex items-center justify-center w-7 h-7 rounded-full bg-black/70 hover:bg-primary text-white transition-colors shadow-md"
            aria-label="Evreni düzenle"
          >
            <Pencil size={13} />
          </button>
        )}
        <Link href={`/universe/${series.id}`}>
          <div className="group relative flex flex-col rounded-xl bg-card border border-border overflow-hidden transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer">
            <div className="relative aspect-square w-full overflow-hidden bg-muted">
              <img
                src={series.coverImage}
                alt={series.name}
                onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(series.name)}&background=0D0D0F&color=7C3AED&size=400&bold=true`; }}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute top-2 left-2 z-20">
                <span className="bg-background/90 backdrop-blur-sm text-xs px-2 py-1 rounded-md font-medium shadow-sm border">
                  {series.category}
                </span>
              </div>
              <div className="absolute bottom-2 right-2 z-20">
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-bold shadow-sm">
                  {count} {t("lbl_characters_count")}
                </span>
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-bold text-base line-clamp-1">{series.name}</h3>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}
