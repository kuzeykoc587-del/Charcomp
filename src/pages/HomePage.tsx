import React, { useState } from "react";
import { Link } from "wouter";
import { Header } from "../components/Header";
import { useTranslation } from "../contexts/LanguageContext";
import type { translations } from "../i18n/translations";
type TranslationKey = keyof typeof translations.en;
import {
  useTests, useDuels, useUniverses, useThisOrThats, useTierLists, useGuessTasks,
} from "../hooks/useFirestore";
import { TestCard } from "../components/TestCard";
import { UniverseCard } from "../components/UniverseCard";
import { TierListCard } from "../components/TierListCard";
import { ThisOrThatCard } from "../components/ThisOrThatCard";
import {
  FlaskConical, Swords, LayoutList, Shuffle, Globe, HelpCircle,
  ArrowRight, Loader2, Images,
} from "lucide-react";
import type { Duel, Test, GuessTask } from "../lib/db";

// ── Types & constants ──────────────────────────────────────────────────────────

type CategoryCard = {
  key: string;
  titleKey: TranslationKey;
  icon: React.ReactElement;
  gradient: string;
  href: string;
  comingSoon?: boolean;
};

const CATEGORY_CARDS: CategoryCard[] = [
  { key: "tests",      titleKey: "home_category_tests",      icon: <FlaskConical size={22} />, gradient: "from-violet-500/20 to-purple-600/10 border-violet-500/30", href: "/tests" },
  { key: "duels",      titleKey: "home_category_duels",      icon: <Swords size={22} />,      gradient: "from-rose-500/20 to-red-600/10 border-rose-500/30",         href: "/duels" },
  { key: "tierlists",  titleKey: "home_category_tierlists",  icon: <LayoutList size={22} />,  gradient: "from-amber-500/20 to-yellow-600/10 border-amber-500/30",     href: "/tierlists" },
  { key: "thisorthat", titleKey: "home_category_thisorthat", icon: <Shuffle size={22} />,     gradient: "from-sky-500/20 to-blue-600/10 border-sky-500/30",           href: "/this-or-that" },
  { key: "universes",  titleKey: "home_category_universes",  icon: <Globe size={22} />,       gradient: "from-emerald-500/20 to-teal-600/10 border-emerald-500/30",   href: "/universes" },
  { key: "guess",      titleKey: "home_category_guess_the",  icon: <HelpCircle size={22} />,  gradient: "from-green-500/20 to-emerald-600/10 border-green-500/30",    href: "/guess-the" },
];

type Tab = "tests" | "duels" | "tierlists" | "thisorthat" | "universes" | "guess";

type SidebarItem = {
  key: Tab;
  labelKey: TranslationKey;
  icon: React.ReactElement;
  activeColor: string;
  activeBg: string;
};

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    key: "tests",
    labelKey: "home_category_tests",
    icon: <FlaskConical size={20} />,
    activeColor: "text-violet-400",
    activeBg: "bg-violet-500/10 border-l-2 border-violet-500",
  },
  {
    key: "duels",
    labelKey: "home_category_duels",
    icon: <Swords size={20} />,
    activeColor: "text-rose-400",
    activeBg: "bg-rose-500/10 border-l-2 border-rose-500",
  },
  {
    key: "tierlists",
    labelKey: "home_category_tierlists",
    icon: <LayoutList size={20} />,
    activeColor: "text-amber-400",
    activeBg: "bg-amber-500/10 border-l-2 border-amber-500",
  },
  {
    key: "thisorthat",
    labelKey: "home_category_thisorthat",
    icon: <Shuffle size={20} />,
    activeColor: "text-sky-400",
    activeBg: "bg-sky-500/10 border-l-2 border-sky-500",
  },
  {
    key: "universes",
    labelKey: "home_category_universes",
    icon: <Globe size={20} />,
    activeColor: "text-emerald-400",
    activeBg: "bg-emerald-500/10 border-l-2 border-emerald-500",
  },
  {
    key: "guess",
    labelKey: "home_category_guess_the",
    icon: <HelpCircle size={20} />,
    activeColor: "text-green-400",
    activeBg: "bg-green-500/10 border-l-2 border-green-500",
  },
];

