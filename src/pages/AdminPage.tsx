import { useState } from "react";
import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { seedDatabase, isSeedNeeded } from "../lib/seed";
import { useTranslation } from "../contexts/LanguageContext";
import { Link } from "wouter";
import { LogIn, Loader2, CheckCircle2, Database, ShieldCheck, ShieldX } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

function getAdminEmails(): string[] {
  const raw = import.meta.env.VITE_ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((e: string) => e.trim().toLowerCase())
    .filter(Boolean);
}

function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const admins = getAdminEmails();
  if (admins.length === 0) return false;
  return admins.includes(email.trim().toLowerCase());
}

export default function AdminPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [seeding, setSeeding] = useState(false);
  const [progress, setProgress] = useState<{ msg: string; pct: number } | null>(null);
  const [done, setDone] = useState(false);

  const { data: needsSeed, isLoading: checkingDb, refetch } = useQuery({
    queryKey: ["needs-seed"],
    queryFn: isSeedNeeded,
    staleTime: 0,
    enabled: isAdmin(user?.email),
  });

  if (!user) {
    return (
      <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-6 p-4">
          <ShieldCheck size={48} className="text-muted-foreground" />
          <p className="text-muted-foreground text-lg">Sign in to access the admin panel.</p>
          <Link href="/login"><Button className="gap-2"><LogIn size={16} /> Sign In</Button></Link>
        </main>
      </div>
    );
  }

  if (!isAdmin(user.email)) {
    return (
      <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-6 p-4">
          <ShieldX size={48} className="text-destructive" />
          <p className="text-muted-foreground text-lg text-center max-w-sm">
            Access denied. This account is not authorized for the admin panel.
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
      refetch();
    } catch (e: any) {
      setProgress({ msg: `Error: ${e.message}`, pct: 0 });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-8">
          <ShieldCheck size={32} className="text-primary" />
          <h1 className="text-3xl font-black">{t("lbl_admin")}</h1>
        </div>

        {/* Database Seeding Card */}
        <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Database size={20} className="text-primary" />
            <h2 className="text-xl font-bold">{t("lbl_seed_status")}</h2>
          </div>

          {checkingDb ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="animate-spin" size={16} /> Checking database...
            </div>
          ) : needsSeed === false ? (
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle2 size={18} /> Database is populated with universes and characters.
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              The database is empty. Click the button below to seed it with <strong>60+ universes</strong> and <strong>200+ characters</strong>.
            </p>
          )}

          {progress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-mono">
                <span className="text-muted-foreground">{progress.msg}</span>
                <span className="text-primary">{progress.pct}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${progress.pct}%` }}
                />
              </div>
            </div>
          )}

          {done && (
            <div className="flex items-center gap-2 text-green-500 animate-in fade-in">
              <CheckCircle2 size={18} /> {t("msg_seed_complete")}
            </div>
          )}

          <Button
            onClick={handleSeed}
            disabled={seeding || needsSeed === false}
            className="gap-2"
          >
            {seeding ? <Loader2 size={16} className="animate-spin" /> : <Database size={16} />}
            {needsSeed === false ? "Already seeded" : t("btn_seed_db")}
          </Button>
        </div>

        {/* Quick links */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          {[
            { href: "/universes", label: "Manage Universes" },
            { href: "/duels", label: "Manage Duels" },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="bg-card border rounded-xl p-4 hover:border-primary transition-colors cursor-pointer">
                <p className="font-semibold">{item.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
