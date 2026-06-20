import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Loader2, Swords, AlertTriangle } from "lucide-react";

import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

import HomePage from "./pages/HomePage";
import TestsPage from "./pages/TestsPage";
import CreatePage from "./pages/CreatePage";
import TestCreatePage from "./pages/TestCreatePage";
import DuelCreatePage from "./pages/DuelCreatePage";
import UniverseCreatePage from "./pages/UniverseCreatePage";
import TestDetailPage from "./pages/TestDetailPage";
import TournamentPage from "./pages/TournamentPage";
import RankingPage from "./pages/RankingPage";
import TournamentResultPage from "./pages/TournamentResultPage";
import RankingResultPage from "./pages/RankingResultPage";
import DuelsPage from "./pages/DuelsPage";
import FavoritesPage from "./pages/FavoritesPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import UniversesPage from "./pages/UniversesPage";
import UniverseDetailPage from "./pages/UniverseDetailPage";
import AdminPage from "./pages/AdminPage";
import GlobalRankingPage from "./pages/GlobalRankingPage";
import CommunityTierlistPage from "./pages/CommunityTierlistPage";
import TierListsPage from "./pages/TierListsPage";
import TierListCreatePage from "./pages/TierListCreatePage";
import TierListDetailPage from "./pages/TierListDetailPage";
import TierListPlayPage from "./pages/TierListPlayPage";
import TierListResultPage from "./pages/TierListResultPage";
import ThisOrThatPage from "./pages/ThisOrThatPage";
import ThisOrThatDetailPage from "./pages/ThisOrThatDetailPage";
import ThisOrThatCreatePage from "./pages/ThisOrThatCreatePage";
import GuessThePage from "./pages/GuessThePage";
import GuessTheCreatePage from "./pages/GuessTheCreatePage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function Router() {
  return (
    <Switch>
      {/* ── Primary routes ─────────────────────────────────────── */}
      <Route path="/" component={HomePage} />
      <Route path="/tests" component={TestsPage} />
      <Route path="/duels" component={DuelsPage} />
      <Route path="/universes" component={UniversesPage} />
      <Route path="/universe/:id" component={UniverseDetailPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/login" component={LoginPage} />

      {/* ── Create Hub + sub-routes ─────────────────────────────── */}
      <Route path="/create" component={CreatePage} />
      <Route path="/create/test" component={TestCreatePage} />
      <Route path="/create/duel" component={DuelCreatePage} />
      <Route path="/create/tierlist" component={TierListCreatePage} />
      <Route path="/create/this-or-that" component={ThisOrThatCreatePage} />
      <Route path="/create/universe" component={UniverseCreatePage} />

      {/* ── Tier Lists (new system) ─────────────────────────────── */}
      <Route path="/tierlists" component={TierListsPage} />
      <Route path="/tierlist/create">{() => <Redirect to="/create/tierlist" />}</Route>
      <Route path="/tierlist/:id/play" component={TierListPlayPage} />
      <Route path="/tierlist/:id/result" component={TierListResultPage} />
      <Route path="/tierlist/:id" component={TierListDetailPage} />

      {/* Old /tierlist → browse page */}
      <Route path="/tierlist">{() => <Redirect to="/tierlists" />}</Route>

      {/* Community tier voting (old system kept) */}
      <Route path="/community-tierlist" component={CommunityTierlistPage} />

      {/* ── This or That ───────────────────────────────────────── */}
      <Route path="/this-or-that" component={ThisOrThatPage} />
      <Route path="/this-or-that/create">{() => <Redirect to="/create/this-or-that" />}</Route>
      <Route path="/this-or-that/:id" component={ThisOrThatDetailPage} />

      {/* ── Guess The ──────────────────────────────────────────── */}
      <Route path="/guess-the" component={GuessThePage} />
      <Route path="/create/guess-the" component={GuessTheCreatePage} />

      {/* ── Test play routes ───────────────────────────────────── */}
      <Route path="/test/:id" component={TestDetailPage} />
      <Route path="/play/:testId/tournament" component={TournamentPage} />
      <Route path="/play/:testId/ranking" component={RankingPage} />
      <Route path="/result/:testId/tournament/:sessionId" component={TournamentResultPage} />
      <Route path="/result/:testId/ranking/:sessionId" component={RankingResultPage} />

      {/* ── Kept alive (not in nav, still accessible) ─────────── */}
      <Route path="/ranking" component={GlobalRankingPage} />
      <Route path="/favorites" component={FavoritesPage} />
      <Route path="/admin" component={AdminPage} />

      {/* ── Backward-compat redirects ──────────────────────────── */}
      <Route path="/explore">{() => <Redirect to="/tests" />}</Route>
      <Route path="/search">{() => <Redirect to="/tests" />}</Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function AppShell() {
  const { authLoading, authError } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-background gap-4">
        <div className="flex items-center gap-2 font-black text-2xl text-primary">
          <Swords size={28} />
          <span>CharComp</span>
        </div>
        <Loader2 className="animate-spin text-primary" size={24} />
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-background gap-6 p-6">
        <div className="flex items-center gap-2 font-black text-2xl text-primary">
          <Swords size={28} />
          <span>CharComp</span>
        </div>
        <div className="max-w-md w-full bg-card border border-border rounded-xl p-6 text-center flex flex-col items-center gap-4">
          <AlertTriangle className="text-yellow-500" size={36} />
          <h2 className="font-bold text-lg">Firebase connection issue</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The app could not connect to Firebase Auth. This usually means the
            environment variables are missing or your domain is not listed in
            Firebase → Authentication → Authorized Domains.
          </p>
          <pre className="w-full bg-muted text-destructive text-xs rounded-lg p-3 text-left overflow-x-auto whitespace-pre-wrap break-words">
            {authError}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <LanguageProvider>
            <TooltipProvider>
              <AppShell />
              <Toaster />
            </TooltipProvider>
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
