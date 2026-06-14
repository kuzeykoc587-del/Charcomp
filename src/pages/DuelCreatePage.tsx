import { useState } from "react";
import { useLocation } from "wouter";
import { Header } from "../components/Header";
import { useTranslation } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Loader2, ArrowLeft, Swords } from "lucide-react";
import { CreateDuelModal } from "../components/CreateDuelModal";
import { useQueryClient } from "@tanstack/react-query";

export default function DuelCreatePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const qc = useQueryClient();
  const [open, setOpen] = useState(true);

  if (!user) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-muted/20 pb-20 md:pb-0">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="bg-card p-8 rounded-2xl border shadow-lg text-center max-w-sm w-full">
            <h2 className="text-2xl font-black mb-4">Login Required</h2>
            <p className="text-muted-foreground mb-8">You need to log in to create duels.</p>
            <Button className="w-full" onClick={() => setLocation("/login")}>Go to Login</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-muted/20 pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setLocation("/create")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={20} />
          </button>
          <Swords size={22} className="text-rose-400" />
          <h1 className="text-2xl font-black">{t("lbl_create_duel")}</h1>
        </div>

        <div className="bg-card border rounded-2xl p-8 text-center">
          <Swords size={40} className="text-rose-400 mx-auto mb-4" />
          <h2 className="text-xl font-black mb-2">Create a Character Duel</h2>
          <p className="text-muted-foreground mb-6">Pick two characters and let the community decide who wins!</p>
          <Button onClick={() => setOpen(true)} className="gap-2">
            <Swords size={16} /> Start Creating
          </Button>
        </div>

        <CreateDuelModal
          open={open}
          onClose={() => { setOpen(false); setLocation("/duels"); }}
          onCreated={() => {
            qc.invalidateQueries({ queryKey: ["duels"] });
            setOpen(false);
            setLocation("/duels");
          }}
        />
      </main>
    </div>
  );
}
