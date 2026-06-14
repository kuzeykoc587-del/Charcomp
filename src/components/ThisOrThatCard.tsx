import { Link } from "wouter";
import { Shuffle } from "lucide-react";
import type { ThisOrThat } from "../lib/db";

interface ThisOrThatCardProps {
  poll: ThisOrThat;
}

export function ThisOrThatCard({ poll }: ThisOrThatCardProps) {
  const total = poll.votesA + poll.votesB;
  const pctA = total > 0 ? Math.round((poll.votesA / total) * 100) : 50;
  const pctB = 100 - pctA;

  return (
    <div className="group relative flex flex-col rounded-xl bg-card border border-border overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
      <Link href={`/this-or-that/${poll.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View poll</span>
      </Link>

      <div className="relative aspect-square w-full overflow-hidden flex">
        {/* A side */}
        <div className="flex-1 relative bg-blue-500/15 flex flex-col items-center justify-center px-2">
          {poll.imageA ? (
            <img
              src={poll.imageA}
              alt={poll.optionA}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : null}
          <div className={`relative text-center ${poll.imageA ? "bg-black/50 rounded-lg px-2 py-1" : ""}`}>
            <p className={`text-xs font-black leading-tight line-clamp-3 ${poll.imageA ? "text-white" : "text-blue-300"}`}>
              {poll.optionA}
            </p>
          </div>
        </div>

        {/* VS divider */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center z-10">
          <div className="w-7 h-7 rounded-full bg-background border-2 border-border flex items-center justify-center">
            <span className="text-[8px] font-black text-muted-foreground">VS</span>
          </div>
        </div>

        {/* B side */}
        <div className="flex-1 relative bg-rose-500/15 flex flex-col items-center justify-center px-2">
          {poll.imageB ? (
            <img
              src={poll.imageB}
              alt={poll.optionB}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : null}
          <div className={`relative text-center ${poll.imageB ? "bg-black/50 rounded-lg px-2 py-1" : ""}`}>
            <p className={`text-xs font-black leading-tight line-clamp-3 ${poll.imageB ? "text-white" : "text-rose-300"}`}>
              {poll.optionB}
            </p>
          </div>
        </div>

        {/* Vote bar */}
        {total > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 flex">
            <div className="bg-blue-500 h-full transition-all" style={{ width: `${pctA}%` }} />
            <div className="bg-rose-500 h-full flex-1 transition-all" />
          </div>
        )}

        <div className="absolute top-1.5 left-1.5 z-10">
          <Shuffle size={12} className="text-sky-400 drop-shadow" />
        </div>
      </div>

      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-bold text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
          {poll.title || `${poll.optionA} vs ${poll.optionB}`}
        </h3>
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-border/50">
          <span className="text-xs text-muted-foreground">
            {total > 0 ? `${total.toLocaleString()} votes` : "Yeni"}
          </span>
          {total > 0 && (
            <span className="text-xs font-bold text-sky-400">{pctA}% / {pctB}%</span>
          )}
        </div>
      </div>
    </div>
  );
}
