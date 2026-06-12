import { Link } from "wouter";
import { Header } from "../components/Header";
import { useTranslation } from "../contexts/LanguageContext";
import { FlaskConical, Swords, LayoutList, Shuffle } from "lucide-react";

interface CategoryCard {
  titleKey: "home_category_tests" | "home_category_duels" | "home_category_tierlists" | "home_category_thisorthat";
  descKey: "home_tests_desc" | "home_duels_desc" | "home_tierlists_desc" | "home_thisorthat_desc";
  href: string;
  icon: React.ReactNode;
  gradient: string;
  comingSoon?: boolean;
}

const CATEGORIES: CategoryCard[] = [
  {
    titleKey: "home_category_tests",
    descKey: "home_tests_desc",
    href: "/tests",
    icon: <FlaskConical size={32} />,
    gradient: "from-violet-500/20 to-purple-600/10 border-violet-500/30",
  },
  {
    titleKey: "home_category_duels",
    descKey: "home_duels_desc",
    href: "/duels",
    icon: <Swords size={32} />,
    gradient: "from-rose-500/20 to-red-600/10 border-rose-500/30",
  },
  {
    titleKey: "home_category_tierlists",
    descKey: "home_tierlists_desc",
    href: "/tierlist",
    icon: <LayoutList size={32} />,
    gradient: "from-amber-500/20 to-yellow-600/10 border-amber-500/30",
  },
  {
    titleKey: "home_category_thisorthat",
    descKey: "home_thisorthat_desc",
    href: "/this-or-that",
    icon: <Shuffle size={32} />,
    gradient: "from-sky-500/20 to-blue-600/10 border-sky-500/30",
    comingSoon: true,
  },
];

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-2xl">

        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black tracking-tight mb-2">CharComp</h1>
          <p className="text-muted-foreground text-sm">Choose a category to get started</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {CATEGORIES.map((cat) => {
            const card = (
              <div
                className={`relative flex flex-col gap-3 rounded-2xl border bg-gradient-to-br p-5 transition-all ${cat.gradient} ${
                  cat.comingSoon
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:scale-[1.02] hover:shadow-lg cursor-pointer active:scale-[0.98]"
                }`}
              >
                {cat.comingSoon && (
                  <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border">
                    {t("home_coming_soon")}
                  </span>
                )}
                <div className="text-foreground/80">{cat.icon}</div>
                <div>
                  <p className="font-black text-base leading-tight">{t(cat.titleKey)}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">{t(cat.descKey)}</p>
                </div>
              </div>
            );

            if (cat.comingSoon) {
              return <div key={cat.href}>{card}</div>;
            }

            return (
              <Link key={cat.href} href={cat.href}>
                {card}
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
