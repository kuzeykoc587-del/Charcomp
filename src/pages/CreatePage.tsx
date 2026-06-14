import { useLocation } from "wouter";
import { Header } from "../components/Header";
import { useTranslation } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import {
  FlaskConical, Swords, LayoutList, Shuffle, Globe, HelpCircle, ArrowRight
} from "lucide-react";
import { Link } from "wouter";

interface CreateOption {
  icon: React.ReactNode;
  titleKey: string;
  descKey: string;
  href: string;
  color: string;
  comingSoon?: boolean;
}

const OPTIONS: CreateOption[] = [
  {
    icon: <FlaskConical size={26} />,
    titleKey: "lbl_create_test",
    descKey: "home_tests_desc",
    href: "/create/test",
    color: "text-violet-400",
  },
  {
    icon: <Swords size={26} />,
    titleKey: "lbl_create_duel",
    descKey: "home_duels_desc",
    href: "/create/duel",
    color: "text-rose-400",
  },
  {
    icon: <LayoutList size={26} />,
    titleKey: "btn_create_tierlist",
    descKey: "home_tierlists_desc",
    href: "/create/tierlist",
    color: "text-amber-400",
  },
  {
    icon: <Shuffle size={26} />,
    titleKey: "btn_create_this_or_that",
    descKey: "home_thisorthat_desc",
    href: "/create/this-or-that",
    color: "text-sky-400",
  },
  {
    icon: <Globe size={26} />,
    titleKey: "lbl_create_universe",
    descKey: "home_universes_desc",
    href: "/create/universe",
    color: "text-emerald-400",
  },
  {
    icon: <HelpCircle size={26} />,
    titleKey: "lbl_guess_the",
    descKey: "home_guess_the_desc",
    href: "/guess-the",
    color: "text-green-400",
    comingSoon: true,
  },
];

export default function CreatePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  if (!user) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-muted/20 pb-20 md:pb-0">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="bg-card p-8 rounded-2xl border shadow-lg text-center max-w-sm w-full">
            <h2 className="text-2xl font-black mb-4">Login Required</h2>
            <p className="text-muted-foreground mb-8">You need to log in to create content.</p>
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
        <div className="mb-8">
          <h1 className="text-3xl font-black">{t("nav_create")}</h1>
          <p className="text-muted-foreground mt-1">{t("lbl_choose_what_to_create")}</p>
        </div>

        <div className="space-y-3">
          {OPTIONS.map((opt) => {
            const card = (
              <div
                className={`flex items-center gap-4 rounded-2xl border bg-card p-5 transition-all ${
                  opt.comingSoon
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:border-primary/40 hover:shadow-md cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-muted/50 ${opt.color}`}>
                  {opt.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-base">{t(opt.titleKey as any)}</p>
                  <p className="text-sm text-muted-foreground">{t(opt.descKey as any)}</p>
                </div>
                {opt.comingSoon ? (
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-muted text-muted-foreground border shrink-0">
                    {t("home_coming_soon")}
                  </span>
                ) : (
                  <ArrowRight size={18} className="text-muted-foreground shrink-0" />
                )}
              </div>
            );

            if (opt.comingSoon) {
              return <div key={opt.href}>{card}</div>;
            }

            return (
              <Link key={opt.href} href={opt.href}>
                {card}
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