const MOBILE_TABS: { key: Tab; labelKey: TranslationKey }[] = [
  { key: "tests",      labelKey: "home_category_tests" },
  { key: "duels",      labelKey: "home_category_duels" },
  { key: "tierlists",  labelKey: "home_category_tierlists" },
  { key: "thisorthat", labelKey: "home_category_thisorthat" },
  { key: "universes",  labelKey: "home_category_universes" },
  { key: "guess",      labelKey: "home_category_guess_the" },
];

// ── Small sub-components ───────────────────────────────────────────────────────

function DuelPreviewCard({ duel }: { duel: Duel }) {
  const total = duel.votesA + duel.votesB;
  return (
    <Link href="/duels">
      <div className="border rounded-xl bg-card hover:border-primary/40 transition-all p-3 cursor-pointer flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-rose-500/20 flex items-center justify-center shrink-0">
          <Swords size={16} className="text-rose-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-xs truncate">
            {duel.title || `Duel #${duel.id.slice(0, 6)}`}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {total > 0 ? `${total.toLocaleString()} votes` : "Yeni"}
          </p>
        </div>
        <ArrowRight size={12} className="text-muted-foreground shrink-0" />
      </div>
    </Link>
  );
}

function GuessPreviewCard({ task }: { task: GuessTask }) {
  const thumb = task.images?.[0];
  return (
    <Link href="/guess-the">
      <div className="border rounded-xl bg-card hover:border-primary/40 transition-all cursor-pointer overflow-hidden">
        <div className="aspect-square bg-muted relative">
          {thumb ? (
            <img
              src={thumb}
              alt={task.title}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Images size={24} className="text-muted-foreground" />
            </div>
          )}
          <div className="absolute bottom-1 right-1 bg-black/60 rounded px-1 py-0.5 text-[9px] text-white font-bold">
            {task.images?.length ?? 0} img
          </div>
        </div>
        <div className="p-2">
          <p className="font-bold text-xs truncate">{task.title}</p>
          <p className="text-[10px] text-muted-foreground">
            {(task.playCount ?? 0).toLocaleString()} plays
          </p>
        </div>
      </div>
    </Link>
  );
}

