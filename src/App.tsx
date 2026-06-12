import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Loader2, Swords } from "lucide-react";

import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import CreatePage from "./pages/CreatePage";
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
import SearchPage from "./pages/SearchPage";
import GlobalRankingPage from "./pages/GlobalRankingPage";
import TierlistPage from "./pages/TierlistPage";

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
      <Route path="/" component={HomePage} />
      <Route path="/explore" component={ExplorePage} />
      <Route path="/create" component={CreatePage} />
      <Route path="/test/:id" component={TestDetailPage} />
      <Route path="/play/:testId/tournament" component={TournamentPage} />
      <Route path="/play/:testId/ranking" component={RankingPage} />
      <Route path="/result/:testId/tournament/:sessionId" component={TournamentResultPage} />
      <Route path="/result/:testId/ranking/:sessionId" component={RankingResultPage} />
      <Route path="/duels" component={DuelsPage} />
      <Route path="/favorites" component={FavoritesPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/universes" component={UniversesPage} />
      <Route path="/universe/:id" component={UniverseDetailPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/ranking" component={GlobalRankingPage} />
      <Route path="/tierlist" component={TierlistPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppShell() {
  const { authLoading } = useAuth();

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
