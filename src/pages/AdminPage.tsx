import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ImageUpload } from "../components/ImageUpload";
import { ConfirmModal } from "../components/ConfirmModal";
import { CoverEditModal } from "../components/CoverEditModal";
import { useAuth, getAuthDiagnostics, type AuthDiagnostics } from "../contexts/AuthContext";
import { seedDatabase, isSeedNeeded } from "../lib/seed";
import { useTranslation } from "../contexts/LanguageContext";
import { Link } from "wouter";
import {
  LogIn, Loader2, CheckCircle2, Database, ShieldCheck, ShieldX,
  Eye, EyeOff, Ban, CheckCheck, AlertTriangle, Flag, Users,
  Copy, Check, Pencil, Trash2, Image, RefreshCw, Activity, Globe, User,
  Archive, Megaphone, ClipboardList, HelpCircle, RotateCcw, Plus, Send
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  testsDb, reportsDb, universesDb, charactersDb, thisOrThatDb,
  announcementsDb, guessTasksDb, actionLogsDb, usersDb,
  type Test, type Report, type Universe, type Character, type ThisOrThat, type TotOption,
  type Announcement, type GuessTask, type ActionLog, type GroupedReport
} from "../lib/db";
import {
  useUniversesByStatus, useCharactersByStatus, useThisOrThatsByStatus,
  useGroupedReports, useArchivedTests, useArchivedUniverses, useArchivedCharacters,
  useAnnouncements, useGuessTasks
} from "../hooks/useFirestore";
import type { SeriesCategory } from "../lib/seedData";

// ── Shared badge components ────────────────────────────────────────────────────
function RiskBadge({ score }: { score: number }) {
  if (score >= 7) return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-500">Risk: {score}</span>;
  if (score >= 4) return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-500">Risk: {score}</span>;
  return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-500">Risk: {score}</span>;
}

