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
import { computeRiskScore } from "../lib/moderation";
import { Loader2, ArrowLeft, FlaskConical, AlertTriangle, Info } from "lucide-react";

export default function TestCreatePage() {
  const { t, language } = useTranslation();
  const { user, roleInfo } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [pool, setPool] = useState<string[]>([]);
  const [publishing, setPublishing] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<"exact" | "similar" | "image" | null>(null);
  const [showDuplicateConfirm, setShowDuplicateConfirm] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [pendingPublish, setPendingPublish] = useState(false);

  if (!user) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-muted/20 pb-20 md:pb-0">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="bg-card p-8 rounded-2xl border shadow-lg text-center max-w-sm w-full">
            <h2 className="text-2xl font-black mb-4">Login Required</h2>
            <p className="text-muted-foreground mb-8">You need to log in to create tests.</p>
            <Button className="w-full" onClick={() => setLocation("/login")}>Go to Login</Button>
          </div>
        </main>
      </div>
    );
  }

  const handlePublish = async (skipDuplicateCheck = false) => {
    if (!title || pool.length < 2) {
      toast({ title: "Error", description: "Title and at least 2 characters required", variant: "destructive" });
      return;
    }

    setPublishing(true);
    setShowDuplicateConfirm(false);

    try {
      const canBypassLimits = roleInfo?.canBypassLimits ?? false;
      const dailyLimit = roleInfo?.dailyTestLimit ?? 5;
      const totalLimit = roleInfo?.testLimit ?? 4;

      if (!canBypassLimits) {
        const todayCount = await testsDb.countCreatedToday(user.id);
        if (todayCount >= dailyLimit) {
          setLimitReached(true);
          setPublishing(false);
          return;
        }
        const totalCount = await testsDb.countByCreator(user.id);
        if (totalLimit !== Infinity && totalCount >= totalLimit) {
          setLimitReached(true);
          setPublishing(false);
          return;
        }
      }

      let existingTitles: string[] = [];
      let existingImageUrls: string[] = [];
      let existingImagePublicIds: string[] = [];

      if (!canBypassLimits) {
        try {
          [existingTitles, existingImageUrls] = await Promise.all([
            testsDb.getAllTitles(),
            testsDb.getAllCoverImages().then(imgs => imgs.map(i => i.url)),
          ]);
          const imageData = await testsDb.getAllCoverImages();
          existingImagePublicIds = imageData.map(i => i.publicId ?? "").filter(Boolean);
        } catch {
          /* non-fatal */
        }
      }

      const modResult = computeRiskScore({
        title,
        description,
        coverImageUrl: coverImage || undefined,
        existingTitles,
        existingImageUrls,
        existingImagePublicIds,
        userRole: roleInfo?.role ?? "MEMBER",
        userCreatedAt: user.createdAt,
      });

      if (!skipDuplicateCheck && modResult.duplicateWarning) {
        setDuplicateWarning(modResult.duplicateWarning as "exact" | "similar" | "image");
        setPendingPublish(true);
        setShowDuplicateConfirm(true);
        setPublishing(false);
        return;
      }

      const id = await testsDb.create({
        title,
        description,
        coverImage: coverImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=7C3AED&color=fff&size=400&bold=true`,
        creatorId: user.id,
        language,
        characterIds: pool,
        status: modResult.status,
        moderationStatus: modResult.moderationStatus,
        riskScore: modResult.riskScore,
        riskReasons: modResult.riskReasons,
        duplicateWarning: modResult.duplicateWarning,
      } as Parameters<typeof testsDb.create>[0]);

      if (modResult.status === "pending") {
        toast({
          title: "Test gönderildi",
          description: "Testiniz inceleme kuyruğuna alındı. Onaylandıktan sonra yayınlanacak.",
        });
        setLocation("/tests");
      } else {
        toast({ title: "Success", description: t("msg_publish_success") });
        setLocation(`/test/${id}`);
      }
    } catch {
      toast({ title: "Error", description: "Failed to publish test", variant: "destructive" });
    } finally {
      setPublishing(false);
      setPendingPublish(false);
    }
  };

  const steps = [t("lbl_step_1"), t("lbl_step_2"), t("lbl_step_3")];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-muted/20 pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => step > 1 ? setStep(step - 1) : setLocation("/create")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
          </button>
          <FlaskConical size={22} className="text-violet-400" />
          <h1 className="text-2xl font-black">{t("lbl_create_test")}</h1>
        </div>

        {limitReached && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
            <AlertTriangle size={18} className="text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold text-sm text-amber-700 dark:text-amber-400">Günlük limit doldu</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Bugünkü test oluşturma limitine ulaştın. Yarın tekrar deneyebilirsin.
              </p>
            </div>
          </div>
        )}

        {showDuplicateConfirm && (
          <div className="mb-6 p-4 rounded-xl bg-sky-500/10 border border-sky-500/30">
            <div className="flex items-start gap-3 mb-3">
              <Info size={18} className="text-sky-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-sm text-sky-700 dark:text-sky-400">Benzer içerik uyarısı</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {duplicateWarning === "exact"
                    ? "Bu başlıkla aynı bir test zaten var. Yine de yayınlamak istiyor musun?"
                    : duplicateWarning === "similar"
                    ? "Benzer başlıklı testler bulundu. Yine de devam etmek istiyor musun?"
                    : "Bu görsel başka bir testte kullanılmış olabilir. Yine de devam etmek istiyor musun?"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => { setShowDuplicateConfirm(false); if (pendingPublish) handlePublish(true); }}>
                Evet, devam et
              </Button>
              <Button size="sm" variant="outline" onClick={() => { setShowDuplicateConfirm(false); setPendingPublish(false); }}>
                İptal
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -z-10" />
          {steps.map((s, i) => (
            <div key={s} className="flex flex-col items-center gap-2 bg-background p-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= i + 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground border-2 border-border"}`}>
                {i + 1}
              </div>
              <span className="text-xs font-medium hidden sm:block">{s}</span>
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
                <Button size="lg" className="px-8 gap-2" onClick={() => handlePublish(false)} disabled={publishing || limitReached}>
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
