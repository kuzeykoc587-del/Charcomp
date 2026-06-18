import { useParams, Link } from "wouter";
import { useState } from "react";
import { Header } from "../components/Header";
import { useTranslation } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ImageUpload } from "../components/ImageUpload";
import { Plus, ArrowLeft, Loader2, Pencil, Globe, CheckCheck } from "lucide-react";
import { CreateCharacterModal } from "../components/CreateCharacterModal";
import { useUniverse, useCharacters } from "../hooks/useFirestore";
import { useQueryClient } from "@tanstack/react-query";
import { universesDb } from "../lib/db";
import type { Universe } from "../lib/db";
import type { SeriesCategory } from "../lib/seedData";

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
    } catch {
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

export default function UniverseDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { roleInfo } = useAuth();
  const qc = useQueryClient();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const { data: universe, isLoading: loadingUniverse } = useUniverse(id);
  const { data: chars = [], isLoading: loadingChars } = useCharacters(id ? { seriesId: id } : undefined);

  const isAdmin = roleInfo?.isAdmin ?? false;

  if (loadingUniverse) {
    return (
      <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={32} />
        </main>
      </div>
    );
  }

  if (!universe) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-muted/20 pb-20 md:pb-0">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="text-4xl font-black mb-4">Universe Not Found</h1>
          <Link href="/universes">
            <Button size="lg" className="gap-2"><ArrowLeft size={18} /> Back to Universes</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
      <Header />

      {editOpen && (
        <UniverseEditModal
          universe={universe}
          onClose={() => setEditOpen(false)}
          onSaved={() => {
            qc.invalidateQueries({ queryKey: ["universes"] });
            qc.invalidateQueries({ queryKey: ["universe", id] });
            qc.invalidateQueries({ queryKey: ["admin-universes-status"] });
          }}
        />
      )}

      <div className="relative h-64 md:h-80 w-full">
        <div className="absolute inset-0 bg-background" />
        <img src={universe.coverImage} alt={universe.name} className="absolute inset-0 w-full h-full object-cover opacity-50 blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />

        <div className="absolute inset-0 container mx-auto px-4 flex flex-col justify-end pb-8">
          <div className="flex flex-col md:flex-row gap-6 md:items-end">
            <img
              src={universe.coverImage}
              alt={universe.name}
              onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(universe.name)}&background=0D0D0F&color=7C3AED&size=400&bold=true`; }}
              className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover shadow-2xl border-4 border-background"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-background/90 border text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                  {universe.category}
                </span>
                <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                  {chars.length} {t("lbl_characters_count")}
                </span>
                {universe.status && universe.status !== "published" && (
                  <span className="bg-amber-500/20 text-amber-500 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                    {universe.status}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-black mb-2 leading-tight drop-shadow-md">{universe.name}</h1>
              <p className="text-muted-foreground line-clamp-2">{universe.description}</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              {isAdmin && (
                <Button
                  onClick={() => setEditOpen(true)}
                  variant="outline"
                  className="gap-2 bg-background/80 backdrop-blur-sm"
                >
                  <Pencil size={16} /> Düzenle
                </Button>
              )}
              <Button onClick={() => setCreateModalOpen(true)} className="gap-2">
                <Plus size={16} /> {t("lbl_create_character")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/universes" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1 inline-flex">
            <ArrowLeft size={14} /> Back to Universes
          </Link>
        </div>

        {loadingChars ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : chars.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-xl">
            {t("empty_characters")}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {chars.map((char) => (
              <div key={char.id} className="relative flex flex-col overflow-hidden rounded-xl border group hover:border-primary transition-colors">
                <div className="aspect-[2/3] w-full bg-muted">
                  <img
                    src={char.image}
                    alt={char.name}
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(char.name)}&background=7C3AED&color=fff&size=400&bold=true`; }}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                  <h3 className="font-bold text-white text-sm leading-tight drop-shadow-sm line-clamp-1">{char.name}</h3>
                  {char.description && (
                    <p className="text-white/70 text-[10px] line-clamp-1 mt-0.5">{char.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <CreateCharacterModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        defaultSeriesId={id}
        onCreated={() => {
          setCreateModalOpen(false);
          qc.invalidateQueries({ queryKey: ["characters"] });
          qc.invalidateQueries({ queryKey: ["universe", id] });
        }}
      />
    </div>
  );
}