function StatusBadge({ status }: { status?: string }) {
  const styles: Record<string, string> = {
    published: "bg-green-500/20 text-green-500",
    pending: "bg-amber-500/20 text-amber-500",
    hidden: "bg-muted text-muted-foreground",
    rejected: "bg-red-500/20 text-red-500",
  };
  const s = status ?? "published";
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${styles[s] ?? "bg-muted text-muted-foreground"}`}>
      {s}
    </span>
  );
}

// ── Generic inline modal wrapper ───────────────────────────────────────────────
function ModalWrap({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 overflow-y-auto bg-black/40" onClick={onClose}>
      <div className="relative bg-card border rounded-2xl shadow-2xl w-full max-w-lg my-4 z-10" onClick={e => e.stopPropagation()}>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ── Test Edit Modal ───────────────────────────────────────────────────────────
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
        title: title.trim(), description: description.trim(), coverImage,
        category: category.trim() || undefined, status,
        updatedAt: new Date().toISOString(), updatedBy: user.id,
      });
      onSaved(); onClose();
    } catch { setError("Kayıt başarısız. Lütfen tekrar dene."); }
    finally { setSaving(false); }
  };

  return (
    <ModalWrap onClose={onClose}>
      <h3 className="font-bold text-base mb-4 flex items-center gap-2"><Pencil size={16} /> Testi Düzenle</h3>
      <div className="space-y-4">
        <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Başlık *</label>
          <Input value={title} onChange={e => setTitle(e.target.value)} /></div>
        <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Açıklama</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
            className="w-full text-sm bg-muted border rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary" /></div>
        <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Kapak Görseli</label>
          <ImageUpload value={coverImage} onChange={setCoverImage} shape="square" /></div>
        <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Kategori</label>
          <Input value={category} onChange={e => setCategory(e.target.value)} placeholder="Anime, Film, Oyun..." /></div>
        <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Durum</label>
          <select value={status} onChange={e => setStatus(e.target.value as NonNullable<Test["status"]>)}
            className="w-full text-sm bg-muted border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="published">Yayınlanan</option>
            <option value="pending">Bekleyen</option>
            <option value="hidden">Gizli</option>
            <option value="rejected">Reddedilen</option>
          </select></div>
      </div>
      {error && <p className="text-xs text-destructive mt-3">{error}</p>}
      <div className="flex gap-2 mt-5">
        <Button onClick={save} disabled={saving || !title.trim()} className="flex-1 gap-1.5">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCheck size={14} />} Kaydet
        </Button>
        <Button variant="outline" onClick={onClose} disabled={saving}>İptal</Button>
      </div>
    </ModalWrap>
  );
}

// ── Universe Edit Modal ───────────────────────────────────────────────────────
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
    setSaving(true); setError(null);
    try {
      await universesDb.update(universe.id, {
        name: name.trim(), description: description.trim(), coverImage,
        category, status, updatedAt: new Date().toISOString(), updatedBy: user.id,
      });
      onSaved(); onClose();
    } catch { setError("Kayıt başarısız."); }
    finally { setSaving(false); }
  };

  const CATEGORIES: SeriesCategory[] = ["Anime", "TV", "Movie", "Game", "Comic", "Book", "Other"];

  return (
    <ModalWrap onClose={onClose}>
      <h3 className="font-bold text-base mb-4 flex items-center gap-2"><Globe size={16} /> Evren Düzenle</h3>
      <div className="space-y-4">
        <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Ad *</label>
          <Input value={name} onChange={e => setName(e.target.value)} /></div>
        <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Açıklama</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
            className="w-full text-sm bg-muted border rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary" /></div>
        <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Kapak Görseli</label>
          <ImageUpload value={coverImage} onChange={setCoverImage} shape="square" /></div>
        <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Kategori</label>
          <select value={category} onChange={e => setCategory(e.target.value as SeriesCategory)}
            className="w-full text-sm bg-muted border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select></div>
        <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Durum</label>
          <select value={status} onChange={e => setStatus(e.target.value as NonNullable<Universe["status"]>)}
            className="w-full text-sm bg-muted border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="published">Yayınlanan</option>
            <option value="pending">Bekleyen</option>
            <option value="hidden">Gizli</option>
            <option value="rejected">Reddedilen</option>
          </select></div>
      </div>
      {error && <p className="text-xs text-destructive mt-3">{error}</p>}
      <div className="flex gap-2 mt-5">
        <Button onClick={save} disabled={saving || !name.trim()} className="flex-1 gap-1.5">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCheck size={14} />} Kaydet
        </Button>
        <Button variant="outline" onClick={onClose} disabled={saving}>İptal</Button>
      </div>
    </ModalWrap>
  );
}

// ── Character Edit Modal ───────────────────────────────────────────────────────
function CharacterEditModal({ char, onClose, onSaved }: { char: Character; onClose: () => void; onSaved: () => void }) {
  const { user } = useAuth();
  const [name, setName] = useState(char.name);
  const [description, setDescription] = useState(char.description);
  const [image, setImage] = useState(char.image);
  const [status, setStatus] = useState<NonNullable<Character["status"]>>(char.status ?? "published");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    if (!user || !name.trim()) return;
    setSaving(true); setError(null);
    try {
      await charactersDb.update(char.id, {
        name: name.trim(), description: description.trim(), image,
        status, updatedAt: new Date().toISOString(), updatedBy: user.id,
      });
      onSaved(); onClose();
    } catch { setError("Kayıt başarısız."); }
    finally { setSaving(false); }
  };

  return (
    <ModalWrap onClose={onClose}>
      <h3 className="font-bold text-base mb-4 flex items-center gap-2"><User size={16} /> Karakter Düzenle</h3>
      <div className="space-y-4">
        <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Ad *</label>
          <Input value={name} onChange={e => setName(e.target.value)} /></div>
        <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Açıklama</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
            className="w-full text-sm bg-muted border rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary" /></div>
        <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Görsel</label>
          <ImageUpload value={image} onChange={setImage} shape="square" /></div>
        <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Durum</label>
          <select value={status} onChange={e => setStatus(e.target.value as NonNullable<Character["status"]>)}
            className="w-full text-sm bg-muted border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="published">Yayınlanan</option>
            <option value="pending">Bekleyen</option>
            <option value="hidden">Gizli</option>
            <option value="rejected">Reddedilen</option>
          </select></div>
      </div>
      {error && <p className="text-xs text-destructive mt-3">{error}</p>}
      <div className="flex gap-2 mt-5">
        <Button onClick={save} disabled={saving || !name.trim()} className="flex-1 gap-1.5">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCheck size={14} />} Kaydet
        </Button>
        <Button variant="outline" onClick={onClose} disabled={saving}>İptal</Button>
      </div>
    </ModalWrap>
  );
}

// ── ToT Edit Modal ────────────────────────────────────────────────────────────
function TotEditModal({ tot, onClose, onSaved }: { tot: ThisOrThat; onClose: () => void; onSaved: () => void }) {
  const { user } = useAuth();
  const [title, setTitle] = useState(tot.title);
  const [description, setDescription] = useState(tot.description ?? "");
  const [coverImage, setCoverImage] = useState(tot.coverImage ?? "");
  const [category, setCategory] = useState(tot.category ?? "");
  const [status, setStatus] = useState<NonNullable<ThisOrThat["status"]>>(tot.status ?? "published");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    if (!user || !title.trim()) return;
    setSaving(true); setError(null);
    try {
      await thisOrThatDb.update(tot.id, {
        title: title.trim(), description: description.trim() || undefined,
        coverImage: coverImage.trim() || undefined,
        category: category.trim() || undefined, status,
        updatedAt: new Date().toISOString(), updatedBy: user.id,
      });
      onSaved(); onClose();
    } catch { setError("Kayıt başarısız."); }
    finally { setSaving(false); }
  };

  return (
    <ModalWrap onClose={onClose}>
      <h3 className="font-bold text-base mb-4 flex items-center gap-2"><Pencil size={16} /> Bu mu O mu Düzenle</h3>
      <div className="space-y-4">
        <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Başlık *</label>
          <Input value={title} onChange={e => setTitle(e.target.value)} /></div>
        <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Açıklama</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
            className="w-full text-sm bg-muted border rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary" /></div>
        <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Kapak Görseli</label>
          <ImageUpload value={coverImage} onChange={setCoverImage} shape="square" /></div>
        <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Kategori</label>
          <Input value={category} onChange={e => setCategory(e.target.value)} placeholder="Hayat, Yemek, Nostalji..." /></div>
        <div><label className="text-xs font-medium text-muted-foreground mb-1 block">Durum</label>
          <select value={status} onChange={e => setStatus(e.target.value as NonNullable<ThisOrThat["status"]>)}
            className="w-full text-sm bg-muted border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="published">Yayınlanan</option>
            <option value="pending">Bekleyen</option>
            <option value="hidden">Gizli</option>
            <option value="rejected">Reddedilen</option>
          </select></div>
      </div>
      {error && <p className="text-xs text-destructive mt-3">{error}</p>}
      <div className="flex gap-2 mt-5">
        <Button onClick={save} disabled={saving || !title.trim()} className="flex-1 gap-1.5">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCheck size={14} />} Kaydet
        </Button>
        <Button variant="outline" onClick={onClose} disabled={saving}>İptal</Button>
      </div>
    </ModalWrap>
  );
}

// ── Admin Test Card ───────────────────────────────────────────────────────────
type ContentTab = "pending" | "reports" | "hidden" | "rejected" | "published";

function AdminTestCard({ test, tab, onAction }: { test: Test; tab: ContentTab; onAction: () => void }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editingCover, setEditingCover] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const moderate = async (action: "approve" | "reject" | "hide") => {
    if (!user) return;
    setLoading(action);
    try { await testsDb.moderate(test.id, action, user.id); onAction(); }
    catch { /* silent */ } finally { setLoading(null); }
  };

  const permanentDelete = async () => {
    setLoading("delete");
    try { await testsDb.delete(test.id); onAction(); }
    catch { /* silent */ } finally { setLoading(null); setConfirmDelete(false); }
  };

  return (
    <>
      {editingCover && <CoverEditModal test={test} onClose={() => setEditingCover(false)} onSaved={onAction} />}
      {editing && <TestEditModal test={test} onClose={() => setEditing(false)} onSaved={onAction} />}
      <ConfirmModal open={confirmDelete} onClose={() => setConfirmDelete(false)} onConfirm={permanentDelete}
        title="Testi Kalıcı Olarak Sil"
        description="Bu testi veritabanından kalıcı olarak silmek istediğinden emin misin? Bu işlem geri alınamaz." />

      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="flex gap-3 p-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0 relative group/cover">
            <img src={test.coverImage} alt={test.title} className="w-full h-full object-cover"
              onError={e => { console.warn("[IMAGE] failed to load", test.coverImage); (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(test.title)}&background=7C3AED&color=fff&size=100&bold=true`; }} />
            <button onClick={() => setEditingCover(true)}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover/cover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-0.5 text-white">
              <Image size={14} /><span className="text-[9px] font-bold">Kapak</span>
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-bold text-sm leading-tight line-clamp-1">{test.title}</h3>
              <div className="flex gap-1 shrink-0 flex-wrap justify-end">
                <StatusBadge status={test.status ?? "published"} />
                {test.riskScore !== undefined && test.riskScore > 0 && <RiskBadge score={test.riskScore} />}
              </div>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1 mb-1">{test.description || "—"}</p>
            <div className="flex flex-wrap gap-1 mb-1">
              {test.category && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">{test.category}</span>}
              {(test.riskReasons ?? []).slice(0, 3).map(r => (
                <span key={r} className="text-[9px] bg-muted px-1.5 py-0.5 rounded font-mono text-muted-foreground">{r}</span>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground">
              {test.creatorId.slice(0, 12)}… · {test.createdAt ? new Date(test.createdAt).toLocaleDateString("tr-TR") : "—"}
              {test.updatedBy && " · düzenlendi"}{test.hiddenBy && " · gizlendi"}{test.rejectedBy && " · reddedildi"}
            </p>
          </div>
        </div>
        <div className="border-t p-3 flex gap-2 flex-wrap">
          <Button size="sm" variant="outline" className="gap-1 h-7 text-xs border-primary/40 text-primary hover:bg-primary/10"
            onClick={() => setEditingCover(true)} disabled={loading !== null}>
            <Image size={12} /> Kapak Düzenle
          </Button>
          {(tab === "hidden" || tab === "rejected") && (
            <Button size="sm" className="gap-1 h-7 text-xs bg-green-600 hover:bg-green-700" onClick={() => moderate("approve")} disabled={loading !== null}>
              {loading === "approve" ? <Loader2 size={12} className="animate-spin" /> : <CheckCheck size={12} />} Yayınla
            </Button>
          )}
          {tab === "pending" && (
            <Button size="sm" className="gap-1 h-7 text-xs bg-green-600 hover:bg-green-700" onClick={() => moderate("approve")} disabled={loading !== null}>
              {loading === "approve" ? <Loader2 size={12} className="animate-spin" /> : <CheckCheck size={12} />} Onayla
            </Button>
          )}
          {tab !== "rejected" && (
            <Button size="sm" variant="destructive" className="gap-1 h-7 text-xs" onClick={() => moderate("reject")} disabled={loading !== null}>
              {loading === "reject" ? <Loader2 size={12} className="animate-spin" /> : <Ban size={12} />} Reddet
            </Button>
          )}
          {tab !== "hidden" && (
            <Button size="sm" variant="outline" className="gap-1 h-7 text-xs" onClick={() => moderate("hide")} disabled={loading !== null}>
              {loading === "hide" ? <Loader2 size={12} className="animate-spin" /> : <EyeOff size={12} />} Gizle
            </Button>
          )}
          <Button size="sm" variant="outline" className="gap-1 h-7 text-xs" onClick={() => setEditing(true)} disabled={loading !== null}>
            <Pencil size={12} /> Düzenle
          </Button>
          <Link href={`/test/${test.id}`}>
            <Button size="sm" variant="ghost" className="gap-1 h-7 text-xs"><Eye size={12} /> Görüntüle</Button>
          </Link>
          {(tab === "hidden" || tab === "rejected") && (
            <Button size="sm" variant="ghost" className="gap-1 h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => setConfirmDelete(true)} disabled={loading !== null}>
              {loading === "delete" ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />} Sil
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

// ── Admin Universe Card ───────────────────────────────────────────────────────
type UniTab = "published" | "hidden" | "rejected" | "pending";

function AdminUniverseCard({ universe, tab, onAction }: { universe: Universe; tab: UniTab; onAction: () => void }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const moderate = async (action: "approve" | "reject" | "hide") => {
    if (!user) return;
    setLoading(action);
    try { await universesDb.moderate(universe.id, action, user.id); onAction(); }
    catch { /* silent */ } finally { setLoading(null); }
  };

  const permanentDelete = async () => {
    setLoading("delete");
    try { await universesDb.delete(universe.id); onAction(); }
    catch { /* silent */ } finally { setLoading(null); setConfirmDelete(false); }
  };

  return (
    <>
      {editing && <UniverseEditModal universe={universe} onClose={() => setEditing(false)} onSaved={onAction} />}
      <ConfirmModal open={confirmDelete} onClose={() => setConfirmDelete(false)} onConfirm={permanentDelete}
        title="Evreni Kalıcı Olarak Sil"
        description={`"${universe.name}" evrenini kalıcı olarak silmek istediğinden emin misin? Bu işlem geri alınamaz.`} />

      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="flex gap-3 p-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
            <img src={universe.coverImage} alt={universe.name} className="w-full h-full object-cover"
              onError={e => { console.warn("[IMAGE] failed to load", universe.coverImage); (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(universe.name)}&background=7C3AED&color=fff&size=100&bold=true`; }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-bold text-sm leading-tight line-clamp-1">{universe.name}</h3>
              <StatusBadge status={universe.status ?? "published"} />
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1 mb-1">{universe.description || "—"}</p>
            <div className="flex flex-wrap gap-1 mb-1">
              {universe.category && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">{universe.category}</span>}
              <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{universe.characterCount ?? 0} karakter</span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              {universe.creatorId.slice(0, 12)}… · {universe.createdAt ? new Date(universe.createdAt).toLocaleDateString("tr-TR") : "—"}
            </p>
          </div>
        </div>
        <div className="border-t p-3 flex gap-2 flex-wrap">
          {(tab === "hidden" || tab === "rejected" || tab === "pending") && (
            <Button size="sm" className="gap-1 h-7 text-xs bg-green-600 hover:bg-green-700" onClick={() => moderate("approve")} disabled={loading !== null}>
              {loading === "approve" ? <Loader2 size={12} className="animate-spin" /> : <CheckCheck size={12} />} Yayınla
            </Button>
          )}
          {tab !== "rejected" && (
            <Button size="sm" variant="destructive" className="gap-1 h-7 text-xs" onClick={() => moderate("reject")} disabled={loading !== null}>
              {loading === "reject" ? <Loader2 size={12} className="animate-spin" /> : <Ban size={12} />} Reddet
            </Button>
          )}
          {tab !== "hidden" && (
            <Button size="sm" variant="outline" className="gap-1 h-7 text-xs" onClick={() => moderate("hide")} disabled={loading !== null}>
              {loading === "hide" ? <Loader2 size={12} className="animate-spin" /> : <EyeOff size={12} />} Gizle
            </Button>
          )}
          <Button size="sm" variant="outline" className="gap-1 h-7 text-xs" onClick={() => setEditing(true)} disabled={loading !== null}>
            <Pencil size={12} /> Düzenle
          </Button>
          <Link href={`/universe/${universe.id}`}>
            <Button size="sm" variant="ghost" className="gap-1 h-7 text-xs"><Eye size={12} /> Görüntüle</Button>
          </Link>
          {(tab === "hidden" || tab === "rejected") && (
            <Button size="sm" variant="ghost" className="gap-1 h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => setConfirmDelete(true)} disabled={loading !== null}>
              {loading === "delete" ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />} Sil
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

// ── Admin Character Card ──────────────────────────────────────────────────────
function AdminCharacterCard({ char, tab, onAction }: { char: Character; tab: UniTab; onAction: () => void }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const moderate = async (action: "approve" | "reject" | "hide") => {
    if (!user) return;
    setLoading(action);
    try { await charactersDb.moderate(char.id, action, user.id); onAction(); }
    catch { /* silent */ } finally { setLoading(null); }
  };

  const permanentDelete = async () => {
    setLoading("delete");
    try { await charactersDb.delete(char.id); onAction(); }
    catch { /* silent */ } finally { setLoading(null); setConfirmDelete(false); }
  };

  return (
    <>
      {editing && <CharacterEditModal char={char} onClose={() => setEditing(false)} onSaved={onAction} />}
      <ConfirmModal open={confirmDelete} onClose={() => setConfirmDelete(false)} onConfirm={permanentDelete}
        title="Karakteri Kalıcı Olarak Sil"
        description={`"${char.name}" karakterini kalıcı olarak silmek istediğinden emin misin? Bu işlem geri alınamaz.`} />

      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="flex gap-3 p-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
            <img src={char.image} alt={char.name} className="w-full h-full object-cover"
              onError={e => { console.warn("[IMAGE] failed to load", char.image); (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(char.name)}&background=7C3AED&color=fff&size=100&bold=true`; }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-bold text-sm leading-tight line-clamp-1">{char.name}</h3>
              <StatusBadge status={char.status ?? "published"} />
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1 mb-1">{char.description || "—"}</p>
            <div className="flex flex-wrap gap-1 mb-1">
              <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-mono">{char.seriesId.slice(0, 8)}…</span>
              {(char.wins ?? 0) + (char.losses ?? 0) > 0 && (
                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">{char.wins ?? 0}W / {char.losses ?? 0}L</span>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground">
              {char.creatorId.slice(0, 12)}… · {char.createdAt ? new Date(char.createdAt).toLocaleDateString("tr-TR") : "—"}
            </p>
          </div>
        </div>
        <div className="border-t p-3 flex gap-2 flex-wrap">
          {(tab === "hidden" || tab === "rejected" || tab === "pending") && (
            <Button size="sm" className="gap-1 h-7 text-xs bg-green-600 hover:bg-green-700" onClick={() => moderate("approve")} disabled={loading !== null}>
              {loading === "approve" ? <Loader2 size={12} className="animate-spin" /> : <CheckCheck size={12} />} Yayınla
            </Button>
          )}
          {tab !== "rejected" && (
            <Button size="sm" variant="destructive" className="gap-1 h-7 text-xs" onClick={() => moderate("reject")} disabled={loading !== null}>
              {loading === "reject" ? <Loader2 size={12} className="animate-spin" /> : <Ban size={12} />} Reddet
            </Button>
          )}
          {tab !== "hidden" && (
            <Button size="sm" variant="outline" className="gap-1 h-7 text-xs" onClick={() => moderate("hide")} disabled={loading !== null}>
              {loading === "hide" ? <Loader2 size={12} className="animate-spin" /> : <EyeOff size={12} />} Gizle
            </Button>
          )}
          <Button size="sm" variant="outline" className="gap-1 h-7 text-xs" onClick={() => setEditing(true)} disabled={loading !== null}>
            <Pencil size={12} /> Düzenle
          </Button>
          {(tab === "hidden" || tab === "rejected") && (
            <Button size="sm" variant="ghost" className="gap-1 h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => setConfirmDelete(true)} disabled={loading !== null}>
              {loading === "delete" ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />} Sil
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

// ── Admin ToT Card ────────────────────────────────────────────────────────────
function AdminTotCard({ tot, tab, onAction }: { tot: ThisOrThat; tab: UniTab; onAction: () => void }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const moderate = async (action: "approve" | "reject" | "hide") => {
    if (!user) return;
    setLoading(action);
    try { await thisOrThatDb.moderate(tot.id, action, user.id); onAction(); }
    catch { /* silent */ } finally { setLoading(null); }
  };

  const permanentDelete = async () => {
    setLoading("delete");
    try { await thisOrThatDb.delete(tot.id); onAction(); }
    catch { /* silent */ } finally { setLoading(null); setConfirmDelete(false); }
  };

  const isNew = Array.isArray(tot.options) && tot.options.length >= 2;
  const coverSrc = tot.coverImage || (tot.imageA ?? "");
  const optCount = tot.optionCount ?? (isNew ? (tot.options?.length ?? 0) : 2);

  return (
    <>
      {editing && <TotEditModal tot={tot} onClose={() => setEditing(false)} onSaved={onAction} />}
      <ConfirmModal open={confirmDelete} onClose={() => setConfirmDelete(false)} onConfirm={permanentDelete}
        title="Bu mu O mu Kalıcı Olarak Sil"
        description={`"${tot.title}" oyununu kalıcı olarak silmek istediğinden emin misin? Bu işlem geri alınamaz.`} />

      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="flex gap-3 p-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
            {coverSrc ? (
              <img src={coverSrc} alt={tot.title} className="w-full h-full object-cover"
                onError={e => { console.warn("[IMAGE] failed to load", coverSrc); (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tot.title)}&background=0ea5e9&color=fff&size=100&bold=true`; }} />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-sky-500/20">
                <span className="text-sky-400 text-xl">🔀</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-bold text-sm leading-tight line-clamp-1">{tot.title}</h3>
              <StatusBadge status={tot.status ?? "published"} />
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1 mb-1">{tot.description || "—"}</p>
            <div className="flex flex-wrap gap-1 mb-1">
              {tot.category && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium">{tot.category}</span>}
              <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{optCount} seçenek</span>
              {(tot.playCount ?? 0) > 0 && <span className="text-[10px] bg-sky-500/10 text-sky-400 px-1.5 py-0.5 rounded">{tot.playCount} oynanma</span>}
            </div>
            <p className="text-[10px] text-muted-foreground">
              {tot.creatorId.slice(0, 12)}… · {tot.createdAt ? new Date(tot.createdAt).toLocaleDateString("tr-TR") : "—"}
            </p>
          </div>
        </div>
        <div className="border-t p-3 flex gap-2 flex-wrap">
          {(tab === "hidden" || tab === "rejected" || tab === "pending") && (
            <Button size="sm" className="gap-1 h-7 text-xs bg-green-600 hover:bg-green-700" onClick={() => moderate("approve")} disabled={loading !== null}>
              {loading === "approve" ? <Loader2 size={12} className="animate-spin" /> : <CheckCheck size={12} />} Yayınla
            </Button>
          )}
          {tab !== "rejected" && (
            <Button size="sm" variant="destructive" className="gap-1 h-7 text-xs" onClick={() => moderate("reject")} disabled={loading !== null}>
              {loading === "reject" ? <Loader2 size={12} className="animate-spin" /> : <Ban size={12} />} Reddet
            </Button>
          )}
          {tab !== "hidden" && (
            <Button size="sm" variant="outline" className="gap-1 h-7 text-xs" onClick={() => moderate("hide")} disabled={loading !== null}>
              {loading === "hide" ? <Loader2 size={12} className="animate-spin" /> : <EyeOff size={12} />} Gizle
            </Button>
          )}
          <Button size="sm" variant="outline" className="gap-1 h-7 text-xs" onClick={() => setEditing(true)} disabled={loading !== null}>
            <Pencil size={12} /> Düzenle
          </Button>
          <Link href={`/this-or-that/${tot.id}`}>
            <Button size="sm" variant="ghost" className="gap-1 h-7 text-xs"><Eye size={12} /> Görüntüle</Button>
          </Link>
          {(tab === "hidden" || tab === "rejected") && (
            <Button size="sm" variant="ghost" className="gap-1 h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => setConfirmDelete(true)} disabled={loading !== null}>
              {loading === "delete" ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />} Sil
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

// ── Report Card ───────────────────────────────────────────────────────────────
function ReportCard({ report, onAction }: { report: Report; onAction: () => void }) {
  const [loading, setLoading] = useState<string | null>(null);
  const resolve = async (action: "resolved" | "dismissed") => {
    setLoading(action);
    try { await reportsDb.resolve(report.id, action); onAction(); }
    catch { /* silent */ } finally { setLoading(null); }
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
          {loading === "resolved" ? <Loader2 size={12} className="animate-spin" /> : <CheckCheck size={12} />} Çöz
        </Button>
        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => resolve("dismissed")} disabled={loading !== null}>Reddet</Button>
        {report.contentType === "test" && (
          <Link href={`/test/${report.contentId}`}>
            <Button size="sm" variant="ghost" className="h-7 text-xs gap-1"><Eye size={12} /> Görüntüle</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

// ── UID Display ───────────────────────────────────────────────────────────────
function UIDDisplay({ uid }: { uid: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(uid).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button onClick={copy}
      className="flex items-center gap-1.5 font-mono text-xs bg-muted px-2 py-1 rounded-lg hover:bg-muted/80 transition-colors">
      {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} className="text-muted-foreground" />}
      <span className="text-muted-foreground">{uid}</span>
    </button>
  );
}

// ── Auth Diagnostic Panel ─────────────────────────────────────────────────────
function AuthDiagPanel() {
  const [diag, setDiag] = useState<AuthDiagnostics>(getAuthDiagnostics());
  const refresh = () => setDiag(getAuthDiagnostics());
  useEffect(() => { const id = setInterval(refresh, 2000); return () => clearInterval(id); }, []);

  const stateColor = (s: string) => {
    if (s === "success" || s === "app_user_loaded") return "text-green-500";
    if (s === "error" || s === "profile_error") return "text-red-500";
    if (s === "not_called" || s === "null" || s === "logged_out") return "text-muted-foreground";
    return "text-amber-500";
  };

  const Row = ({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) => (
    <div className="flex items-start gap-3 py-1.5 border-b last:border-0">
      <span className="text-[11px] text-muted-foreground w-40 shrink-0">{label}</span>
      <span className={`text-[11px] break-all ${mono ? "font-mono" : "font-medium"} ${stateColor(value)}`}>{value}</span>
    </div>
  );

  return (
    <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm flex items-center gap-2"><Activity size={15} className="text-primary" /> Auth Tanı Paneli</h3>
        <Button size="sm" variant="outline" onClick={refresh} className="h-7 text-xs gap-1"><RefreshCw size={12} /> Yenile</Button>
      </div>
      <div className="divide-y text-xs">
        <Row label="Firebase projectId" value={diag.projectId} mono />
        <Row label="Firebase authDomain" value={diag.authDomain} mono />
        <Row label="Current URL" value={diag.currentUrl} mono />
        <Row label="Firebase UID" value={diag.firebaseUserUid ?? "(null)"} mono />
        <Row label="Firebase Email" value={diag.firebaseUserEmail ?? "(null)"} mono />
        <Row label="onAuthStateChanged fired" value={diag.onAuthStateChangedFired ? "evet" : "hayır"} />
        <Row label="Son Google yöntemi" value={diag.lastGoogleLoginMethod ?? "henüz yok"} />
        <Row label="getRedirectResult çağrıldı mı" value={diag.redirectResultCalled ? "evet" : "hayır"} />
        <Row label="getRedirectResult durumu" value={diag.redirectResultStatus} />
        <Row label="Son hata kodu" value={diag.lastAuthErrorCode ?? "—"} mono />
        <Row label="Son hata mesajı" value={diag.lastAuthErrorMessage ?? "—"} />
        <Row label="Firestore upsert durumu" value={diag.firestoreUpsertStatus} />
        <Row label="Firestore read durumu" value={diag.firestoreReadStatus} />
        <Row label="Final kullanıcı durumu" value={diag.finalAppUserState} />
      </div>
    </div>
  );
}

// ── Generic status-filtered list section ──────────────────────────────────────
function UniverseStatusSection({ status, onRefresh }: { status: UniTab; onRefresh: () => void }) {
  const { data = [], isLoading } = useUniversesByStatus(status === "published" ? "published" : status);
  const label = { published: "Yayınlanan Evrenler", hidden: "Gizli Evrenler", rejected: "Reddedilen Evrenler", pending: "Bekleyen Evrenler" }[status];
  const icon = { published: <CheckCircle2 size={16} className="text-green-500" />, hidden: <EyeOff size={16} className="text-muted-foreground" />, rejected: <Ban size={16} className="text-destructive" />, pending: <AlertTriangle size={16} className="text-amber-500" /> }[status];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-base flex items-center gap-2">{icon} {label}</h2>
        <Button size="sm" variant="outline" onClick={onRefresh} className="h-7 text-xs">Yenile</Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={24} /></div>
      ) : data.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground"><p className="text-sm">Bu durumda evren yok.</p></div>
      ) : (
        <div className="space-y-3">
          {data.map(u => <AdminUniverseCard key={u.id} universe={u} tab={status} onAction={onRefresh} />)}
        </div>
      )}
    </div>
  );
}

function CharacterStatusSection({ status, onRefresh }: { status: UniTab; onRefresh: () => void }) {
  const { data = [], isLoading } = useCharactersByStatus(status === "published" ? "published" : status);
  const label = { published: "Yayınlanan Karakterler", hidden: "Gizli Karakterler", rejected: "Reddedilen Karakterler", pending: "Bekleyen Karakterler" }[status];
  const icon = { published: <CheckCircle2 size={16} className="text-green-500" />, hidden: <EyeOff size={16} className="text-muted-foreground" />, rejected: <Ban size={16} className="text-destructive" />, pending: <AlertTriangle size={16} className="text-amber-500" /> }[status];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-base flex items-center gap-2">{icon} {label}</h2>
        <Button size="sm" variant="outline" onClick={onRefresh} className="h-7 text-xs">Yenile</Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={24} /></div>
      ) : data.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground"><p className="text-sm">Bu durumda karakter yok.</p></div>
      ) : (
        <div className="space-y-3">
          {data.map(c => <AdminCharacterCard key={c.id} char={c} tab={status} onAction={onRefresh} />)}
        </div>
      )}
    </div>
  );
}

function TotStatusSection({ status, onRefresh }: { status: UniTab; onRefresh: () => void }) {
  const { data = [], isLoading } = useThisOrThatsByStatus(status === "published" ? "published" : status);
  const label = { published: "Yayınlanan Oyunlar", hidden: "Gizli Oyunlar", rejected: "Reddedilen Oyunlar", pending: "Bekleyen Oyunlar" }[status];
  const icon = { published: <CheckCircle2 size={16} className="text-green-500" />, hidden: <EyeOff size={16} className="text-muted-foreground" />, rejected: <Ban size={16} className="text-destructive" />, pending: <AlertTriangle size={16} className="text-amber-500" /> }[status];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-base flex items-center gap-2">{icon} {label}</h2>
        <Button size="sm" variant="outline" onClick={onRefresh} className="h-7 text-xs">Yenile</Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={24} /></div>
      ) : data.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground"><p className="text-sm">Bu durumda oyun yok.</p></div>
      ) : (
        <div className="space-y-3">
          {data.map(t => <AdminTotCard key={t.id} tot={t} tab={status} onAction={onRefresh} />)}
        </div>
      )}
    </div>
  );
}

// ── Universe Admin Panel ──────────────────────────────────────────────────────
function UniverseAdminPanel() {
  const qc = useQueryClient();
  const [subTab, setSubTab] = useState<UniTab>("hidden");

  const refresh = () => {
    ["published", "hidden", "rejected", "pending"].forEach(s =>
      qc.invalidateQueries({ queryKey: ["admin-universes-status", s] })
    );
  };

  const SUB_TABS: { key: UniTab; label: string }[] = [
    { key: "hidden", label: "Gizli" },
    { key: "rejected", label: "Reddedilen" },
    { key: "pending", label: "Bekleyen" },
    { key: "published", label: "Yayınlanan" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex border-b gap-0 overflow-x-auto">
        {SUB_TABS.map(t => (
          <button key={t.key} onClick={() => setSubTab(t.key)}
            className={`px-3 py-2 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${subTab === t.key ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {t.label}
          </button>
        ))}
      </div>
      <UniverseStatusSection key={subTab} status={subTab} onRefresh={refresh} />
    </div>
  );
}

function CharacterAdminPanel() {
  const qc = useQueryClient();
  const [subTab, setSubTab] = useState<UniTab>("hidden");

  const refresh = () => {
    ["published", "hidden", "rejected", "pending"].forEach(s =>
      qc.invalidateQueries({ queryKey: ["admin-characters-status", s] })
    );
  };

  const SUB_TABS: { key: UniTab; label: string }[] = [
    { key: "hidden", label: "Gizli" },
    { key: "rejected", label: "Reddedilen" },
    { key: "pending", label: "Bekleyen" },
    { key: "published", label: "Yayınlanan" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex border-b gap-0 overflow-x-auto">
        {SUB_TABS.map(t => (
          <button key={t.key} onClick={() => setSubTab(t.key)}
            className={`px-3 py-2 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${subTab === t.key ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {t.label}
          </button>
        ))}
      </div>
      <CharacterStatusSection key={subTab} status={subTab} onRefresh={refresh} />
    </div>
  );
}

function TotAdminPanel() {
  const qc = useQueryClient();
  const [subTab, setSubTab] = useState<UniTab>("hidden");

  const refresh = () => {
    ["published", "hidden", "rejected", "pending"].forEach(s =>
      qc.invalidateQueries({ queryKey: ["admin-this-or-that-status", s] })
    );
  };

  const SUB_TABS: { key: UniTab; label: string }[] = [
    { key: "hidden", label: "Gizli" },
    { key: "rejected", label: "Reddedilen" },
    { key: "pending", label: "Bekleyen" },
    { key: "published", label: "Yayınlanan" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex border-b gap-0 overflow-x-auto">
        {SUB_TABS.map(t => (
          <button key={t.key} onClick={() => setSubTab(t.key)}
            className={`px-3 py-2 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${subTab === t.key ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {t.label}
          </button>
        ))}
      </div>
      <TotStatusSection key={subTab} status={subTab} onRefresh={refresh} />
    </div>
  );
}

// ── Admin Logs Panel ──────────────────────────────────────────────────────────
function AdminLogsPanel() {
  const { data: logs = [], isLoading } = useQuery<ActionLog[]>({
    queryKey: ["admin-logs"],
    queryFn: () => actionLogsDb.getAll(100),
    staleTime: 0,
  });

  const actionColors: Record<string, string> = {
    approve: "text-green-500",
    reject: "text-red-500",
    hide: "text-amber-500",
    ban: "text-destructive",
    unban: "text-blue-500",
    seed: "text-purple-500",
    restore: "text-teal-500",
    announce: "text-primary",
    role_change: "text-violet-500",
  };

  return (
    <div className="bg-card border rounded-2xl p-4 space-y-3">
      {isLoading ? (
        <div className="flex justify-center py-6"><Loader2 className="animate-spin" size={20} /></div>
      ) : logs.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">Kayıt yok.</p>
      ) : (
        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {logs.map(log => (
            <div key={log.id} className="flex items-start gap-3 border-b pb-2 last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono">
                  <span className={`font-bold ${actionColors[log.action] ?? "text-foreground"}`}>{log.action}</span>
                  {log.targetType && <span className="text-muted-foreground"> · {log.targetType}</span>}
                  {log.targetId && <span className="text-muted-foreground"> #{log.targetId.slice(0, 8)}</span>}
                </p>
                {log.note && <p className="text-[10px] text-muted-foreground">{log.note}</p>}
                {log.createdAt && <p className="text-[10px] text-muted-foreground">{new Date(log.createdAt).toLocaleString("tr-TR")}</p>}
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0">{log.adminId.slice(0, 6)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Hooks for test management ─────────────────────────────────────────────────
function useTestsByStatus(status: NonNullable<Test["status"]>, enabled: boolean) {
  return useQuery<Test[]>({
    queryKey: ["admin-tests-status", status],
    queryFn: () => testsDb.getByStatus(status),
    staleTime: 0, enabled,
  });
}
function usePendingTests(enabled: boolean) {
  return useQuery<Test[]>({
    queryKey: ["admin-pending-tests"],
    queryFn: () => testsDb.getPending(),
    staleTime: 0, enabled,
  });
}
function useOpenReports(enabled: boolean) {
  return useQuery<Report[]>({
    queryKey: ["admin-open-reports"],
    queryFn: () => reportsDb.getOpen(),
    staleTime: 0, enabled,
  });
}

// ── Main AdminPage ────────────────────────────────────────────────────────────
type Tab = "pending" | "reports" | "grouped-reports" | "hidden" | "rejected" | "published" | "universes" | "characters" | "tot" | "archive" | "announcements" | "logs" | "guess" | "users" | "seed" | "info" | "auth-diag";

export default function AdminPage() {
  const { t } = useTranslation();
  const { user, roleInfo } = useAuth();
  const qc = useQueryClient();

  const [seeding, setSeeding] = useState(false);
  const [progress, setProgress] = useState<{ msg: string; pct: number } | null>(null);
  const [done, setDone] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("pending");

  const canModerate = roleInfo?.canModerate ?? false;
  const isAdmin = roleInfo?.isAdmin ?? false;

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
  const { data: groupedReports = [], isLoading: loadingGrouped } = useGroupedReports(canModerate && activeTab === "grouped-reports");
  const { data: archivedTests = [], isLoading: loadingArchivedTests } = useArchivedTests(canModerate && activeTab === "archive");
  const { data: archivedUniverses = [], isLoading: loadingArchivedUniverses } = useArchivedUniverses(canModerate && activeTab === "archive");
  const { data: archivedCharacters = [], isLoading: loadingArchivedChars } = useArchivedCharacters(canModerate && activeTab === "archive");
  const { data: announcements = [], isLoading: loadingAnnouncements } = useAnnouncements();
  const { data: guessTasks = [], isLoading: loadingGuess } = useGuessTasks();

  // Announcement form state
  const [annTitle, setAnnTitle] = useState("");
  const [annBody, setAnnBody] = useState("");
  const [annType, setAnnType] = useState<Announcement["type"]>("info");
  const [savingAnn, setSavingAnn] = useState(false);

  // Guess task form state
  const [guessChars, setGuessChars] = useState<string[]>([]);
  const [guessTitle, setGuessTitle] = useState("");
  const [guessImages, setGuessImages] = useState<string[]>(["", "", "", ""]);
  const [guessAnswer, setGuessAnswer] = useState(0);
  const [savingGuess, setSavingGuess] = useState(false);

  // User management state
  const [userQuery, setUserQuery] = useState("");
  const [userResult, setUserResult] = useState<import("../lib/db").AppUser | null>(null);
  const [searchingUser, setSearchingUser] = useState(false);
  const [userAction, setUserAction] = useState<string | null>(null);

  const handleSaveAnnouncement = async () => {
    if (!annTitle.trim() || !annBody.trim() || !user) return;
    setSavingAnn(true);
    try {
      await announcementsDb.create({ title: annTitle.trim(), body: annBody.trim(), type: annType, createdBy: user.id });
      setAnnTitle(""); setAnnBody(""); setAnnType("info");
      qc.invalidateQueries({ queryKey: ["announcements"] });
    } catch { /* non-fatal */ }
    setSavingAnn(false);
  };

  const handleDeleteAnnouncement = async (id: string) => {
    await announcementsDb.delete(id);
    qc.invalidateQueries({ queryKey: ["announcements"] });
  };

  const handleSaveGuessTask = async () => {
    if (!guessTitle.trim() || guessImages.filter(Boolean).length < 2 || !user) return;
    setSavingGuess(true);
    try {
      await guessTasksDb.create({
        title: guessTitle.trim(),
        images: guessImages.filter(Boolean),
        answerIndex: guessAnswer,
        characterIds: guessChars,
        createdBy: user.id,
      });
      setGuessTitle(""); setGuessImages(["", "", "", ""]); setGuessAnswer(0); setGuessChars([]);
      qc.invalidateQueries({ queryKey: ["guess-tasks"] });
    } catch { /* non-fatal */ }
    setSavingGuess(false);
  };

  const handleSearchUser = async () => {
    if (!userQuery.trim()) return;
    setSearchingUser(true);
    setUserResult(null);
    try {
      const result = await usersDb.searchByEmail(userQuery.trim().toLowerCase());
      setUserResult(result ?? null);
    } catch { /* non-fatal */ }
    setSearchingUser(false);
  };

  const handleRestoreTest = async (id: string) => {
    await testsDb.restore(id);
    qc.invalidateQueries({ queryKey: ["archived-tests"] });
  };

  const handleRestoreUniverse = async (id: string) => {
    await universesDb.restore(id);
    qc.invalidateQueries({ queryKey: ["archived-universes"] });
  };

  const handleRestoreCharacter = async (id: string) => {
    await charactersDb.restore(id);
    qc.invalidateQueries({ queryKey: ["archived-characters"] });
  };

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
    setSeeding(true); setDone(false); setProgress({ msg: "Starting...", pct: 0 });
    try {
      await seedDatabase((msg, pct) => setProgress({ msg, pct }));
      setDone(true); refetchSeed();
    } catch (e: unknown) {
      setProgress({ msg: `Error: ${e instanceof Error ? e.message : "Unknown"}`, pct: 0 });
    } finally { setSeeding(false); }
  };

  const refreshAll = () => {
    qc.invalidateQueries({ queryKey: ["admin-pending-tests"] });
    qc.invalidateQueries({ queryKey: ["admin-open-reports"] });
    ["hidden", "rejected", "published"].forEach(s =>
      qc.invalidateQueries({ queryKey: ["admin-tests-status", s] })
    );
    qc.invalidateQueries({ queryKey: ["tests"] });
  };

  const TABS: { key: Tab; label: string; count?: number; adminOnly?: boolean }[] = (
    [
      { key: "pending" as Tab, label: "Bekleyen", count: pendingTests.length },
      { key: "reports" as Tab, label: "Raporlar", count: openReports.length },
      { key: "grouped-reports" as Tab, label: "Gruplu Raporlar" },
      { key: "hidden" as Tab, label: "Gizli Testler" },
      { key: "rejected" as Tab, label: "Reddedilen Testler" },
      { key: "published" as Tab, label: "Testler" },
      { key: "universes" as Tab, label: "Evrenler" },
      { key: "characters" as Tab, label: "Karakterler" },
      { key: "tot" as Tab, label: "Bu mu O mu" },
      { key: "archive" as Tab, label: "Arşiv", adminOnly: true },
      { key: "announcements" as Tab, label: "Duyurular" },
      { key: "guess" as Tab, label: "Guess Tasks" },
      { key: "users" as Tab, label: "Kullanıcılar" },
      { key: "logs" as Tab, label: "Kayıtlar", adminOnly: true },
      { key: "seed" as Tab, label: "Veritabanı" },
      { key: "info" as Tab, label: "Bilgi" },
      { key: "auth-diag" as Tab, label: "Auth Tanı", adminOnly: true },
    ] as { key: Tab; label: string; count?: number; adminOnly?: boolean }[]
  ).filter(tab => !tab.adminOnly || isAdmin);

  return (
    <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck size={28} className="text-primary" />
          <h1 className="text-2xl font-black">Admin Panel</h1>
          <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">{roleInfo?.role ?? "—"}</span>
        </div>

        <div className="flex border-b mb-6 gap-0 overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${activeTab === tab.key ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white">{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── Bekleyen ── */}
        {activeTab === "pending" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-500" /> Bekleyen / Şüpheli Testler
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
                {pendingTests.map(test => <AdminTestCard key={test.id} test={test} tab="pending" onAction={refreshAll} />)}
              </div>
            )}
          </div>
        )}

        {/* ── Raporlar ── */}
        {activeTab === "reports" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base flex items-center gap-2"><Flag size={16} className="text-red-500" /> Açık Raporlar</h2>
              <Button size="sm" variant="outline" onClick={refreshAll} className="h-7 text-xs">Yenile</Button>
            </div>
            {loadingReports ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={24} /></div>
            ) : openReports.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle2 size={32} className="mx-auto mb-2 text-green-500" /><p className="text-sm">Açık rapor yok.</p>
              </div>
            ) : (
              <div className="space-y-3">{openReports.map(report => <ReportCard key={report.id} report={report} onAction={refreshAll} />)}</div>
            )}
          </div>
        )}

        {/* ── Gizli Testler ── */}
        {activeTab === "hidden" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base flex items-center gap-2">
                <EyeOff size={16} className="text-muted-foreground" /> Gizli Testler
                <span className="text-xs font-normal text-muted-foreground">· Yayınla ile geri al</span>
              </h2>
              <Button size="sm" variant="outline" onClick={refreshAll} className="h-7 text-xs">Yenile</Button>
            </div>
            {loadingHidden ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={24} /></div>
            ) : hiddenTests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground"><p className="text-sm">Gizli test yok.</p></div>
            ) : (
              <div className="space-y-3">{hiddenTests.map(test => <AdminTestCard key={test.id} test={test} tab="hidden" onAction={refreshAll} />)}</div>
            )}
          </div>
        )}

        {/* ── Reddedilen Testler ── */}
        {activeTab === "rejected" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base flex items-center gap-2">
                <Ban size={16} className="text-destructive" /> Reddedilen Testler
                <span className="text-xs font-normal text-muted-foreground">· Yayınla ile geri al</span>
              </h2>
              <Button size="sm" variant="outline" onClick={refreshAll} className="h-7 text-xs">Yenile</Button>
            </div>
            {loadingRejected ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={24} /></div>
            ) : rejectedTests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground"><p className="text-sm">Reddedilen test yok.</p></div>
            ) : (
              <div className="space-y-3">{rejectedTests.map(test => <AdminTestCard key={test.id} test={test} tab="rejected" onAction={refreshAll} />)}</div>
            )}
          </div>
        )}

        {/* ── Yayınlanan Testler ── */}
        {activeTab === "published" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-500" /> Yayınlanan Testler
                <span className="text-xs font-normal text-muted-foreground">(son 100)</span>
              </h2>
              <Button size="sm" variant="outline" onClick={refreshAll} className="h-7 text-xs">Yenile</Button>
            </div>
            {loadingPublished ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={24} /></div>
            ) : publishedTests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground"><p className="text-sm">Yayınlanan test yok.</p></div>
            ) : (
              <div className="space-y-3">{publishedTests.map(test => <AdminTestCard key={test.id} test={test} tab="published" onAction={refreshAll} />)}</div>
            )}
          </div>
        )}

        {/* ── Evrenler ── */}
        {activeTab === "universes" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Globe size={18} className="text-primary" />
              <h2 className="font-bold text-base">Evren Yönetimi</h2>
            </div>
            <UniverseAdminPanel />
          </div>
        )}

        {/* ── Karakterler ── */}
        {activeTab === "characters" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <User size={18} className="text-primary" />
              <h2 className="font-bold text-base">Karakter Yönetimi</h2>
            </div>
            <CharacterAdminPanel />
          </div>
        )}

        {/* ── Bu mu O mu ── */}
        {activeTab === "tot" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg">🔀</span>
              <h2 className="font-bold text-base">Bu mu O mu Yönetimi</h2>
            </div>
            <TotAdminPanel />
          </div>
        )}

        {/* ── Gruplu Raporlar ── */}
        {activeTab === "grouped-reports" && (
          <div className="space-y-4">
            <h2 className="font-bold text-base flex items-center gap-2"><Flag size={16} className="text-red-500" /> Gruplu Raporlar</h2>
            {loadingGrouped ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={24} /></div>
            ) : groupedReports.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">Gruplu rapor yok.</div>
            ) : (
              <div className="space-y-3">
                {groupedReports.map((g) => (
                  <div key={g.itemId} className="border rounded-2xl bg-card p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{g.itemTitle || g.itemId}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{g.type} · {g.reportCount} rapor</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {g.reasons.map((r, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 font-medium">{r}</span>
                          ))}
                        </div>
                      </div>
                      <span className="text-lg font-black text-red-500 shrink-0">{g.reportCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Arşiv ── */}
        {activeTab === "archive" && (
          <div className="space-y-6">
            <h2 className="font-bold text-base flex items-center gap-2"><Archive size={16} className="text-primary" /> Arşivlenmiş İçerikler</h2>

            {/* Arşiv: Testler */}
            <div>
              <h3 className="text-sm font-bold mb-3 text-muted-foreground uppercase tracking-wide">Testler ({archivedTests.length})</h3>
              {loadingArchivedTests ? <div className="flex justify-center py-6"><Loader2 className="animate-spin" size={20} /></div> :
                archivedTests.length === 0 ? <p className="text-sm text-muted-foreground">Arşivlenmiş test yok.</p> : (
                  <div className="space-y-2">
                    {archivedTests.map(test => (
                      <div key={test.id} className="border rounded-xl bg-card p-3 flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{test.title}</p>
                          <p className="text-xs text-muted-foreground">{test.archivedAt ? new Date(test.archivedAt).toLocaleDateString("tr-TR") : "—"} tarihinde arşivlendi</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleRestoreTest(test.id)} className="gap-1 h-7 text-xs shrink-0">
                          <RotateCcw size={11} /> Geri Al
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
            </div>

            {/* Arşiv: Evrenler */}
            <div>
              <h3 className="text-sm font-bold mb-3 text-muted-foreground uppercase tracking-wide">Evrenler ({archivedUniverses.length})</h3>
              {loadingArchivedUniverses ? <div className="flex justify-center py-6"><Loader2 className="animate-spin" size={20} /></div> :
                archivedUniverses.length === 0 ? <p className="text-sm text-muted-foreground">Arşivlenmiş evren yok.</p> : (
                  <div className="space-y-2">
                    {archivedUniverses.map(u => (
                      <div key={u.id} className="border rounded-xl bg-card p-3 flex items-center justify-between gap-3">
                        <p className="font-medium text-sm truncate flex-1">{u.name}</p>
                        <Button size="sm" variant="outline" onClick={() => handleRestoreUniverse(u.id)} className="gap-1 h-7 text-xs shrink-0">
                          <RotateCcw size={11} /> Geri Al
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
            </div>

            {/* Arşiv: Karakterler */}
            <div>
              <h3 className="text-sm font-bold mb-3 text-muted-foreground uppercase tracking-wide">Karakterler ({archivedCharacters.length})</h3>
              {loadingArchivedChars ? <div className="flex justify-center py-6"><Loader2 className="animate-spin" size={20} /></div> :
                archivedCharacters.length === 0 ? <p className="text-sm text-muted-foreground">Arşivlenmiş karakter yok.</p> : (
                  <div className="space-y-2">
                    {archivedCharacters.map(c => (
                      <div key={c.id} className="border rounded-xl bg-card p-3 flex items-center justify-between gap-3">
                        <p className="font-medium text-sm truncate flex-1">{c.name}</p>
                        <Button size="sm" variant="outline" onClick={() => handleRestoreCharacter(c.id)} className="gap-1 h-7 text-xs shrink-0">
                          <RotateCcw size={11} /> Geri Al
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        )}

        {/* ── Duyurular ── */}
        {activeTab === "announcements" && (
          <div className="space-y-6">
            <h2 className="font-bold text-base flex items-center gap-2"><Megaphone size={16} className="text-primary" /> Duyuru Yönetimi</h2>

            {/* Yeni Duyuru */}
            <div className="bg-card border rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-sm">Yeni Duyuru</h3>
              <div className="space-y-3">
                <Input placeholder="Başlık" value={annTitle} onChange={e => setAnnTitle(e.target.value)} />
                <textarea
                  placeholder="Duyuru metni..."
                  value={annBody} onChange={e => setAnnBody(e.target.value)} rows={3}
                  className="w-full text-sm bg-muted border rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <select value={annType} onChange={e => setAnnType(e.target.value as Announcement["type"])}
                  className="w-full text-sm bg-muted border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="info">Bilgi</option>
                  <option value="warning">Uyarı</option>
                  <option value="success">Başarı</option>
                  <option value="event">Etkinlik</option>
                </select>
                <Button onClick={handleSaveAnnouncement} disabled={savingAnn || !annTitle.trim() || !annBody.trim()} className="gap-2 w-full">
                  {savingAnn ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Duyuru Yayınla
                </Button>
              </div>
            </div>

            {/* Mevcut Duyurular */}
            <div className="space-y-3">
              {loadingAnnouncements ? <div className="flex justify-center py-6"><Loader2 className="animate-spin" size={20} /></div> :
                announcements.length === 0 ? <p className="text-sm text-muted-foreground">Duyuru yok.</p> : (
                  announcements.map(ann => {
                    const typeColors: Record<string, string> = { info: "bg-blue-500/10 text-blue-500", warning: "bg-amber-500/10 text-amber-500", success: "bg-green-500/10 text-green-500", event: "bg-purple-500/10 text-purple-500" };
                    return (
                      <div key={ann.id} className="border rounded-xl bg-card p-4 flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeColors[ann.type] ?? "bg-muted"}`}>{ann.type}</span>
                            <p className="font-bold text-sm">{ann.title}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{ann.body}</p>
                          {ann.createdAt && <p className="text-[10px] text-muted-foreground mt-1">{new Date(ann.createdAt).toLocaleDateString("tr-TR")}</p>}
                        </div>
                        <button onClick={() => handleDeleteAnnouncement(ann.id)} className="text-destructive hover:text-destructive/80 shrink-0">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    );
                  })
                )}
            </div>
          </div>
        )}

        {/* ── Guess Tasks ── */}
        {activeTab === "guess" && (
          <div className="space-y-6">
            <h2 className="font-bold text-base flex items-center gap-2"><HelpCircle size={16} className="text-primary" /> Guess The Beta — Görev Yönetimi</h2>

            {/* Yeni Görev */}
            <div className="bg-card border rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-sm">Yeni Tahmin Görevi</h3>
              <Input placeholder="Karakter / Soru adı" value={guessTitle} onChange={e => setGuessTitle(e.target.value)} />
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Görseller (en az 2)</p>
                {guessImages.map((img, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
                    <Input
                      placeholder={`Görsel ${i + 1} URL`}
                      value={img}
                      onChange={e => {
                        const updated = [...guessImages];
                        updated[i] = e.target.value;
                        setGuessImages(updated);
                      }}
                    />
                    <input
                      type="radio"
                      name="answerIdx"
                      checked={guessAnswer === i}
                      onChange={() => setGuessAnswer(i)}
                      title="Doğru cevap"
                    />
                  </div>
                ))}
                <p className="text-[10px] text-muted-foreground">Radio buton ile doğru görseli işaretle</p>
              </div>
              <Button onClick={handleSaveGuessTask} disabled={savingGuess || !guessTitle.trim() || guessImages.filter(Boolean).length < 2} className="gap-2 w-full">
                {savingGuess ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Görevi Kaydet
              </Button>
            </div>

            {/* Mevcut Görevler */}
            <div className="space-y-3">
              {loadingGuess ? <div className="flex justify-center py-6"><Loader2 className="animate-spin" size={20} /></div> :
                guessTasks.length === 0 ? <p className="text-sm text-muted-foreground">Görev yok. Yukarıdan ekle.</p> : (
                  guessTasks.map(task => (
                    <div key={task.id} className="border rounded-xl bg-card p-4 flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm">{task.title}</p>
                        <p className="text-xs text-muted-foreground">{task.images.length} görsel · Doğru: #{task.answerIndex + 1} · {task.playCount ?? 0} oynama</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        {task.images.slice(0, 2).map((img, i) => (
                          <img key={i} src={img} alt="" className="w-8 h-8 rounded object-cover border" onError={() => {}} />
                        ))}
                      </div>
                    </div>
                  ))
                )}
            </div>
          </div>
        )}

        {/* ── Kullanıcılar ── */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <h2 className="font-bold text-base flex items-center gap-2"><Users size={16} className="text-primary" /> Kullanıcı Yönetimi</h2>

            <div className="bg-card border rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-sm">E-posta ile Ara</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="kullanici@email.com"
                  value={userQuery}
                  onChange={e => setUserQuery(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSearchUser()}
                />
                <Button onClick={handleSearchUser} disabled={searchingUser} className="gap-1 shrink-0">
                  {searchingUser ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />}
                  Ara
                </Button>
              </div>

              {userResult && (
                <div className="border rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={userResult.avatar} alt={userResult.name} className="w-10 h-10 rounded-full" onError={() => {}} />
                    <div>
                      <p className="font-bold text-sm">{userResult.name}</p>
                      <p className="text-xs text-muted-foreground">{userResult.email}</p>
                    </div>
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">{userResult.role ?? "MEMBER"}</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {isAdmin && (
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={async () => {
                        if (!userResult.id) return;
                        await usersDb.update(userResult.id, { role: "VERIFIED_USER" });
                        setUserResult({ ...userResult, role: "VERIFIED_USER" } as any);
                      }}>
                        <CheckCheck size={11} /> Doğrulanmış Yap
                      </Button>
                    )}
                    {isAdmin && (
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={async () => {
                        if (!userResult.id) return;
                        await usersDb.update(userResult.id, { role: "MODERATOR" });
                        setUserResult({ ...userResult, role: "MODERATOR" } as any);
                      }}>
                        <ShieldCheck size={11} /> Moderatör Yap
                      </Button>
                    )}
                    {canModerate && (
                      <Button size="sm" variant="destructive" className="h-7 text-xs gap-1" onClick={async () => {
                        if (!userResult.id) return;
                        const newBanned = !userResult.isBanned;
                        await usersDb.update(userResult.id, { isBanned: newBanned });
                        setUserResult({ ...userResult, isBanned: newBanned });
                      }}>
                        <Ban size={11} /> {userResult.isBanned ? "Yasağı Kaldır" : "Yasakla"}
                      </Button>
                    )}
                  </div>
                </div>
              )}
              {!userResult && !searchingUser && userQuery && (
                <p className="text-sm text-muted-foreground">Kullanıcı bulunamadı.</p>
              )}
            </div>
          </div>
        )}

        {/* ── Action Logs ── */}
        {activeTab === "logs" && (
          <div className="space-y-4">
            <h2 className="font-bold text-base flex items-center gap-2"><ClipboardList size={16} className="text-primary" /> İşlem Kayıtları</h2>
            <AdminLogsPanel />
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
              <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="animate-spin" size={16} /> Kontrol ediliyor...</div>
            ) : needsSeed === false ? (
              <div className="flex items-center gap-2 text-green-500"><CheckCircle2 size={18} /> Veritabanı evren ve karakterlerle dolu.</div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Veritabanı boş. <strong>60+ evren</strong> ve <strong>200+ karakter</strong> ile doldurabilirsin.
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
            {done && <div className="flex items-center gap-2 text-green-500 animate-in fade-in"><CheckCircle2 size={18} /> {t("msg_seed_complete")}</div>}
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
              <div className="flex items-center gap-3 mb-2"><Users size={20} className="text-primary" /><h2 className="text-lg font-bold">Hesap Bilgisi</h2></div>
              <div className="space-y-3">
                <div><p className="text-xs text-muted-foreground mb-1">E-posta</p><p className="text-sm font-medium">{user.email}</p></div>
                <div><p className="text-xs text-muted-foreground mb-1">Firebase UID</p><UIDDisplay uid={user.id} />
                  <p className="text-xs text-muted-foreground mt-1">Bu UID'yi VITE_ADMIN_UIDS ortam değişkenine ekleyerek admin yetkisi verebilirsin.</p></div>
                <div><p className="text-xs text-muted-foreground mb-1">Rol</p>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">{roleInfo?.role ?? "—"}</span></div>
                <div><p className="text-xs text-muted-foreground mb-1">Hesap Oluşturma</p>
                  <p className="text-sm">{user.createdAt ? new Date(user.createdAt).toLocaleDateString("tr-TR") : "—"}</p></div>
              </div>
            </div>
            <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-2">
              <h3 className="font-bold text-sm mb-3">Hızlı Linkler</h3>
              <div className="grid grid-cols-2 gap-3">
                {[{ href: "/universes", label: "Evrenler" }, { href: "/duels", label: "Düellolar" }, { href: "/tests", label: "Testler" }, { href: "/tierlists", label: "Tier Listler" }, { href: "/this-or-that", label: "Bu mu O mu" }]
                  .map(item => (
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

        {/* ── Auth Tanı ── */}
        {activeTab === "auth-diag" && isAdmin && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base flex items-center gap-2"><Activity size={16} className="text-primary" /> Auth Tanı Paneli</h2>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-700 dark:text-amber-400">
              Bu panel yalnızca Google Login sorunlarını teşhis etmek için tasarlanmıştır.
            </div>
            <AuthDiagPanel />
            <div className="bg-card border rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-sm">Ortam Değişkenleri</h3>
              <div className="space-y-1.5 font-mono text-xs">
                {["VITE_FIREBASE_API_KEY", "VITE_FIREBASE_AUTH_DOMAIN", "VITE_FIREBASE_PROJECT_ID", "VITE_FIREBASE_STORAGE_BUCKET", "VITE_FIREBASE_MESSAGING_SENDER_ID", "VITE_FIREBASE_APP_ID", "VITE_ADMIN_EMAILS", "VITE_ADMIN_UIDS", "VITE_CLOUDINARY_CLOUD_NAME", "VITE_CLOUDINARY_UPLOAD_PRESET"].map(key => {
                  const raw = import.meta.env[key] as string | undefined;
                  const set = !!raw;
                  return (
                    <div key={key} className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground">{key}</span>
                      <span className={set ? "text-green-500" : "text-red-500"}>
                        {set ? (key.includes("CLOUDINARY") || key.includes("ADMIN") ? raw.slice(0, 6) + "…" : "✓ set") : "✗ missing"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-card border rounded-2xl p-5 space-y-2">
              <h3 className="font-bold text-sm mb-2">Google Login Kontrol Listesi</h3>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li>✓ Firebase Console → Authentication → Sign-in methods → Google etkin mi?</li>
                <li>✓ Firebase Console → Authentication → Authorized Domains → tüm alan adları eklendi mi?</li>
                <li>✓ VITE_FIREBASE_AUTH_DOMAIN doğru mu?</li>
                <li>✓ Popup engellendi mi? (Mobil → redirect; Desktop → popup)</li>
                <li>✓ Konsolda <code className="bg-muted px-1 rounded">[AUTH]</code> logları kontrol et</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
