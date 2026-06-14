import { useParams, Link } from "wouter";
import { Header } from "../components/Header";
import { ModeSelector } from "../components/ModeSelector";
import { LikeButton } from "../components/LikeButton";
import { FavoriteButton } from "../components/FavoriteButton";
import { Play, ArrowLeft, Loader2 } from "lucide-react";
import { useTranslation } from "../contexts/LanguageContext";
import { Button } from "../components/ui/button";
import { useTest, useCharactersByIds, useUserFavorites } from "../hooks/useFirestore";
import { useAuth } from "../contexts/AuthContext";
import { recentlyPlayedDb } from "../lib/db";
import { useEffect } from "react";

export default function TestDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: test, isLoading } = useTest(id);
  const { data: poolChars = [] } = useCharactersByIds(test?.characterIds ?? []);

  useEffect(() => {
    if (id) recentlyPlayedDb.add(id);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={32} />
        </main>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-muted/20 pb-20 md:pb-0">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="text-4xl font-black mb-4">Test Not Found</h1>
          <p className="text-muted-foreground mb-8">The test you are looking for does not exist.</p>
          <Link href="/"><Button size="lg" className="gap-2"><ArrowLeft size={18} /> Back to Home</Button></Link>
        </main>
      </div>
    );
  }

  const previewChars = (poolChars || []).slice(0, 12);

  return (
    <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
      <Header />

      <div className="relative h-64 md:h-96 w-full">
        <div className="absolute inset-0 bg-background" />
        <img src={test.coverImage} alt={test.title} className="absolute inset-0 w-full h-full object-cover opacity-50 blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />

        <div className="absolute inset-0 container mx-auto px-4 flex flex-col justify-end pb-8 z-10">
          <div className="flex flex-col md:flex-row gap-6 md:items-end">
            <img src={test.coverImage} alt={test.title} className="w-32 h-32 md:w-48 md:h-48 rounded-2xl object-cover shadow-2xl border-4 border-background" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {test.characterIds.length} {t("lbl_characters_count")}
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground bg-muted/80 px-2 py-1 rounded-full backdrop-blur-md">
                  <Play size={14} /> {test.playCount.toLocaleString()} plays
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black mb-2 leading-tight drop-shadow-md">{test.title}</h1>
            </div>
            <div className="flex items-center gap-2 bg-card/80 backdrop-blur-md p-2 rounded-xl border shadow-sm mt-4 md:mt-0">
              <LikeButton testId={test.id} initialCount={test.likeCount} />
              <div className="w-px h-6 bg-border mx-2" />
              <FavoriteButton testId={test.id} initialCount={test.favoriteCount} />
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8">
        <p className="text-lg text-muted-foreground max-w-3xl mb-12">{test.description}</p>
        <ModeSelector testId={test.id} />

        <div className="mt-16">
          <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
            Character Preview <span className="text-sm font-normal text-muted-foreground">({poolChars.length} total)</span>
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {previewChars.map((char) => (
              <div key={char.id} className="aspect-[3/4] rounded-lg bg-muted overflow-hidden relative group border">
                <img src={char.image} alt={char.name}
                  onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(char.name)}&background=7C3AED&color=fff&size=400&bold=true`; }}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                  <span className="text-xs font-bold text-white truncate w-full text-center">{char.name}</span>
                </div>
              </div>
            ))}
            {poolChars.length > 12 && (
              <div className="aspect-[3/4] rounded-lg bg-muted/50 border flex items-center justify-center font-bold text-muted-foreground">
                +{poolChars.length - 12}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
