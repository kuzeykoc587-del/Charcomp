import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { Header } from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { ImageUpload } from "../components/ImageUpload";
import {
  Loader2, ArrowLeft, Shuffle, Plus, Trash2, GripVertical,
  Image, AlertTriangle, CheckCircle2
} from "lucide-react";
import { thisOrThatDb, type TotOption } from "../lib/db";
import { useToast } from "../hooks/use-toast";

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

interface OptionDraft {
  id: string;
  text: string;
  imageUrl: string;
  description: string;
  showImageInput: boolean;
}

function OptionRow({
  opt,
  index,
  total,
  onChange,
  onRemove,
}: {
  opt: OptionDraft;
  index: number;
  total: number;
  onChange: (id: string, patch: Partial<OptionDraft>) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="bg-muted/40 border rounded-xl p-3 space-y-2">
      <div className="flex items-center gap-2">
        <GripVertical size={14} className="text-muted-foreground shrink-0" />
        <span className="text-xs text-muted-foreground font-mono w-6 shrink-0">{index + 1}.</span>
        <Input
          value={opt.text}
          onChange={e => onChange(opt.id, { text: e.target.value })}
          placeholder="Seçenek metni..."
          className="flex-1 h-8 text-sm"
        />
        <button
          onClick={() => onChange(opt.id, { showImageInput: !opt.showImageInput })}
          className={`p-1.5 rounded-lg transition-colors ${opt.imageUrl || opt.showImageInput ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground hover:text-foreground"}`}
          title="Görsel ekle"
        >
          <Image size={14} />
        </button>
        {total > 2 && (
          <button
            onClick={() => onRemove(opt.id)}
            className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-colors"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {(opt.showImageInput || opt.imageUrl) && (
        <div className="pl-8 space-y-2">
          <ImageUpload
            value={opt.imageUrl}
            onChange={url => onChange(opt.id, { imageUrl: url })}
            shape="square"
          />
        </div>
      )}

      <div className="pl-8">
        <Input
          value={opt.description}
          onChange={e => onChange(opt.id, { description: e.target.value })}
          placeholder="Açıklama (isteğe bağlı)..."
          className="h-7 text-xs"
        />
      </div>
    </div>
  );
}

