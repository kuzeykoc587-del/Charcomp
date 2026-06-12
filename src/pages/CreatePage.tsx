import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Header } from "../components/Header";
import { useTranslation } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { CreateDuelModal } from "../components/CreateDuelModal";
import { CreateUniverseModal } from "../components/CreateUniverseModal";
import { Button } from "../components/ui/button";
import { FileText, Swords, LayoutList, Globe, UserPlus, ChevronRight } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "../hooks/use-toast";

export default function CreatePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const qc = useQueryClient();
  const { toast } = useToast();

  const [duelModalOpen, setDuelModalOpen] = useState(false);
  const [universeModalOpen, setUniverseModalOpen] = useState(false);

  if (!user) {
    return (
      <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
        <Header />
        <main className="flex-1 flex items-center justify-center flex-col gap-6 px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mx-auto">
            <FileText size={32} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black">{t("nav_create")}</h1>
            <p className="text-muted-foreground mt-2">İçerik oluşturmak için giriş yapmanız gerekiyor.</p>
          </div>
          <Link href="/login">
            <Button size="lg" className="gap-2">
              {t("auth_login")} <ChevronRight size={16} />
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  const primaryActions = [
    {
      icon: FileText,
      title: t("btn_create_test"),
      desc: "Turnuva veya sıralama modu ile karakter testi oluştur",
      href: "/create/test",
      gradient: "from-violet-500 to-purple-600",
    },
    {
      icon: Swords,
      title: t("btn_create_duel"),
      desc: "İki karakter arasında 1v1 düello kur, topluluğun oy versin",
      href: null as string | null,
      onClick: () => setDuelModalOpen(true),
      gradient: "from-red-500 to-rose-600",
    },
    {
      icon: LayoutList,
      title: t("btn_create_tierlist"),
      desc: "Karakterleri sıralara koy, herkes kendi sıralamasını yapabilsin",
      href: "/create/tierlist",
      gradient: "from-blue-500 to-cyan-600",
    },
  ];

  const secondaryActions = [
    {
      icon: Globe,
      title: t("lbl_create_universe"),
      desc: "Yeni bir evren ekle",
      onClick: () => setUniverseModalOpen(true),
      href: null as string | null,
    },
    {
      icon: UserPlus,
      title: t("lbl_create_character"),
      desc: "Mevcut bir evrene karakter ekle",
      href: "/universes",
      onClick: undefined as (() => void) | undefined,
    },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl font-black mb-2">{t("nav_create")}</h1>
        <p className="text-muted-foreground mb-8">Ne oluşturmak istiyorsunuz?</p>

        <div className="grid gap-4 mb-8">
          {primaryActions.map(action => {
            const Icon = action.icon;
            const inner = (
              <div className="group border rounded-2xl p-5 bg-card hover:border-primary transition-all cursor-pointer shadow-sm hover:shadow-lg flex gap-4 items-start">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shrink-0`}>
                  <Icon size={22} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold group-hover:text-primary transition-colors">{action.title}</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">{action.desc}</p>
                </div>
                <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary shrink-0 mt-1 transition-colors" />
              </div>
            );
            if (action.href) {
              return <Link key={action.title} href={action.href}>{inner}</Link>;
            }
            return <div key={action.title} onClick={action.onClick}>{inner}</div>;
          })}
        </div>

        <div className="border-t pt-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Diğer</h3>
          <div className="grid grid-cols-2 gap-3">
            {secondaryActions.map(action => {
              const Icon = action.icon;
              const inner = (
                <div className="group border rounded-xl p-4 bg-card hover:border-primary transition-all cursor-pointer">
                  <Icon size={20} className="text-muted-foreground group-hover:text-primary mb-2 transition-colors" />
                  <p className="font-semibold text-sm group-hover:text-primary transition-colors">{action.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{action.desc}</p>
                </div>
              );
              if (action.href) {
                return <Link key={action.title} href={action.href}>{inner}</Link>;
              }
              return <div key={action.title} onClick={action.onClick}>{inner}</div>;
            })}
          </div>
        </div>
      </main>

      <CreateDuelModal
        open={duelModalOpen}
        onClose={() => setDuelModalOpen(false)}
        onCreated={() => {
          setDuelModalOpen(false);
          qc.invalidateQueries({ queryKey: ["duels"] });
          toast({ title: t("msg_duel_created") });
          setLocation("/duels");
        }}
      />
      <CreateUniverseModal
        open={universeModalOpen}
        onClose={() => setUniverseModalOpen(false)}
        onCreated={() => {
          setUniverseModalOpen(false);
          qc.invalidateQueries({ queryKey: ["universes"] });
          toast({ title: t("msg_universe_created") });
          setLocation("/universes");
        }}
      />
    </div>
  );
}
