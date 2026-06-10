import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { favoritesDb } from "../lib/db";
import { toast } from "sonner";

interface FavoriteButtonProps {
  testId: string;
  initialCount: number;
}

const LS_KEY = "charcomp_favorites_v2";

const getLocalFavs = (): Record<string, boolean> => {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); } catch { return {}; }
};
const setLocalFav = (testId: string, val: boolean) => {
  const favs = getLocalFavs();
  favs[testId] = val;
  localStorage.setItem(LS_KEY, JSON.stringify(favs));
};

export function FavoriteButton({ testId, initialCount }: FavoriteButtonProps) {
  const { user } = useAuth();
  const [favorited, setFavorited] = useState(() => getLocalFavs()[testId] || false);
  const [count, setCount] = useState(initialCount);
  const [pending, setPending] = useState(false);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;

    const prevFavorited = favorited;
    const prevCount = count;
    const next = !favorited;

    setFavorited(next);
    setCount((prev) => next ? prev + 1 : Math.max(0, prev - 1));
    setLocalFav(testId, next);

    if (user) {
      setPending(true);
      try {
        const nowFav = await favoritesDb.toggle(user.id, testId, "test");
        setFavorited(nowFav);
        setLocalFav(testId, nowFav);
        if (nowFav !== next) {
          setCount((prev) => nowFav ? prev + 1 : Math.max(0, prev - 1));
        }
      } catch {
        setFavorited(prevFavorited);
        setCount(Math.max(0, prevCount));
        setLocalFav(testId, prevFavorited);
        toast.error("Could not update favorite. Please try again.");
      } finally {
        setPending(false);
      }
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`gap-1 ${favorited ? "text-amber-500 hover:text-amber-600" : "text-muted-foreground hover:text-foreground"}`}
      onClick={toggle}
      disabled={pending}
      data-testid={`button-favorite-${testId}`}
    >
      <Star className={favorited ? "fill-current" : ""} size={16} />
      <span className="text-xs">{count}</span>
    </Button>
  );
}
