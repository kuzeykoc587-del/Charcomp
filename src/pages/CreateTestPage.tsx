import { useState } from "react";
import { useLocation } from "wouter";
import { Header } from "../components/Header";
import { useTranslation } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { CharacterPoolSelector } from "../components/CharacterPoolSelector";
import { ImageUpload } from "../components/ImageUpload";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { useToast } from "../hooks/use-toast";
import { testsDb } from "../lib/db";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function CreateTestPage() {
  const { t, language } = useTranslation();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [pool, setPool] = useState<string[]>([]);
  const [publishing, setPublishing] = useState(false);

  if (!user) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-muted/20 pb-20 md:pb-0">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="bg-card p-8 rounded-2xl border shadow-lg text-center max-w-sm w-full">
            <h2 className="text-2xl font-black mb-4">Login Required</h2>
            <p className="text-muted-foreground mb-8">You need to log in to create your own tests.</p>
            <Button className="w-full" onClick={() => setLocation("/login")}>Go to Login</Button>
          </div>
        </main>
      </div>
    );
  }

  const handlePublish = async () => {
    if (!title || pool.length < 2) {
      toast({ title: "Error", description: "Title and at least 2 characters required", variant: "destructive" });
      return;
    }
    setPublishing(true);
    try {
      const id = await testsDb.create({
        title,
        description,
        coverImage: coverImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=7C3AED&color=fff&size=400&bold=true`,
        creatorId: user.id,
        language,
        characterIds: pool,
      });
      toast({ title: "Success", description: t("msg_publish_success") });
      setLocation(`/test/${id}`);
    } catch {
      toast({ title: "Error", description: "Failed to publish test", variant: "destructive" });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-muted/20 pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">

        <Link href="/create">
          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft size={14} /> Oluştur
          </button>
        </Link>

        <div className="flex justify-between items-center mb-12 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -z-10" />
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center gap-2 bg-background p-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground border-2 border-border"}`}>
                {s}
              </div>
              <span className="text-xs font-medium hidden sm:block">
                {s === 1 ? t("lbl_step_1") : s === 2 ? t("lbl_step_2") : t("lbl_step_3")}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">{t("ph_test_title")}</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Best Shonen Hero" className="text-lg py-6" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desc">{t("ph_test_desc")}</Label>
                    <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your test..." rows={4} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Cover Image</Label>
                  <ImageUpload value={coverImage} onChange={setCoverImage} />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={() => setStep(2)} disabled={!title}>{t("btn_next")}</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <CharacterPoolSelector selectedIds={pool} onChange={setPool} />
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)} disabled={pool.length < 2}>{t("btn_next")}</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-full md:w-1/3 aspect-square rounded-xl overflow-hidden bg-muted border">
                  <img src={coverImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=7C3AED&color=fff&size=400&bold=true`} alt="Cover" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-4">
                  <h2 className="text-3xl font-black">{title}</h2>
                  <p className="text-muted-foreground">{description || "No description provided."}</p>
                  <div className="inline-flex bg-primary/10 text-primary px-3 py-1 rounded-full font-bold text-sm">
                    {pool.length} Characters in Pool
                  </div>
                </div>
              </div>
              <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button size="lg" className="px-8 gap-2" onClick={handlePublish} disabled={publishing}>
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
