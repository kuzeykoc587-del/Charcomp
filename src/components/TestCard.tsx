import { Link } from "wouter";
import { Play, Users } from "lucide-react";
import { LikeButton } from "./LikeButton";
import { FavoriteButton } from "./FavoriteButton";
import type { Test } from "../lib/db";

interface TestCardProps {
  test: Test;
}

export function TestCard({ test }: TestCardProps) {
  return (
    <div className="group relative flex flex-col rounded-xl bg-card border border-border overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
      <Link href={`/test/${test.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View test {test.title}</span>
      </Link>

      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        <img
          src={test.coverImage}
          alt={test.title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(test.title)}&background=7C3AED&color=fff&size=400&bold=true`;
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-2 right-2 z-20">
          <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-bold shadow-sm flex items-center gap-1">
            <Users size={12} /> {test.characterIds.length}
          </span>
        </div>
      </div>

      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-bold text-sm leading-tight mb-3 line-clamp-2 min-h-[2.5rem]">{test.title}</h3>

        <div className="mt-auto flex items-center justify-between z-20 relative pt-2 border-t border-border/50">
          <div className="flex items-center gap-1">
            <LikeButton testId={test.id} initialCount={test.likeCount} />
            <FavoriteButton testId={test.id} initialCount={test.favoriteCount} />
          </div>

          <Link
            href={`/test/${test.id}`}
            className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors bg-primary/10 px-2 py-1 rounded-md z-20 relative"
          >
            <Play size={12} className="fill-current" />
            {test.playCount > 0 ? test.playCount.toLocaleString() : "Yeni"}
          </Link>
        </div>
      </div>
    </div>
  );
}
