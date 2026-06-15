import { Link } from "wouter";
import { Shuffle, Play } from "lucide-react";
import type { ThisOrThat } from "../lib/db";

interface ThisOrThatCardProps {
  poll: ThisOrThat;
}

export function ThisOrThatCard({ poll }: ThisOrThatCardProps) {
  const isNew = Array.isArray(poll.options) && poll.options.length >= 2;

  if (isNew) {
    const opts = poll.options!;
    const optA = opts[0];
    const optB = opts[1];
    const playCount = poll.playCount ?? 0;

    return (
      <div className="group relative flex flex-col rounded-xl bg-card border border-border overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
        <Link href={`/this-or-that/${poll.id}`} className="absolute inset-0 z-10">
          <span className="sr-only">Oyna</span>
        </Link>

        <div className="relative aspect-square w-full overflow-hidden flex">
          <div className="flex-1 relative bg-sky-500/15 flex flex-col items-center justify-center px-2">
            {optA.imageUrl ? (
              <img
                src={optA.imageUrl}
                alt={optA.text}
                className="absolute inset-0 w-full h-full object-cover"
                onError={e => { console.warn("[IMAGE] failed to load", optA.imageUrl); (e.target as HTMLImageElement).style.display = "none"; }}
              />
            ) : null}
            <div className={`relative text-center ${optA.imageUrl ? "bg-black/50 rounded-lg px-2 py-1" : ""}`}>
              <p className={`text-xs font-black leading-tight line-clamp-3 ${optA.imageUrl ? "text-white" : "text-sky-300"}`}>
                {optA.text}
              </p>
            </div>
          </div>

          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center z-10">
            <div className="w-7 h-7 rounded-full bg-background border-2 border-border flex items-center justify-center">
              <span className="text-[8px] font-black text-muted-foreground">VS</span>
            </div>
          </div>

          <div className="flex-1 relative bg-violet-500/15 flex flex-col items-center justify-center px-2">
            {optB.imageUrl ? (
              <img
                src={optB.imageUrl}
                alt={optB.text}
                className="absolute inset-0 w-full h-full object-cover"
                onError={e => { console.warn("[IMAGE] failed to load", optB.imageUrl); (e.target as HTMLImageElement).style.display = "none"; }}
              />
            ) : null}
            <div className={`relative text-center ${optB.imageUrl ? "bg-black/50 rounded-lg px-2 py-1" : ""}`}>
              <p className={`text-xs font-black leading-tight line-clamp-3 ${optB.imageUrl ? "text-white" : "text-violet-300"}`}>
                {optB.text}
              </p>
            </div>
          </div>

          <div className="absolute top-1.5 left-1.5 z-10">
            <Shuffle size={12} className="text-sky-400 drop-shadow" />
          </div>

          {opts.length > 2 && (
            <div className="absolute bottom-1.5 right-1.5 z-10 bg-background/80 rounded-full px-1.5 py-0.5">
              <span className="text-[9px] font-bold text-muted-foreground">+{opts.length - 2}</span>
            </div>
          )}
        </div>

        <div className="p-3 flex flex-col flex-1">
          <h3 className="font-bold text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
            {poll.title || `${optA.text} vs ${optB.text}`}
          </h3>
          <div className="mt-auto flex items-center justify-between pt-2 border-t border-border/50">
            <span className="text-xs text-muted-foreground">
              {opts.length} seçenek
            </span>
            <span className="text-xs font-bold text-sky-400 flex items-center gap-1">
              {playCount > 0 ? (
                <><Play size={10} /> {playCount.toLocaleString()}</>
              ) : (
                <span className="text-green-500 font-semibold">Yeni</span>
              )}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Legacy 2-option format
  const total = (poll.votesA ?? 0) + (poll.votesB ?? 0);
  const pctA = total > 0 ? Math.round(((poll.votesA ?? 0) / total) * 100) : 50;
  const pctB = 100 - pctA;

  return (
    <div className="group relative flex flex-col rounded-xl bg-card border border-border overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
      <Link href={`/this-or-that/${poll.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">Görüntüle</span>
      </Link>

      <div className="relative aspect-square w-full overflow-hidden flex">
        <div className="flex-1 relative bg-blue-500/15 flex flex-col items-center justify-center px-2">
          {poll.imageA ? (
            <img
              src={poll.imageA}
              alt={poll.optionA}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => { console.warn("[IMAGE] failed to load", poll.imageA); (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : null}
          <div className={`relative text-center ${poll.imageA ? "bg-black/50 rounded-lg px-2 py-1" : ""}`}>
            <p className={`text-xs font-black leading-tight line-clamp-3 ${poll.imageA ? "text-white" : "text-blue-300"}`}>
              {poll.optionA}
            </p>
          </div>
        </div>

        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center z-10">
          <div className="w-7 h-7 rounded-full bg-background border-2 border-border flex items-center justify-center">
            <span className="text-[8px] font-black text-muted-foreground">VS</span>
          </div>
        </div>

        <div className="flex-1 relative bg-rose-500/15 flex flex-col items-center justify-center px-2">
          {poll.imageB ? (
            <img
              src={poll.imageB}
              alt={poll.optionB}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => { console.warn("[IMAGE] failed to load", poll.imageB); (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : null}
          <div className={`relative text-center ${poll.imageB ? "bg-black/50 rounded-lg px-2 py-1" : ""}`}>
            <p className={`text-xs font-black leading-tight line-clamp-3 ${poll.imageB ? "text-white" : "text-rose-300"}`}>
              {poll.optionB}
            </p>
          </div>
        </div>

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
            {total > 0 ? `${total.toLocaleString()} oy` : "Yeni"}
          </span>
          {total > 0 && (
            <span className="text-xs font-bold text-sky-400">{pctA}% / {pctB}%</span>
          )}
        </div>
      </div>
    </div>
  );
}
