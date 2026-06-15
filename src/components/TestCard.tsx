import { useState } from "react";
import { Link } from "wouter";
import { Play, Users, Flag, EyeOff, CheckCheck, Ban } from "lucide-react";
import { LikeButton } from "./LikeButton";
import { FavoriteButton } from "./FavoriteButton";
import { useAuth } from "../contexts/AuthContext";
import { testsDb, reportsDb } from "../lib/db";
import { useQueryClient } from "@tanstack/react-query";
import type { Test } from "../lib/db";

interface TestCardProps {
  test: Test;
}

const REPORT_REASONS = [
  "Uygunsuz içerik",
  "Nefret söylemi",
  "Spam",
  "Telif hakkı",
  "Yanlış/aldatıcı içerik",
  "Diğer",
];

function ReportModal({ testId, onClose }: { testId: string; onClose: () => void }) {
  const { user } = useAuth();
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!reason || !user) return;
    setLoading(true);
    setError(null);
    try {
      await reportsDb.create({
        contentType: "test",
        contentId: testId,
        reportedBy: user.id,
        reason,
        details: details.trim() || undefined,
      });
      setDone(true);
    } catch (e: unknown) {
      if (e instanceof Error && e.message === "already_reported") {
        setError("Bu içeriği zaten raporladın.");
      } else {
        setError("Rapor gönderilemedi, lütfen tekrar dene.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-card border rounded-2xl shadow-2xl w-full max-w-sm p-5 z-10"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="font-bold text-base mb-3 flex items-center gap-2">
          <Flag size={16} className="text-red-500" /> Rapor Et
        </h3>
        {done ? (
          <div className="text-center py-4">
            <CheckCheck size={32} className="mx-auto mb-2 text-green-500" />
            <p className="text-sm font-medium">Rapor alındı. Teşekkürler.</p>
            <button onClick={onClose} className="mt-3 text-sm text-primary hover:underline">Kapat</button>
          </div>
        ) : (
          <>
            <div className="space-y-2 mb-3">
              {REPORT_REASONS.map(r => (
                <label key={r} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="reason"
                    value={r}
                    checked={reason === r}
                    onChange={() => setReason(r)}
                    className="accent-primary"
                  />
                  <span className="text-sm">{r}</span>
                </label>
              ))}
            </div>
            <textarea
              value={details}
              onChange={e => setDetails(e.target.value)}
              placeholder="Açıklama (isteğe bağlı)"
              rows={2}
              className="w-full text-sm bg-muted border rounded-lg px-3 py-2 resize-none mb-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {error && <p className="text-xs text-destructive mb-2">{error}</p>}
            <div className="flex gap-2">
              <button
                onClick={submit}
                disabled={!reason || loading}
                className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-bold hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                {loading ? "Gönderiliyor..." : "Gönder"}
              </button>
              <button
                onClick={onClose}
                className="px-3 py-2 rounded-lg border text-sm hover:bg-muted transition-colors"
              >
                İptal
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function TestCard({ test }: TestCardProps) {
  const { user, roleInfo } = useAuth();
  const qc = useQueryClient();
  const [showReport, setShowReport] = useState(false);
  const [moderating, setModerating] = useState<string | null>(null);

  const canModerate = roleInfo?.canModerate ?? false;

  const moderate = async (action: "approve" | "reject" | "hide") => {
    if (!user) return;
    setModerating(action);
    try {
      await testsDb.moderate(test.id, action, user.id);
      qc.invalidateQueries({ queryKey: ["tests"] });
      qc.invalidateQueries({ queryKey: ["admin-pending-tests"] });
    } catch {
      /* silent */
    } finally {
      setModerating(null);
    }
  };

  return (
    <>
      {showReport && <ReportModal testId={test.id} onClose={() => setShowReport(false)} />}

      <div className="group relative flex flex-col rounded-xl bg-card border border-border overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
        <Link href={`/test/${test.id}`} className="absolute inset-0 z-10">
          <span className="sr-only">View test {test.title}</span>
        </Link>

        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          <img
            src={test.coverImage}
            alt={test.title}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(test.title)}&background=7C3AED&color=fff&size=400&bold=true`;
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-2 right-2 z-20">
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-bold shadow-sm flex items-center gap-1">
              <Users size={12} /> {test.characterIds.length}
            </span>
          </div>

          {canModerate && test.status && test.status !== "published" && (
            <div className="absolute top-2 left-2 z-20">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                test.status === "pending" ? "bg-amber-500 text-white" :
                test.status === "hidden" ? "bg-muted text-muted-foreground" :
                "bg-red-500 text-white"
              }`}>
                {test.status}
              </span>
            </div>
          )}
        </div>

        <div className="p-3 flex flex-col flex-1">
          <h3 className="font-bold text-sm leading-tight mb-2 line-clamp-2 min-h-[2.5rem]">{test.title}</h3>

          {canModerate && (
            <div className="flex gap-1 mb-2 z-20 relative">
              <button
                onClick={(e) => { e.preventDefault(); moderate("approve"); }}
                disabled={moderating !== null}
                title="Onayla"
                className="p-1 rounded bg-green-500/10 hover:bg-green-500/20 text-green-600 transition-colors"
              >
                {moderating === "approve" ? <span className="text-[10px]">…</span> : <CheckCheck size={12} />}
              </button>
              <button
                onClick={(e) => { e.preventDefault(); moderate("hide"); }}
                disabled={moderating !== null}
                title="Gizle"
                className="p-1 rounded bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
              >
                <EyeOff size={12} />
              </button>
              <button
                onClick={(e) => { e.preventDefault(); moderate("reject"); }}
                disabled={moderating !== null}
                title="Reddet"
                className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
              >
                <Ban size={12} />
              </button>
            </div>
          )}

          <div className="mt-auto flex items-center justify-between z-20 relative pt-2 border-t border-border/50">
            <div className="flex items-center gap-1">
              <LikeButton testId={test.id} initialCount={test.likeCount} />
              <FavoriteButton testId={test.id} initialCount={test.favoriteCount} />
              {user && !canModerate && (
                <button
                  onClick={(e) => { e.preventDefault(); setShowReport(true); }}
                  title="Rapor et"
                  className="p-1.5 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors z-20"
                >
                  <Flag size={12} />
                </button>
              )}
            </div>

            <Link
              href={`/test/${test.id}`}
              className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors bg-primary/10 px-2 py-1 rounded-md z-20 relative"
            >
              <Play size={12} className="fill-current" />
              {test.playCount > 0 ? test.playCount.toLocaleString() : "Yeni"}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
