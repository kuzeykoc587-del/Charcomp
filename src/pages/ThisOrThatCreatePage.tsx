import { useState } from "react";
import { useLocation } from "wouter";
import { Header } from "../components/Header";
import { useTranslation } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Loader2, ArrowLeft, Shuffle } from "lucide-react";
import { thisOrThatDb } from "../lib/db";
import { useToast } from "../hooks/use-toast";

export default function ThisOrThatCreatePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [imageA, setImageA] = useState("");
  const [imageB, setImageB] = useState("");
  const [category, setCategory] = useState("");
  const [publishing, setPublishing] = useState(false);

  if (!user) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-muted/20 pb-20 md:pb-0">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="bg-card p-8 rounded-2xl border shadow-lg text-center max-w-sm w-full">
            <h2 className="text-2xl font-black mb-4">Login Required</h2>
            <p className="text-muted-foreground mb-8">You need to log in to create polls.</p>
            <Button className="w-full" onClick={() => setLocation("/login")}>Go to Login</Button>
          </div>
        </main>
      </div>
    );
  }

  const handlePublish = async () => {
    if (!optionA.trim() || !optionB.trim()) {
      toast({ title: "Error", description: "Both options are required.", variant: "destructive" });
      return;
    }
    setPublishing(true);
    try {
      const id = await thisOrThatDb.create({
        title: title.trim(),
        description: description.trim() || undefined,
        optionA: optionA.trim(),
        optionB: optionB.trim(),
        imageA: imageA.trim() || undefined,
        imageB: imageB.trim() || undefined,
        category: category.trim() || undefined,
        creatorId: user.id,
      });
      toast({ title: t("msg_this_or_that_created") });
      setLocation(`/this-or-that/${id}`);
    } catch {
      toast({ title: "Error", description: "Failed to create poll.", variant: "destructive" });
    } finally {
      setPublishing(false);
    }
  };

  const canPublish = optionA.trim().length > 0 && optionB.trim().length > 0;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-muted/20 pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setLocation("/this-or-that")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
          </button>
          <Shuffle size={22} className="text-sky-400" />
          <h1 className="text-2xl font-black">{t("btn_create_this_or_that")}</h1>
        </div>

        <div className="bg-card border rounded-2xl p-6 space-y-6">
          <div className="space-y-2">
            <Label>{t("ph_tot_title")}</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("ph_tot_title")}
            />
          </div>

          <div className="space-y-2">
            <Label>Description (optional)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("ph_tot_desc")}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-black flex items-center justify-center">A</div>
                <Label>{t("lbl_option_a")}</Label>
              </div>
              <Input
                value={optionA}
                onChange={(e) => setOptionA(e.target.value)}
                placeholder={t("ph_option_a")}
                className="border-blue-500/30 focus:border-blue-500"
              />
              <Input
                value={imageA}
                onChange={(e) => setImageA(e.target.value)}
                placeholder="Image URL for A (optional)"
              />
              {imageA && (
                <img src={imageA} alt="A" className="w-full h-24 object-cover rounded-lg" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-rose-500 text-white text-xs font-black flex items-center justify-center">B</div>
                <Label>{t("lbl_option_b")}</Label>
              </div>
              <Input
                value={optionB}
                onChange={(e) => setOptionB(e.target.value)}
                placeholder={t("ph_option_b")}
                className="border-rose-500/30 focus:border-rose-500"
              />
              <Input
                value={imageB}
                onChange={(e) => setImageB(e.target.value)}
                placeholder="Image URL for B (optional)"
              />
              {imageB && (
                <img src={imageB} alt="B" className="w-full h-24 object-cover rounded-lg" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category (optional)</Label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Life, Food, Nostalgia"
            />
          </div>

          <div className="flex justify-between pt-2 border-t">
            <Button variant="outline" onClick={() => setLocation("/this-or-that")}>
              {t("btn_cancel")}
            </Button>
            <Button onClick={handlePublish} disabled={!canPublish || publishing} className="gap-2">
              {publishing && <Loader2 size={16} className="animate-spin" />}
              {t("btn_publish")}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