export default function ThisOrThatCreatePage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [category, setCategory] = useState("");
  const [publishing, setPublishing] = useState(false);

  const [options, setOptions] = useState<OptionDraft[]>([
    { id: genId(), text: "", imageUrl: "", description: "", showImageInput: false },
    { id: genId(), text: "", imageUrl: "", description: "", showImageInput: false },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  if (!user) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-muted/20 pb-20 md:pb-0">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="bg-card p-8 rounded-2xl border shadow-lg text-center max-w-sm w-full">
            <h2 className="text-2xl font-black mb-4">Giriş Gerekli</h2>
            <p className="text-muted-foreground mb-8">Bu mu O mu oyunu oluşturmak için giriş yapmalısın.</p>
            <Button className="w-full" onClick={() => setLocation("/login")}>Giriş Yap</Button>
          </div>
        </main>
      </div>
    );
  }

  const updateOption = (id: string, patch: Partial<OptionDraft>) => {
    setOptions(prev => prev.map(o => o.id === id ? { ...o, ...patch } : o));
  };

  const removeOption = (id: string) => {
    setOptions(prev => prev.filter(o => o.id !== id));
  };

  const addOption = () => {
    setOptions(prev => [
      ...prev,
      { id: genId(), text: "", imageUrl: "", description: "", showImageInput: false },
    ]);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const filledOptions = options.filter(o => o.text.trim().length > 0);
  const emptyOptions = options.filter(o => o.text.trim().length === 0);
  const duplicates = new Set(
    filledOptions.map(o => o.text.trim().toLowerCase()).filter((t, i, arr) => arr.indexOf(t) !== i)
  );
  const canPublish = filledOptions.length >= 2 && emptyOptions.length === 0 && title.trim().length > 0;

  const handlePublish = async () => {
    if (!canPublish) return;
    setPublishing(true);
    try {
      const totOptions: TotOption[] = options.map(o => ({
        id: o.id,
        text: o.text.trim(),
        imageUrl: o.imageUrl.trim() || undefined,
        description: o.description.trim() || undefined,
      }));
      const id = await thisOrThatDb.create({
        title: title.trim(),
        description: description.trim() || undefined,
        coverImage: coverImage.trim() || undefined,
        category: category.trim() || undefined,
        creatorId: user.id,
        options: totOptions,
        status: "published",
      });
      toast({ title: "Bu mu O mu oyunu oluşturuldu!" });
      setLocation(`/this-or-that/${id}`);
    } catch {
      toast({ title: "Hata", description: "Oyun oluşturulamadı.", variant: "destructive" });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-muted/20 pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setLocation("/this-or-that")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
          </button>
          <Shuffle size={22} className="text-sky-400" />
          <h1 className="text-2xl font-black">Bu mu O mu Oluştur</h1>
        </div>

        <div className="space-y-5">
          {/* Game info */}
          <div className="bg-card border rounded-2xl p-5 space-y-4">
            <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-wide">Oyun Bilgisi</h2>

            <div className="space-y-2">
              <Label>Başlık *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Oyunun başlığı..."
              />
            </div>

            <div className="space-y-2">
              <Label>Açıklama (isteğe bağlı)</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Kısa bir açıklama..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Kapak Görseli (isteğe bağlı)</Label>
              <ImageUpload value={coverImage} onChange={setCoverImage} shape="square" />
            </div>

            <div className="space-y-2">
              <Label>Kategori (isteğe bağlı)</Label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Hayat, Yemek, Nostalji, Karakter..."
              />
            </div>
          </div>

          {/* Option pool */}
          <div className="bg-card border rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-wide">Seçenek Havuzu</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {options.length} seçenek
                  {options.length < 10 && (
                    <span className="text-amber-500 ml-1.5">· İyi oynanabilirlik için en az 10 seçenek önerilir</span>
                  )}
                  {options.length >= 10 && (
                    <span className="text-green-500 ml-1.5">· İyi havuz boyutu</span>
                  )}
                </p>
              </div>
              <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded-lg">
                {filledOptions.length} dolu
              </span>
            </div>

            {duplicates.size > 0 && (
              <div className="flex items-center gap-2 text-amber-500 text-xs bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
                <AlertTriangle size={14} />
                Tekrar eden seçenek metni var.
              </div>
            )}

            <div className="space-y-2">
              {options.map((opt, idx) => (
                <OptionRow
                  key={opt.id}
                  opt={opt}
                  index={idx}
                  total={options.length}
                  onChange={updateOption}
                  onRemove={removeOption}
                />
              ))}
            </div>

            <div ref={bottomRef} />

            <Button
              variant="outline"
              className="w-full gap-2 border-dashed"
              onClick={addOption}
            >
              <Plus size={16} /> Seçenek Ekle
            </Button>
          </div>

          {/* Validation feedback */}
          {!canPublish && (title.trim() || filledOptions.length > 0) && (
            <div className="bg-muted/50 border rounded-xl p-3 space-y-1 text-xs text-muted-foreground">
              {!title.trim() && <p className="flex items-center gap-1.5"><AlertTriangle size={12} className="text-amber-500" /> Başlık zorunludur.</p>}
              {emptyOptions.length > 0 && <p className="flex items-center gap-1.5"><AlertTriangle size={12} className="text-amber-500" /> {emptyOptions.length} boş seçenek var — doldurun veya silin.</p>}
              {filledOptions.length < 2 && <p className="flex items-center gap-1.5"><AlertTriangle size={12} className="text-amber-500" /> En az 2 seçenek gereklidir.</p>}
            </div>
          )}

          {canPublish && (
            <div className="flex items-center gap-2 text-green-500 text-xs bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2">
              <CheckCircle2 size={14} />
              Yayınlamaya hazır — {filledOptions.length} seçenekle {filledOptions.length - 1} karşılaştırma yapılacak.
            </div>
          )}

          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => setLocation("/this-or-that")}>İptal</Button>
            <Button onClick={handlePublish} disabled={!canPublish || publishing} className="gap-2">
              {publishing && <Loader2 size={16} className="animate-spin" />}
              Yayınla
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
