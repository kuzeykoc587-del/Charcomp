import { Link } from "wouter";
import { Header } from "../components/Header";
import { useTranslation } from "../contexts/LanguageContext";
import { useTests, useDuels, useUniverses, useThisOrThats, useTierLists } from "../hooks/useFirestore";
import {
  FlaskConical, Swords, LayoutList, Shuffle, Globe, HelpCircle,
  ArrowRight, Loader2
} from "lucide-react";
import type { Test, Universe } from "../lib/db";

interface CategoryCard {
  titleKey: "home_category_tests" | "home_category_duels" | "home_category_tierlists" | "home_category_thisorthat" | "home_category_universes" | "home_category_guess_the";
  descKey: "home_tests_desc" | "home_duels_desc" | "home_tierlists_desc" | "home_thisorthat_desc" | "home_universes_desc" | "home_guess_the_desc";
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
    icon: <FlaskConical size={28} />,
    gradient: "from-violet-500/20 to-purple-600/10 border-violet-500/30",
  },
  {
    titleKey: "home_category_duels",
    descKey: "home_duels_desc",
    href: "/duels",
    icon: <Swords size={28} />,
    gradient: "from-rose-500/20 to-red-600/10 border-rose-500/30",
  },
  {
    titleKey: "home_category_tierlists",
    descKey: "home_tierlists_desc",
    href: "/tierlists",
    icon: <LayoutList size={28} />,
    gradient: "from-amber-500/20 to-yellow-600/10 border-amber-500/30",
  },
  {
    titleKey: "home_category_thisorthat",
    descKey: "home_thisorthat_desc",
    href: "/this-or-that",
    icon: <Shuffle size={28} />,
    gradient: "from-sky-500/20 to-blue-600/10 border-sky-500/30",
  },
  {
    titleKey: "home_category_universes",
    descKey: "home_universes_desc",
    href: "/universes",
    icon: <Globe size={28} />,
    gradient: "from-emerald-500/20 to-teal-600/10 border-emerald-500/30",
  },
  {
    titleKey: "home_category_guess_the",
    descKey: "home_guess_the_desc",
    href: "/guess-the",
    icon: <HelpCircle size={28} />,
    gradient: "from-green-500/20 to-emerald-600/10 border-green-500/30",
    comingSoon: true,
  },
];

function TestPreviewCard({ test }: { test: Test }) {
  return (
    <Link href={`/test/${test.id}`}>
      <div className="flex items-center gap-3 rounded-xl border bg-card hover:border-primary/40 transition-all p-3 cursor-pointer">
        <img
          src={test.coverImage}
          alt={test.title}
          className="w-12 h-12 rounded-lg object-cover shrink-0"
          onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(test.title)}&background=7C3AED&color=fff&size=80&bold=true`; }}
        />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm truncate">{test.title}</p>
          <p className="text-xs text-muted-foreground">{test.playCount} plays</p>
        </div>
      </div>
    </Link>
  );
}

function UniversePreviewCard({ universe }: { universe: Universe }) {
  return (
    <Link href={`/universe/${universe.id}`}>
      <div className="flex items-center gap-3 rounded-xl border bg-card hover:border-primary/40 transition-all p-3 cursor-pointer">
        <img
          src={universe.coverImage}
          alt={universe.name}
          className="w-12 h-12 rounded-lg object-cover shrink-0"
          onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(universe.name)}&background=7C3AED&color=fff&size=80&bold=true`; }}
        />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm truncate">{universe.name}</p>
          <p className="text-xs text-muted-foreground">{universe.category} · {universe.characterCount} chars</p>
        </div>
      </div>
    </Link>
  );
}

function SectionHeader({ title, href, seeAll }: { title: string; href: string; seeAll: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="font-black text-base">{title}</h2>
      <Link href={href}>
        <span className="text-xs text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
          {seeAll} <ArrowRight size={12} />
        </span>
      </Link>
    </div>
  );
}

