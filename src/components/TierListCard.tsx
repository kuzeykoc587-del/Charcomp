import { Link } from "wouter";
import { LayoutList, Users } from "lucide-react";
import type { TierList } from "../lib/db";

interface TierListCardProps {
  tl: TierList;
}

export function TierListCard({ tl }: TierListCardProps) {
  const tiers = tl.tiers || [];
  return (
    <div className="group relative flex flex-col rounded-xl bg-card border border-border overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
      <Link href={`/tierlist/${tl.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View {tl.title}</span>
      </Link>

      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-amber-500/20 to-yellow-600/10 flex flex-col items-center justify-center gap-2 px-2">
        <LayoutList size={24} className="text-amber-400/60 absolute top-2 right-2" />
        <div className="flex flex-wrap gap-1 justify-center">
          {tiers.slice(0, 5).map((tier) => (
            <span
              key={tier.name}
              className="text-sm font-black px-2 py-1 rounded-lg border"
              style={{
                backgroundColor: `${tier.color}25`,
                color: tier.color,
                borderColor: `${tier.color}40`,
              }}
            >
              {tier.name}
            </span>
          ))}
          {tiers.length > 5 && (
            <span className="text-xs font-bold px-2 py-1 rounded-lg bg-muted text-muted-foreground">
              +{tiers.length - 5}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{(tl.characterIds || []).length} chars</p>
      </div>

      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-bold text-sm leading-tight line-clamp-2 min-h-[2.5rem]">{tl.title}</h3>
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-border/50">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Users size={11} /> {tl.playCount > 0 ? tl.playCount : "Yeni"}
          </span>
          <span className="text-xs font-bold text-amber-500">{tiers.length} tiers</span>
        </div>
      </div>
    </div>
  );
}
