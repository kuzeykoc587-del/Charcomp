import { useState } from "react";
import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ImageUpload } from "../components/ImageUpload";
import { ConfirmModal } from "../components/ConfirmModal";
import { useAuth } from "../contexts/AuthContext";
import { seedDatabase, isSeedNeeded } from "../lib/seed";
import { useTranslation } from "../contexts/LanguageContext";
import { Link } from "wouter";
import {
  LogIn, Loader2, CheckCircle2, Database, ShieldCheck, ShieldX,
  Eye, EyeOff, Ban, CheckCheck, AlertTriangle, Flag, Users,
  Copy, Check, Pencil, Trash2
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { testsDb, reportsDb, type Test, type Report } from "../lib/db";

function useTestsByStatus(status: NonNullable<Test["status"]>, enabled: boolean) {
  return useQuery<Test[]>({
    queryKey: ["admin-tests-status", status],
    queryFn: () => testsDb.getByStatus(status),
    staleTime: 0,
    enabled,
  });
}

function usePendingTests(enabled: boolean) {
  return useQuery<Test[]>({
    queryKey: ["admin-pending-tests"],
    queryFn: () => testsDb.getPending(),
    staleTime: 0,
    enabled,
  });
}

function useOpenReports(enabled: boolean) {
  return useQuery<Report[]>({
    queryKey: ["admin-open-reports"],
    queryFn: () => reportsDb.getOpen(),
    staleTime: 0,
    enabled,
  });
}

function RiskBadge({ score }: { score: number }) {
  if (score >= 7) return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-500">Risk: {score}</span>;
  if (score >= 4) return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-500">Risk: {score}</span>;
  return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-500">Risk: {score}</span>;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    published: "bg-green-500/20 text-green-500",
    pending: "bg-amber-500/20 text-amber-500",
    hidden: "bg-muted text-muted-foreground",
    rejected: "bg-red-500/20 text-red-500",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${styles[status] ?? "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

function TestEditModal({ test, onClose, onSaved }: { test: Test; onClose: () => void; onSaved: () => void }) {
  const { user } = useAuth();
  const [title, setTitle] = useState(test.title);
  const [description, setDescription] = useState(test.description);
  const [coverImage, setCoverImage] = useState(test.coverImage);
  const [category, setCategory] = useState(test.category ?? "");
  const [status, setStatus] = useState<NonNullable<Test["status"]>>(test.status ?? "published");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    if (!user || !title.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await testsDb.update(test.id, {
        title: title.trim(),
        description: description.trim(),
        coverImage,
        category: category.trim() || undefined,
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
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 overflow-y-auto bg-black/40" onClick={onClose}>
      <div
        className="relative bg-card border rounded-2xl shadow-2xl w-full max-w-lg my-4 z-10"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5">
          <h3 className="font-bold text-base mb-4 flex items-center gap-2">
            <Pencil size={16} /> Testi Düzenle
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Başlık *</label>
              <Input value={title} onChange={e => setTitle(e.target.value)} />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Açıklama</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
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
              <Input
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="Anime, Film, Oyun, Dizi..."
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Durum</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as NonNullable<Test["status"]>)}
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
            <Button onClick={save} disabled={saving || !title.trim()} className="flex-1 gap-1.5">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCheck size={14} />}
              Kaydet
            </Button>
            <Button variant="outline" onClick={onClose} disabled={saving}>İptal</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

type ContentTab = "pending" | "reports" | "hidden" | "rejected" | "published";

function AdminTestCard({
  test,
  tab,
  onAction,
}: {
  test: Test;
  tab: ContentTab;
  onAction: () => void;
}) {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const moderate = async (action: "approve" | "reject" | "hide") => {
    if (!user) return;
    setLoading(action);
    try {
      await testsDb.moderate(test.id, action, user.id);
      onAction();
    } catch {
      /* silent */
    } finally {
      setLoading(null);
    }
  };

  const permanentDelete = async () => {
    setLoading("delete");
    try {
      await testsDb.delete(test.id);
      onAction();
    } catch {
      /* silent */
    } finally {
      setLoading(null);
      setConfirmDelete(false);
    }
  };

  return (
    <>
      {editing && (
        <TestEditModal
          test={test}
          onClose={() => setEditing(false)}
          onSaved={onAction}
        />
      )}
      <ConfirmModal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={permanentDelete}
        title="Testi Kalıcı Olarak Sil"
        description="Bu testi veritabanından kalıcı olarak silmek istediğinden emin misin? Bu işlem geri alınamaz."
      />

      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="flex gap-3 p-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
            <img
              src={test.coverImage}
              alt={test.title}
              className="w-full h-full object-cover"
              onError={e => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(test.title)}&background=7C3AED&color=fff&size=100&bold=true`;
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-bold text-sm leading-tight line-clamp-1">{test.title}</h3>
              <div className="flex gap-1 shrink-0 flex-wrap justify-end">
                <StatusBadge status={test.status ?? "published"} />
                {test.riskScore !== undefined && test.riskScore > 0 && (
                  <RiskBadge score={test.riskScore} />
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1 mb-1">{test.description || "—"}</p>
            <div className="flex flex-wrap gap-1 mb-1">
              {test.category && (
                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">{test.category}</span>
              )}
              {(test.riskReasons ?? []).slice(0, 3).map(r => (
                <span key={r} className="text-[9px] bg-muted px-1.5 py-0.5 rounded font-mono text-muted-foreground">{r}</span>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground">
              {test.creatorId.slice(0, 12)}… · {test.createdAt ? new Date(test.createdAt).toLocaleDateString("tr-TR") : "—"}
              {test.updatedBy && " · düzenlendi"}
            </p>
          </div>
        </div>

        <div className="border-t p-3 flex gap-2 flex-wrap">
          {(tab === "hidden" || tab === "rejected") && (
            <Button
              size="sm"
              className="gap-1 h-7 text-xs bg-green-600 hover:bg-green-700"
              onClick={() => moderate("approve")}
              disabled={loading !== null}
            >
              {loading === "approve" ? <Loader2 size={12} className="animate-spin" /> : <CheckCheck size={12} />}
              Yayınla
            </Button>
          )}

          {tab === "pending" && (
            <Button
              size="sm"
              className="gap-1 h-7 text-xs bg-green-600 hover:bg-green-700"
              onClick={() => moderate("approve")}
              disabled={loading !== null}
            >
              {loading === "approve" ? <Loader2 size={12} className="animate-spin" /> : <CheckCheck size={12} />}
              Onayla
            </Button>
          )}

          {tab !== "rejected" && (
            <Button
              size="sm"
              variant="destructive"
              className="gap-1 h-7 text-xs"
              onClick={() => moderate("reject")}
              disabled={loading !== null}
            >
              {loading === "reject" ? <Loader2 size={12} className="animate-spin" /> : <Ban size={12} />}
              Reddet
            </Button>
          )}

          {tab !== "hidden" && (
            <Button
              size="sm"
              variant="outline"
              className="gap-1 h-7 text-xs"
              onClick={() => moderate("hide")}
              disabled={loading !== null}
            >
              {loading === "hide" ? <Loader2 size={12} className="animate-spin" /> : <EyeOff size={12} />}
              Gizle
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            className="gap-1 h-7 text-xs"
            onClick={() => setEditing(true)}
            disabled={loading !== null}
          >
            <Pencil size={12} /> Düzenle
          </Button>

          <Link href={`/test/${test.id}`}>
            <Button size="sm" variant="ghost" className="gap-1 h-7 text-xs">
              <Eye size={12} /> Görüntüle
            </Button>
          </Link>

          {(tab === "hidden" || tab === "rejected") && (
            <Button
              size="sm"
              variant="ghost"
              className="gap-1 h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => setConfirmDelete(true)}
              disabled={loading !== null}
            >
              {loading === "delete" ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
              Sil
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

function ReportCard({ report, onAction }: { report: Report; onAction: () => void }) {
  const [loading, setLoading] = useState<string | null>(null);

  const resolve = async (action: "resolved" | "dismissed") => {
    setLoading(action);
    try {
      await reportsDb.resolve(report.id, action);
      onAction();
    } catch {
      /* silent */
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-card border rounded-xl p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{report.contentType}</span>
          <p className="text-sm font-bold mt-0.5">{report.reason}</p>
          {report.details && <p className="text-xs text-muted-foreground mt-0.5">{report.details}</p>}
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-500">open</span>
      </div>
      <p className="text-[10px] text-muted-foreground mb-3">
        İçerik: {report.contentId.slice(0, 12)}… · {new Date(report.createdAt).toLocaleDateString("tr-TR")}
      </p>
      <div className="flex gap-2">
        <Button size="sm" className="h-7 text-xs gap-1" onClick={() => resolve("resolved")} disabled={loading !== null}>
          {loading === "resolved" ? <Loader2 size={12} className="animate-spin" /> : <CheckCheck size={12} />}
          Çöz
        </Button>
        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => resolve("dismissed")} disabled={loading !== null}>
          Reddet
        </Button>
        {report.contentType === "test" && (
          <Link href={`/test/${report.contentId}`}>
            <Button size="sm" variant="ghost" className="h-7 text-xs gap-1">
              <Eye size={12} /> Görüntüle
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

function UIDDisplay({ uid }: { uid: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(uid).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 font-mono text-xs bg-muted px-2 py-1 rounded-lg hover:bg-muted/80 transition-colors"
    >
      {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} className="text-muted-foreground" />}
      <span className="text-muted-foreground">{uid}</span>
    </button>
  );
}

type Tab = "pending" | "reports" | "hidden" | "rejected" | "published" | "seed" | "info";

export default function AdminPage() {
  const { t } = useTranslation();
  const { user, roleInfo } = useAuth();
  const qc = useQueryClient();

  const [seeding, setSeeding] = useState(false);
  const [progress, setProgress] = useState<{ msg: string; pct: number } | null>(null);
  const [done, setDone] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("pending");

  const canModerate = roleInfo?.canModerate ?? false;

  const { data: needsSeed, isLoading: checkingDb, refetch: refetchSeed } = useQuery({
    queryKey: ["needs-seed"],
    queryFn: isSeedNeeded,
    staleTime: 0,
    enabled: canModerate,
  });

  const { data: pendingTests = [], isLoading: loadingPending } = usePendingTests(canModerate);
  const { data: openReports = [], isLoading: loadingReports } = useOpenReports(canModerate);
  const { data: hiddenTests = [], isLoading: loadingHidden } = useTestsByStatus("hidden", canModerate && activeTab === "hidden");
  const { data: rejectedTests = [], isLoading: loadingRejected } = useTestsByStatus("rejected", canModerate && activeTab === "rejected");
  const { data: publishedTests = [], isLoading: loadingPublished } = useTestsByStatus("published", canModerate && activeTab === "published");

  if (!user) {
    return (
      <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-6 p-4">
          <ShieldCheck size={48} className="text-muted-foreground" />
          <p className="text-muted-foreground text-lg">Giriş yapman gerekiyor.</p>
          <Link href="/login"><Button className="gap-2"><LogIn size={16} /> Giriş Yap</Button></Link>
        </main>
      </div>
    );
  }

  if (!canModerate) {
    return (
      <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-6 p-4">
          <ShieldX size={48} className="text-destructive" />
          <p className="text-muted-foreground text-lg text-center max-w-sm">
            Erişim reddedildi. Bu hesap admin paneli için yetkilendirilmemiş.
          </p>
        </main>
      </div>
    );
  }

  const handleSeed = async () => {
    setSeeding(true);
    setDone(false);
    setProgress({ msg: "Starting...", pct: 0 });
    try {
      await seedDatabase((msg, pct) => setProgress({ msg, pct }));
      setDone(true);
      refetchSeed();
    } catch (e: unknown) {
      setProgress({ msg: `Error: ${e instanceof Error ? e.message : "Unknown"}`, pct: 0 });
    } finally {
      setSeeding(false);
    }
  };

  const refreshAll = () => {
    qc.invalidateQueries({ queryKey: ["admin-pending-tests"] });
    qc.invalidateQueries({ queryKey: ["admin-open-reports"] });
    qc.invalidateQueries({ queryKey: ["admin-tests-status", "hidden"] });
    qc.invalidateQueries({ queryKey: ["admin-tests-status", "rejected"] });
    qc.invalidateQueries({ queryKey: ["admin-tests-status", "published"] });
    qc.invalidateQueries({ queryKey: ["tests"] });
  };

  const TABS: { key: Tab; label: string; count?: number }[] = [
    { key: "pending", label: "Bekleyen", count: pendingTests.length },
    { key: "reports", label: "Raporlar", count: openReports.length },
    { key: "hidden", label: "Gizli" },
    { key: "rejected", label: "Reddedilen" },
    { key: "published", label: "Yayınlanan" },
    { key: "seed", label: "Veritabanı" },
    { key: "info", label: "Bilgi" },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck size={28} className="text-primary" />
          <h1 className="text-2xl font-black">Admin Panel</h1>
          <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
            {roleInfo.role}
          </span>
        </div>

        <div className="flex border-b mb-6 gap-0 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${
                activeTab === tab.key
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Bekleyen ── */}
        {activeTab === "pending" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-500" />
                Bekleyen / Şüpheli Testler
              </h2>
              <Button size="sm" variant="outline" onClick={refreshAll} className="h-7 text-xs">Yenile</Button>
            </div>
            {loadingPending ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={24} /></div>
            ) : pendingTests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle2 size={32} className="mx-auto mb-2 text-green-500" />
                <p className="text-sm">İncelenecek içerik yok.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingTests.map(test => (
                  <AdminTestCard key={test.id} test={test} tab="pending" onAction={refreshAll} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Raporlar ── */}
        {activeTab === "reports" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base flex items-center gap-2">
                <Flag size={16} className="text-red-500" />
                Açık Raporlar
              </h2>
              <Button size="sm" variant="outline" onClick={refreshAll} className="h-7 text-xs">Yenile</Button>
            </div>
            {loadingReports ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={24} /></div>
            ) : openReports.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle2 size={32} className="mx-auto mb-2 text-green-500" />
                <p className="text-sm">Açık rapor yok.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {openReports.map(report => (
                  <ReportCard key={report.id} report={report} onAction={refreshAll} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Gizli ── */}
        {activeTab === "hidden" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base flex items-center gap-2">
                <EyeOff size={16} className="text-muted-foreground" />
                Gizli Testler
              </h2>
              <Button size="sm" variant="outline" onClick={refreshAll} className="h-7 text-xs">Yenile</Button>
            </div>
            {loadingHidden ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={24} /></div>
            ) : hiddenTests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">Gizli test yok.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {hiddenTests.map(test => (
                  <AdminTestCard key={test.id} test={test} tab="hidden" onAction={refreshAll} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Reddedilen ── */}
        {activeTab === "rejected" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base flex items-center gap-2">
                <Ban size={16} className="text-destructive" />
                Reddedilen Testler
              </h2>
              <Button size="sm" variant="outline" onClick={refreshAll} className="h-7 text-xs">Yenile</Button>
            </div>
            {loadingRejected ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={24} /></div>
            ) : rejectedTests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">Reddedilen test yok.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {rejectedTests.map(test => (
                  <AdminTestCard key={test.id} test={test} tab="rejected" onAction={refreshAll} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Yayınlanan ── */}
        {activeTab === "published" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-500" />
                Yayınlanan Testler <span className="text-xs font-normal text-muted-foreground">(son 100)</span>
              </h2>
              <Button size="sm" variant="outline" onClick={refreshAll} className="h-7 text-xs">Yenile</Button>
            </div>
            {loadingPublished ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={24} /></div>
            ) : publishedTests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">Yayınlanan test yok.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {publishedTests.map(test => (
                  <AdminTestCard key={test.id} test={test} tab="published" onAction={refreshAll} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Veritabanı ── */}
        {activeTab === "seed" && (
          <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Database size={20} className="text-primary" />
              <h2 className="text-xl font-bold">{t("lbl_seed_status")}</h2>
            </div>
            {checkingDb ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="animate-spin" size={16} /> Veritabanı kontrol ediliyor...
              </div>
            ) : needsSeed === false ? (
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle2 size={18} /> Veritabanı evren ve karakterlerle dolu.
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Veritabanı boş. Aşağıdaki butona tıklayarak <strong>60+ evren</strong> ve <strong>200+ karakter</strong> ile doldurabilirsin.
              </p>
            )}
            {progress && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-mono">
                  <span className="text-muted-foreground">{progress.msg}</span>
                  <span className="text-primary">{progress.pct}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress.pct}%` }} />
                </div>
              </div>
            )}
            {done && (
              <div className="flex items-center gap-2 text-green-500 animate-in fade-in">
                <CheckCircle2 size={18} /> {t("msg_seed_complete")}
              </div>
            )}
            <Button onClick={handleSeed} disabled={seeding || needsSeed === false} className="gap-2">
              {seeding ? <Loader2 size={16} className="animate-spin" /> : <Database size={16} />}
              {needsSeed === false ? "Zaten dolu" : t("btn_seed_db")}
            </Button>
          </div>
        )}

        {/* ── Bilgi ── */}
        {activeTab === "info" && (
          <div className="space-y-4">
            <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <Users size={20} className="text-primary" />
                <h2 className="text-lg font-bold">Hesap Bilgisi</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">E-posta</p>
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Firebase UID</p>
                  <UIDDisplay uid={user.id} />
                  <p className="text-xs text-muted-foreground mt-1">
                    Bu UID'yi VITE_ADMIN_UIDS ortam değişkenine ekleyerek UID tabanlı admin yetkisi verebilirsin.
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Rol</p>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">{roleInfo.role}</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Hesap Oluşturma</p>
                  <p className="text-sm">{user.createdAt ? new Date(user.createdAt).toLocaleDateString("tr-TR") : "—"}</p>
                </div>
              </div>
            </div>

            <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-2">
              <h3 className="font-bold text-sm mb-3">Hızlı Linkler</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { href: "/universes", label: "Evrenler" },
                  { href: "/duels", label: "Düellolar" },
                  { href: "/tests", label: "Testler" },
                  { href: "/tierlists", label: "Tier Listler" },
                ].map(item => (
                  <Link key={item.href} href={item.href}>
                    <div className="bg-muted/50 border rounded-xl p-3 hover:border-primary transition-colors cursor-pointer">
                      <p className="font-semibold text-sm">{item.label}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