export default function HomePage() {
  const { t } = useTranslation();

  const { data: tests = [], isLoading: loadingTests } = useTests({ sort: "popular" });
  const { data: universes = [], isLoading: loadingUniverses } = useUniverses();
  const { data: duels = [] } = useDuels();
  const { data: polls = [] } = useThisOrThats(4);
  const { data: tierLists = [] } = useTierLists(4);

  const previewTests = (tests || []).slice(0, 4);
  const previewUniverses = (universes || []).slice(0, 4);

  return (
    <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-2xl space-y-8">

        <div className="text-center pt-2 pb-1">
          <h1 className="text-3xl font-black tracking-tight mb-1">CharComp</h1>
          <p className="text-muted-foreground text-sm">{t("home_tagline")}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-3">
          {CATEGORIES.map((cat) => {
            const card = (
              <div
                className={`relative flex flex-col gap-2 rounded-2xl border bg-gradient-to-br p-4 transition-all ${cat.gradient} ${
                  cat.comingSoon
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:scale-[1.02] hover:shadow-md cursor-pointer active:scale-[0.98]"
                }`}
              >
                {cat.comingSoon && (
                  <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground border">
                    {t("home_coming_soon")}
                  </span>
                )}
                <div className="text-foreground/80">{cat.icon}</div>
                <div>
                  <p className="font-black text-sm leading-tight">{t(cat.titleKey)}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug hidden sm:block">{t(cat.descKey)}</p>
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

        {(loadingTests ? (
          <div className="flex justify-center py-4">
            <Loader2 className="animate-spin text-primary" size={20} />
          </div>
        ) : previewTests.length > 0) && (
          <div>
            <SectionHeader title={t("home_popular_tests")} href="/tests" seeAll={t("home_see_all")} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {previewTests.map((test) => (
                <TestPreviewCard key={test.id} test={test} />
              ))}
            </div>
          </div>
        )}

        {duels.length > 0 && (
          <div>
            <SectionHeader title={t("home_popular_duels")} href="/duels" seeAll={t("home_see_all")} />
            <Link href="/duels">
              <div className="border rounded-2xl bg-card hover:border-primary/40 transition-all p-4 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                      <Swords size={20} className="text-rose-400" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{duels.length} active duels</p>
                      <p className="text-xs text-muted-foreground">Vote on character face-offs</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-muted-foreground" />
                </div>
              </div>
            </Link>
          </div>
        )}

        {tierLists.length > 0 && (
          <div>
            <SectionHeader title={t("lbl_tierlists")} href="/tierlists" seeAll={t("home_see_all")} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {tierLists.map((tl) => (
                <Link key={tl.id} href={`/tierlist/${tl.id}`}>
                  <div className="border rounded-xl bg-card hover:border-primary/40 transition-all p-3 cursor-pointer">
                    <p className="font-bold text-sm truncate">{tl.title}</p>
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {(tl.tiers || []).slice(0, 5).map((tier) => (
                        <span key={tier.name} className="text-[10px] font-black px-1.5 py-0.5 rounded" style={{ color: tier.color, backgroundColor: `${tier.color}22` }}>
                          {tier.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {polls.length > 0 && (
          <div>
            <SectionHeader title={t("lbl_this_or_that")} href="/this-or-that" seeAll={t("home_see_all")} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(polls || []).slice(0, 2).map((poll) => (
                <Link key={poll.id} href={`/this-or-that/${poll.id}`}>
                  <div className="border rounded-xl bg-card hover:border-primary/40 transition-all p-3 cursor-pointer">
                    <p className="text-xs text-muted-foreground mb-2 truncate">{poll.title || t("lbl_this_or_that")}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 px-2 py-1.5 text-center">
                        <p className="text-xs font-bold text-blue-300 truncate">{poll.optionA}</p>
                      </div>
                      <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 px-2 py-1.5 text-center">
                        <p className="text-xs font-bold text-rose-300 truncate">{poll.optionB}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {(loadingUniverses ? null : previewUniverses.length > 0) && (
          <div>
            <SectionHeader title={t("home_new_universes")} href="/universes" seeAll={t("home_see_all")} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {previewUniverses.map((universe) => (
                <UniversePreviewCard key={universe.id} universe={universe} />
              ))}
            </div>
          </div>
        )}

        <div className="h-4" />
      </main>
    </div>
  );
}
