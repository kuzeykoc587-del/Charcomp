import { Link } from "wouter";
import { useTranslation } from "../contexts/LanguageContext";
import type { Universe } from "../lib/db";

interface UniverseCardProps {
  series: Universe;
  characterCount?: number;
}

export function UniverseCard({ series, characterCount }: UniverseCardProps) {
  const { t } = useTranslation();
  const count = characterCount ?? series.characterCount ?? 0;

  return (
    <Link href={`/universe/${series.id}`}>
      <div className="group relative flex flex-col rounded-xl bg-card border border-border overflow-hidden transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer">
        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          <img
            src={series.coverImage}
            alt={series.name}
            onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(series.name)}&background=0D0D0F&color=7C3AED&size=400&bold=true`; }}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-2 left-2 z-20">
            <span className="bg-background/90 backdrop-blur-sm text-xs px-2 py-1 rounded-md font-medium shadow-sm border">
              {series.category}
            </span>
          </div>
          <div className="absolute bottom-2 right-2 z-20">
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-bold shadow-sm">
              {count} {t("lbl_characters_count")}
            </span>
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-bold text-base line-clamp-1">{series.name}</h3>
        </div>
      </div>
    </Link>
  );
}
