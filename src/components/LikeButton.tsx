import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { likesDb } from "../lib/db";
import { toast } from "sonner";

interface LikeButtonProps {
  testId: string;
  initialCount: number;
}

const LS_KEY = "charcomp_likes_v2";

const getLocalLikes = (): Record<string, boolean> => {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); } catch { return {}; }
};
const setLocalLike = (testId: string, val: boolean) => {
  const likes = getLocalLikes();
  likes[testId] = val;
  localStorage.setItem(LS_KEY, JSON.stringify(likes));
};

export function LikeButton({ testId, initialCount }: LikeButtonProps) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(() => getLocalLikes()[testId] || false);
  const [count, setCount] = useState(initialCount);
  const [pending, setPending] = useState(false);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;

    const prevLiked = liked;
    const prevCount = count;
    const next = !liked;

    setLiked(next);
    setCount((prev) => next ? prev + 1 : Math.max(0, prev - 1));
    setLocalLike(testId, next);

    if (user) {
      setPending(true);
      try {
        const nowLiked = await likesDb.toggle(user.id, testId);
        setLiked(nowLiked);
        setLocalLike(testId, nowLiked);
        if (nowLiked !== next) {
          setCount((prev) => nowLiked ? prev + 1 : Math.max(0, prev - 1));
        }
      } catch {
        setLiked(prevLiked);
        setCount(Math.max(0, prevCount));
        setLocalLike(testId, prevLiked);
        toast.error("Could not update like. Please try again.");
      } finally {
        setPending(false);
      }
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`gap-1 ${liked ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground"}`}
      onClick={toggle}
      disabled={pending}
      data-testid={`button-like-${testId}`}
    >
      <Heart className={liked ? "fill-current" : ""} size={16} />
      <span className="text-xs">{count}</span>
    </Button>
  );
}
