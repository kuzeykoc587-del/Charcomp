import { useState } from "react";
import { useLocation } from "wouter";
import { Header } from "../components/Header";
import { useTranslation } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { CharacterPoolSelector } from "../components/CharacterPoolSelector";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Loader2, ArrowLeft, LayoutList, Plus, X, GripVertical } from "lucide-react";
import { tierListsDb, DEFAULT_TIERS, type TierListRow } from "../lib/db";
import { useToast } from "../hooks/use-toast";

const PRESET_COLORS = ["#f59e0b", "#f97316", "#3b82f6", "#22c55e", "#94a3b8", "#ec4899", "#8b5cf6", "#ef4444"];

export default function TierListCreatePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tiers, setTiers] = useState<TierListRow[]>([...DEFAULT_TIERS]);
  const [pool, setPool] = useState<string[]>([]);
  const [publishing, setPublishing] = useState(false);
  const [newTierName, setNewTierName] = useState("");

  if (!user) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-muted/20 pb-20 md:pb-0">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="bg-card p-8 rounded-2xl border shadow-lg text-center max-w-sm w-full">
            <h2 className="text-2xl font-black mb-4">Login Required</h2>
            <p className="text-muted-foreground mb-8">You need to log in to create tier lists.</p>
            <Button className="w-full" onClick={() => setLocation("/login")}>Go to Login</Button>
          </div>
        </main>
      </div>
    );
  }

  const addTier = () => {
    const name = newTierName.trim() || `Tier ${tiers.length + 1}`;
    const color = PRESET_COLORS[tiers.length % PRESET_COLORS.length];
    setTiers([...tiers, { name, color }]);
    setNewTierName("");
  };

  const removeTier = (i: number) => {
    setTiers(tiers.filter((_, idx) => idx !== i));
  };

  const updateTierName = (i: number, name: string) => {
    setTiers(tiers.map((t, idx) => idx === i ? { ...t, name } : t));
  };

  const updateTierColor = (i: number, color: string) => {
    setTiers(tiers.map((t, idx) => idx === i ? { ...t, color } : t));
  };

  const handlePublish = async () => {
    if (!title.trim() || tiers.length < 2 || pool.length < 2) {
      toast({ title: "Error", description: "Title, at least 2 tiers, and at least 2 characters are required.", variant: "destructive" });
      return;
    }
    setPublishing(true);
    try {
      const id = await tierListsDb.create({
        title: title.trim(),
        description: description.trim(),
        tiers,
        characterIds: pool,
        creatorId: user.id,
      });
      toast({ title: t("msg_tierlist_created") });
      setLocation(`/tierlist/${id}`);
    } catch {
      toast({ title: "Error", description: "Failed to create tier list.", variant: "destructive" });
    } finally {
      setPublishing(false);
    }
  };

  const steps = ["Info & Tiers", "Character Pool", "Preview"];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-muted/20 pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => step > 1 ? setStep(step - 1) : setLocation("/tierlists")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
          </button>
          <LayoutList size={22} className="text-amber-400" />
          <h1 className="text-2xl font-black">{t("btn_create_tierlist")}</h1>
        </div>

        <div className="flex justify-between items-center mb-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -z-10" />
          {steps.map((s, i) => (
            <div key={s} className="flex flex-col items-center gap-1.5 bg-background px-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step > i + 1 ? "bg-primary text-primary-foreground" : step === i + 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground border-2"}`}>
                {i + 1}
              </div>
              <span className="text-[10px] font-medium hidden sm:block text-muted-foreground">{s}</span>
            </div>
          ))}
        </div>

        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>{t("ph_tierlist_title")}</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("ph_tierlist_title")}
                  className="text-lg py-6"
                />
              </div>
              <div className="space-y-2">
                <Label>Description (optional)</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("ph_tierlist_desc")}
                  rows={3}
                />
              </div>

              <div className="space-y-3">
                <Label>{t("lbl_tiers")}</Label>
                <div className="space-y-2">
                  {tiers.map((tier, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <GripVertical size={14} className="text-muted-foreground shrink-0" />
                      <div
                        className="w-8 h-8 rounded-lg shrink-0 border-2 cursor-pointer"
                        style={{ backgroundColor: `${tier.color}33`, borderColor: tier.color }}
                        onClick={() => {
                          const idx = PRESET_COLORS.indexOf(tier.color);
                          const next = PRESET_COLORS[(idx + 1) % PRESET_COLORS.length];
                          updateTierColor(i, next);
                        }}
                        title="Click to change color"
                      />
                      <Input
                        value={tier.name}
                        onChange={(e) => updateTierName(i, e.target.value)}
                        className="h-8 text-sm font-bold"
                        style={{ color: tier.color }}
                      />
                      <button
                        onClick={() => removeTier(i)}
                        className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                        disabled={tiers.length <= 2}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTierName}
                    onChange={(e) => setNewTierName(e.target.value)}
                    placeholder="New tier name..."
                    className="h-8 text-sm"
                    onKeyDown={(e) => e.key === "Enter" && addTier()}
                  />
                  <Button size="sm" variant="outline" onClick={addTier} className="gap-1 shrink-0">
                    <Plus size={14} /> Add
                  </Button>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button onClick={() => setStep(2)} disabled={!title.trim() || tiers.length < 2}>
                  {t("btn_next")}
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <CharacterPoolSelector selectedIds={pool} onChange={setPool} />
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)} disabled={pool.length < 2}>{t("btn_next")}</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black">{title}</h2>
                {description && <p className="text-muted-foreground mt-1">{description}</p>}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Tiers</p>
                <div className="flex gap-2 flex-wrap">
                  {tiers.map((tier) => (
                    <span
                      key={tier.name}
                      className="px-3 py-1.5 rounded-lg text-sm font-black"
                      style={{ backgroundColor: `${tier.color}22`, color: tier.color, border: `1px solid ${tier.color}44` }}
                    >
                      {tier.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="inline-flex bg-primary/10 text-primary px-3 py-1 rounded-full font-bold text-sm">
                {pool.length} Characters in Pool
              </div>
              <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button size="lg" onClick={handlePublish} disabled={publishing} className="gap-2">
                  {publishing && <Loader2 size={16} className="animate-spin" />}
                  {t("btn_publish")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
