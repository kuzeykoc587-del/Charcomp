import { Link } from "wouter";
import { Trophy, ListOrdered } from "lucide-react";
import { useTranslation } from "../contexts/LanguageContext";

interface ModeSelectorProps {
  testId: string;
}

export function ModeSelector({ testId }: ModeSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
      <Link href={`/play/${testId}/tournament`} className="group flex flex-col items-center justify-center p-8 bg-card border-2 border-border rounded-2xl hover:border-primary hover:bg-primary/5 transition-all text-center gap-4 shadow-sm hover:shadow-md cursor-pointer">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all">
          <Trophy className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-xl mb-2">{t("mode_tournament")}</h3>
          <p className="text-muted-foreground text-sm">{t("mode_tournament_desc")}</p>
        </div>
      </Link>
      
      <Link href={`/play/${testId}/ranking`} className="group flex flex-col items-center justify-center p-8 bg-card border-2 border-border rounded-2xl hover:border-secondary hover:bg-secondary/5 transition-all text-center gap-4 shadow-sm hover:shadow-md cursor-pointer">
        <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 group-hover:scale-110 transition-all">
          <ListOrdered className="w-8 h-8 text-secondary" />
        </div>
        <div>
          <h3 className="font-bold text-xl mb-2">{t("mode_ranking")}</h3>
          <p className="text-muted-foreground text-sm">{t("mode_ranking_desc")}</p>
        </div>
      </Link>
    </div>
  );
}
