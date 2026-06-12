import { useState } from "react";
import { useLocation } from "wouter";
import { Header } from "../components/Header";
import { useTranslation } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { tierListsDb } from "../lib/db";
import { CharacterPoolSelector } from "../components/CharacterPoolSelector";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { ImageUpload } from "../components/ImageUpload";
import { Loader2, Plus, X, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useToast } from "../hooks/use-toast";

const DEFAULT_TIERS = ["S", "A", "B", "C", "D"];

export default function CreateTierListPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tierNames, setTierNames] = useState<string[]>([...DEFAULT_TIERS]);
  const [newTierName, setNewTierName] = useState("");
  const [characterIds, setCharacterIds] = useState<string[]>([]);
  const [publishing, setPublishing] = useState(false);

  if (!user) {
    setLocation("/login");
    return null;
  }

  const addTier = () => {
    const name = newTierName.trim();
    if (!name || tierNames.includes(name)) return;
    setTierNames(prev => [...prev, name]);
    setNewTierName("");
  };

  const removeTier = (name: string) => {
    if (tierNames.length <= 1) return;
    setTierNames(prev => prev.filter(t => t !== name));
  };

  const TIER_COLORS: Record<string, string> = {
    S: "bg-red-500", A: "bg-orange-400", B: "bg-yellow-400",
    C: "bg-green-400", D: "bg-blue-400", E: "bg-purple-400", F: "bg-gray-400",
  };
  const tierColor = (name: string) => TIER_COLORS[name.toUpperCase()] ?? "bg-indigo-400";

  const handlePublish = async () => {
    if (!title.trim()) { toast({ title: "Başlık gereklidir", variant: "destructive" }); return; }
    if (tierNames.length < 1) { toast({ title: "En az 1 tier satırı gereklidir", variant: "destructive" }); return; }
    if (characterIds.length < 2) { toast({ title: "En az 2 karakter seçin", variant: "destructive" }); return; }

    setPublishing(true);
    try {
      const id = await tierListsDb.create({
        title: title.trim(),
        description: description.trim(),
        coverImage: coverImage.trim(),
        creatorId: user.id,
        tierNames,
        characterIds,
      });
      toast({ title: t("msg_tierlist_created") });
      setLocation(`/tierlist/${id}`);
    } catch {
      toast({ title: "Yayınlanamadı", variant: "destructive" });
    } finally {
      setPublishing(false);
    }
  };

  const steps = [
    t("lbl_step_1"),
    t("lbl_step_tiers"),
    t("lbl_step_2"),
    t("lbl_step_3"),
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-3xl">

        <button
          onClick={() => setLocation("/create")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Oluştur
        </button>

        <h1 className="text-2xl font-black mb-6">{t("btn_create_tierlist")}</h1>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((label, i) => {
            const n = i + 1;
            const active = step === n;
            const done = step > n;
            return (
              <div key={n} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  done ? "bg-primary text-primary-foreground" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {done ? <Check size={12} /> : n}
                </div>
                <span className={`text-xs hidden sm:block ${active ? "font-semibold" : "text-muted-foreground"}`}>{label}</span>
                {i < steps.length - 1 && <div className="w-6 h-px bg-muted" />}
              </div>
            );
          })}
        </div>

        {/* Step 1: Basic info */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">{t("ph_tierlist_title")}</label>
              <Input
                placeholder={t("ph_tierlist_title")}
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">{t("ph_tierlist_desc")}</label>
              <Textarea
                placeholder={t("ph_tierlist_desc")}
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Kapak Görseli</label>
              <ImageUpload value={coverImage} onChange={url => setCoverImage(url)} />
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={() => setStep(2)} disabled={!title.trim()} className="gap-2">
                {t("btn_next")} <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Tier names */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Tier satırlarını özelleştirin. Her satır bir seviyeyi temsil eder.</p>

            <div className="space-y-2">
              {tierNames.map((tier, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`${tierColor(tier)} w-10 h-10 rounded flex items-center justify-center font-black text-white shrink-0`}>
                    {tier}
                  </div>
                  <span className="flex-1 font-medium">{tier}</span>
                  <button
                    onClick={() => removeTier(tier)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    disabled={tierNames.length <= 1}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder={t("lbl_tier_name")}
                value={newTierName}
                onChange={e => setNewTierName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addTier()}
                className="flex-1"
                maxLength={10}
              />
              <Button variant="outline" onClick={addTier} disabled={!newTierName.trim()} className="gap-1">
                <Plus size={14} /> {t("lbl_add_tier")}
              </Button>
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                <ArrowLeft size={16} /> Geri
              </Button>
              <Button onClick={() => setStep(3)} disabled={tierNames.length < 1} className="gap-2">
                {t("btn_next")} <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Build character pool */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Bu tier listede sıralanacak karakterleri seçin.</p>
            <CharacterPoolSelector selectedIds={characterIds} onChange={setCharacterIds} />
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(2)} className="gap-2">
                <ArrowLeft size={16} /> Geri
              </Button>
              <Button onClick={() => setStep(4)} disabled={characterIds.length < 2} className="gap-2">
                {t("btn_next")} <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Preview & publish */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="border rounded-xl overflow-hidden">
              {coverImage && (
                <div className="aspect-video bg-muted">
                  <img src={coverImage} alt={title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-black">{title}</h2>
                {description && <p className="text-muted-foreground mt-1">{description}</p>}
                <div className="flex gap-2 mt-3 flex-wrap">
                  {tierNames.map(t => (
                    <span key={t} className={`${tierColor(t)} text-white text-xs font-bold px-2 py-1 rounded`}>{t}</span>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">{characterIds.length} karakter</p>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(3)} className="gap-2">
                <ArrowLeft size={16} /> Geri
              </Button>
              <Button onClick={handlePublish} disabled={publishing} className="gap-2">
                {publishing ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />}
                {t("btn_publish")}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
