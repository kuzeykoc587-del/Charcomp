import { useState } from "react";
import { useLocation } from "wouter";
import { Header } from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import { guessTasksDb } from "../lib/db";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "../hooks/use-toast";
import { Plus, Minus, HelpCircle, Loader2, CheckCheck, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 6;

export default function GuessTheCreatePage() {
  const { user, roleInfo } = useAuth();
  const [, setLocation] = useLocation();
  const qc = useQueryClient();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [images, setImages] = useState<string[]>(["", "", "", ""]);
  const [answerIndex, setAnswerIndex] = useState(0);
  const [saving, setSaving] = useState(false);

  const canModerate = roleInfo?.canModerate ?? false;

  if (!user) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-muted/20 pb-20 md:pb-0">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="bg-card p-8 rounded-2xl border shadow-lg text-center max-w-sm w-full">
            <h2 className="text-2xl font-black mb-4">Giriş Gerekli</h2>
            <p className="text-muted-foreground mb-8">Tahmin görevi oluşturmak için giriş yapmalısın.</p>
            <Button className="w-full" onClick={() => setLocation("/login")}>Giriş Yap</Button>
          </div>
        </main>
      </div>
    );
  }

  const filledImages = images.filter(Boolean);
  const canSubmit = title.trim().length > 0 && filledImages.length >= MIN_OPTIONS;

  const addOption = () => {
    if (images.length < MAX_OPTIONS) setImages(prev => [...prev, ""]);
  };

  const removeOption = (idx: number) => {
    if (images.length <= MIN_OPTIONS) return;
    const next = images.filter((_, i) => i !== idx);
    setImages(next);
    if (answerIndex >= next.length) setAnswerIndex(next.length - 1);
  };

  const updateImage = (idx: number, val: string) => {
    setImages(prev => prev.map((v, i) => (i === idx ? val : v)));
  };

  const handleSubmit = async () => {
    if (!canSubmit || !user) return;
    setSaving(true);
    try {
      await guessTasksDb.create({
        title: title.trim(),
        images: images.filter(Boolean),
        answerIndex,
        characterIds: [],
        createdBy: user.id,
      });
      qc.invalidateQueries({ queryKey: ["guess-tasks"] });
      toast({ title: "Görev oluşturuldu!", description: "Tahmin görevi başarıyla eklendi." });
      setTitle("");
      setImages(["", "", "", ""]);
      setAnswerIndex(0);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Görev oluşturulamadı.";
      toast({ title: "Hata", description: msg, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-muted/20 pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/create">
            <button className="p-2 rounded-xl hover:bg-muted transition-colors">
              <ArrowLeft size={18} />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <HelpCircle size={22} className="text-green-500" />
              Tahmin Görevi Oluştur
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Görselleri ekle, doğru cevabı işaretle
            </p>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-5 space-y-5 shadow-sm">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold">Karakter / Soru Adı *</label>
            <Input
              placeholder="Örn: Bu karakter kimdir?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={100}
            />
          </div>

          {/* Options */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold">
                Görsel Seçenekler ({images.length}/{MAX_OPTIONS})
              </label>
              <div className="flex gap-1">
                <button
                  onClick={() => removeOption(images.length - 1)}
                  disabled={images.length <= MIN_OPTIONS}
                  className="w-7 h-7 rounded-lg flex items-center justify-center bg-muted hover:bg-muted/80 disabled:opacity-40 transition-colors"
                  title="Seçenek kaldır"
                >
                  <Minus size={13} />
                </button>
                <button
                  onClick={addOption}
                  disabled={images.length >= MAX_OPTIONS}
                  className="w-7 h-7 rounded-lg flex items-center justify-center bg-primary/10 hover:bg-primary/20 text-primary disabled:opacity-40 transition-colors"
                  title="Seçenek ekle"
                >
                  <Plus size={13} />
                </button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Her seçenek için görsel URL gir. Radio butonla doğru cevabı işaretle.
            </p>

            <div className="space-y-2">
              {images.map((img, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="flex flex-col items-center gap-1 pt-2.5">
                    <input
                      type="radio"
                      name="answerIdx"
                      checked={answerIndex === i}
                      onChange={() => setAnswerIndex(i)}
                      title="Doğru cevap"
                      className="accent-primary w-4 h-4 cursor-pointer"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <Input
                      placeholder={`Görsel ${i + 1} URL${i < 2 ? " *" : " (isteğe bağlı)"}`}
                      value={img}
                      onChange={e => updateImage(i, e.target.value)}
                    />
                    {img && (
                      <img
                        src={img}
                        alt={`Option ${i + 1}`}
                        className="w-16 h-16 rounded-lg object-cover border bg-muted"
                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                        onLoad={e => { (e.target as HTMLImageElement).style.display = ""; }}
                      />
                    )}
                  </div>
                  {answerIndex === i && (
                    <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded mt-2.5 shrink-0">
                      Doğru
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Role info */}
          {!canModerate && (
            <div className="bg-muted/50 rounded-xl p-3 text-xs text-muted-foreground">
              Oluşturduğun görevler inceleme için gönderilir. Moderatörler ve yöneticiler sınırsız görev oluşturabilir.
            </div>
          )}

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={saving || !canSubmit}
            className="w-full gap-2"
          >
            {saving ? (
              <><Loader2 size={16} className="animate-spin" /> Kaydediliyor...</>
            ) : (
              <><CheckCheck size={16} /> Görevi Kaydet</>
            )}
          </Button>
        </div>

        {/* Play link */}
        <div className="mt-4 text-center">
          <Link href="/guess-the">
            <span className="text-sm text-primary hover:underline font-medium">
              → Mevcut görevleri oyna
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
}