function SeeAllLink({ href, label }: { href: string; label: string }) {
  return (
    <div className="mt-4 text-center">
      <Link href={href}>
        <span className="text-xs text-primary font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all">
          {label} <ArrowRight size={12} />
        </span>
      </Link>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function useMixedTests(all: Test[]) {
  if (!all.length) return [];
  const sorted = [...all].sort((a, b) => (b.playCount ?? 0) - (a.playCount ?? 0));
  const totalWant = Math.min(8, all.length);
  const nPopular = Math.ceil(totalWant * 0.5);
  const nNew = Math.ceil(totalWant * 0.3);
  const nRandom = totalWant - nPopular - nNew;

  const popular = sorted.slice(0, nPopular);
  const remainingAfterPop = sorted.slice(nPopular);
  const byDate = [...remainingAfterPop].sort((a, b) =>
    new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
  );
  const newItems = byDate.slice(0, nNew);
  const usedIds = new Set([...popular, ...newItems].map(t => t.id));
  const remaining = all.filter(t => !usedIds.has(t.id));
  const shuffled = [...remaining].sort(() => Math.random() - 0.5);
  const random = shuffled.slice(0, nRandom);
  return [...popular, ...newItems, ...random].sort(() => Math.random() - 0.4);
}

// ── Tab content (shared between mobile tabs & desktop right panel) ─────────────

function TabContent({
  activeTab,
  isLoadingTab,
  tests,
  duels,
  tierLists,
  polls,
  universes,
  guessTasks,
  t,
  desktopGrid,
}: {
  activeTab: Tab;
  isLoadingTab: boolean;
  tests: Test[];
  duels: Duel[];
  tierLists: ReturnType<typeof useTierLists>["data"] & object[];
  polls: ReturnType<typeof useThisOrThats>["data"] & object[];
  universes: ReturnType<typeof useUniverses>["data"] & object[];
  guessTasks: GuessTask[];
  t: (k: string) => string;
  desktopGrid?: boolean;
}) {
  const gridCols = desktopGrid
    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
    : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4";

  if (isLoadingTab) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-primary" size={24} />
      </div>
    );
  }

  return (
    <>
      {activeTab === "tests" && (
        <>
          {tests.length === 0
            ? <p className="text-center text-muted-foreground py-12 text-sm">{t("empty_tests")}</p>
            : <>
                <div className={`grid ${gridCols} gap-3`}>
                  {tests.slice(0, 8).map(test => <TestCard key={test.id} test={test} />)}
                </div>
                <SeeAllLink href="/tests" label={t("home_see_all")} />
              </>
          }
        </>
      )}

      {activeTab === "duels" && (
        <>
          {duels.length === 0
            ? <p className="text-center text-muted-foreground py-12 text-sm">{t("empty_duels")}</p>
            : <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {duels.slice(0, 8).map(d => <DuelPreviewCard key={d.id} duel={d} />)}
                </div>
                <SeeAllLink href="/duels" label={t("home_see_all")} />
              </>
          }
        </>
      )}

      {activeTab === "tierlists" && (
        <>
          {(tierLists ?? []).length === 0
            ? <p className="text-center text-muted-foreground py-12 text-sm">{t("empty_tierlists")}</p>
            : <>
                <div className={`grid ${gridCols} gap-3`}>
                  {(tierLists ?? []).slice(0, 8).map((tl: any) => <TierListCard key={tl.id} tl={tl} />)}
                </div>
                <SeeAllLink href="/tierlists" label={t("home_see_all")} />
              </>
          }
        </>
      )}

      {activeTab === "thisorthat" && (
        <>
          {(polls ?? []).length === 0
            ? <p className="text-center text-muted-foreground py-12 text-sm">{t("empty_this_or_that")}</p>
            : <>
                <div className={`grid ${gridCols} gap-3`}>
                  {(polls ?? []).slice(0, 8).map((p: any) => <ThisOrThatCard key={p.id} poll={p} />)}
                </div>
                <SeeAllLink href="/this-or-that" label={t("home_see_all")} />
              </>
          }
        </>
      )}

      {activeTab === "universes" && (
        <>
          {(universes ?? []).length === 0
            ? <p className="text-center text-muted-foreground py-12 text-sm">{t("empty_universes")}</p>
            : <>
                <div className={`grid ${gridCols} gap-3`}>
                  {(universes ?? []).slice(0, 8).map((u: any) => <UniverseCard key={u.id} series={u} />)}
                </div>
                <SeeAllLink href="/universes" label={t("home_see_all")} />
              </>
          }
        </>
      )}

      {activeTab === "guess" && (
        <>
          {guessTasks.length === 0
            ? (
              <div className="text-center py-12">
                <HelpCircle size={32} className="mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground text-sm">{t("empty_tests")}</p>
                <Link href="/guess-the">
                  <span className="text-xs text-primary font-semibold mt-3 inline-flex items-center gap-1 hover:gap-2 transition-all">
                    {t("home_see_all")} <ArrowRight size={12} />
                  </span>
                </Link>
              </div>
            )
            : <>
                <div className={`grid ${gridCols} gap-3`}>
                  {guessTasks.slice(0, 8).map(gt => <GuessPreviewCard key={gt.id} task={gt} />)}
                </div>
                <SeeAllLink href="/guess-the" label={t("home_see_all")} />
              </>
          }
        </>
      )}
    </>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function HomePage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>("tests");

  const { data: allTests   = [], isLoading: loadingTests      } = useTests({ sort: "popular" });
  const { data: universes  = [], isLoading: loadingUniverses  } = useUniverses();
  const { data: duels      = [], isLoading: loadingDuels      } = useDuels();
  const { data: polls      = [], isLoading: loadingPolls      } = useThisOrThats(12);
  const { data: tierLists  = [], isLoading: loadingTierLists  } = useTierLists(12);
  const { data: guessTasks = [], isLoading: loadingGuess      } = useGuessTasks();
  const tests = useMixedTests(allTests);

  const loadingMap: Record<Tab, boolean> = {
    tests:      loadingTests,
    duels:      loadingDuels,
    tierlists:  loadingTierLists,
    thisorthat: loadingPolls,
    universes:  loadingUniverses,
    guess:      loadingGuess,
  };
  const isLoadingTab = loadingMap[activeTab];

  const tabContentProps = {
    activeTab,
    isLoadingTab,
    tests,
    duels,
    tierLists,
    polls,
    universes,
    guessTasks,
    t,
  };

  const activeItem = SIDEBAR_ITEMS.find(s => s.key === activeTab);

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Header />

      {/* ── DESKTOP layout (md+): sidebar + content ─── */}
      <div className="hidden md:flex flex-1 overflow-hidden">

        {/* Left sidebar — 6 equal-height category sections */}
        <aside className="flex flex-col w-52 lg:w-60 border-r shrink-0 bg-card/30">
          {SIDEBAR_ITEMS.map((item, idx) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`
                  flex-1 flex flex-col items-center justify-center gap-2 px-3 py-4 text-center
                  transition-all select-none
                  ${idx < SIDEBAR_ITEMS.length - 1 ? "border-b" : ""}
                  ${isActive
                    ? `${item.activeBg} ${item.activeColor}`
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }
                `}
              >
                <span className={`transition-colors ${isActive ? item.activeColor : ""}`}>
                  {item.icon}
                </span>
                <span className={`text-xs font-bold leading-snug ${isActive ? "text-foreground" : ""}`}>
                  {t(item.labelKey)}
                </span>
              </button>
            );
          })}
        </aside>

        {/* Right content panel */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-6">

            {/* Section heading */}
            <div className="flex items-center gap-2.5 mb-5">
              {activeItem && (
                <span className={activeItem.activeColor}>{activeItem.icon}</span>
              )}
              <h2 className="text-xl font-black tracking-tight">
                {activeItem ? t(activeItem.labelKey) : ""}
              </h2>
            </div>

            <TabContent {...tabContentProps} desktopGrid />
          </div>
        </div>
      </div>

      {/* ── MOBILE layout (< md): original design ─── */}
      <main className="md:hidden flex-1 container mx-auto px-4 py-6 max-w-3xl space-y-6 pb-24">

        {/* Hero */}
        <div className="text-center pt-1 pb-0">
          <h1 className="text-3xl font-black tracking-tight mb-1">CharComp</h1>
          <p className="text-muted-foreground text-sm">{t("home_tagline")}</p>
        </div>

        {/* Category grid — 2-col mobile, 3-col ≥sm */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {CATEGORY_CARDS.map((cat) => {
            const card = (
              <div
                className={`relative flex flex-col gap-2 rounded-2xl border bg-gradient-to-br p-4 h-full min-h-[90px] transition-all ${cat.gradient} ${
                  cat.comingSoon
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:scale-[1.02] hover:shadow-md cursor-pointer active:scale-[0.98]"
                }`}
              >
                {cat.comingSoon && (
                  <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground border leading-none">
                    {t("home_coming_soon")}
                  </span>
                )}
                <div className="text-foreground/80">{cat.icon}</div>
                <p className="font-black text-sm leading-snug">{t(cat.titleKey)}</p>
              </div>
            );
            if (cat.comingSoon) return <div key={cat.key}>{card}</div>;
            return <Link key={cat.key} href={cat.href}>{card}</Link>;
          })}
        </div>

        {/* Content tabs */}
        <div>
          {/* Tab bar */}
          <div className="flex overflow-x-auto border-b hide-scrollbar -mx-0.5 mb-4">
            {MOBILE_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-2 text-xs font-bold shrink-0 whitespace-nowrap transition-colors border-b-2 -mb-px ${
                  activeTab === tab.key
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t(tab.labelKey as any)}
              </button>
            ))}
          </div>

          {/* Tab body */}
          <TabContent {...tabContentProps} />
        </div>

        <div className="h-4" />
      </main>
    </div>
  );
}
