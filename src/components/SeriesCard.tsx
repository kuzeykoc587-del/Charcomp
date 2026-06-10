import type { Universe } from "../lib/db";

interface SeriesCardProps {
  series: Universe | { id: string; name: string; coverImage: string; category: string };
  onClick: () => void;
  selected?: boolean;
}

export function SeriesCard({ series, onClick, selected }: SeriesCardProps) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col text-left overflow-hidden rounded-xl border-2 transition-all ${
        selected ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50"
      }`}
      data-testid={`card-series-${series.id}`}
    >
      <div className="aspect-square w-full bg-muted relative">
        <img
          src={series.coverImage}
          alt={series.name}
          className="w-full h-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(series.name)}&background=0D0D0F&color=7C3AED&size=400&bold=true`; }}
        />
        <div className="absolute top-2 left-2">
          <span className="bg-background/90 text-xs px-2 py-1 rounded-md font-medium shadow-sm border">
            {series.category}
          </span>
        </div>
      </div>
      <div className="p-3 bg-card w-full">
        <h3 className="font-bold text-sm line-clamp-1">{series.name}</h3>
      </div>
    </button>
  );
}
