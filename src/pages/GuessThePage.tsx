import { Header } from "../components/Header";
import { useTranslation } from "../contexts/LanguageContext";
import { HelpCircle, Image, Music, FileText, Smile } from "lucide-react";
import { Link } from "wouter";
import { Button } from "../components/ui/button";

const FORMATS = [
  { icon: <Image size={24} />, label: "Guess from Image", desc: "A blurred or partial image — what is it?" },
  { icon: <Music size={24} />, label: "Guess the Sound", desc: "Hear a sound clip and guess" },
  { icon: <FileText size={24} />, label: "Guess from Clue", desc: "Text hints that reveal the answer" },
  { icon: <Smile size={24} />, label: "Guess from Emoji", desc: "Emoji-only clues" },
];

export default function GuessThePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[100dvh] flex flex-col pb-20 md:pb-0">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
            <HelpCircle size={32} className="text-emerald-400" />
          </div>
          <h1 className="text-3xl font-black mb-2">{t("lbl_guess_the")}</h1>
          <p className="text-muted-foreground">
            Can you figure it out from the clues?
          </p>
          <span className="inline-block mt-3 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            {t("home_coming_soon")}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {FORMATS.map((f) => (
            <div
              key={f.label}
              className="rounded-2xl border bg-card p-5 flex items-start gap-4 opacity-70"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                {f.icon}
              </div>
              <div>
                <p className="font-bold text-sm">{f.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border bg-card p-6 text-center">
          <h2 className="font-black text-lg mb-2">Coming Soon</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Guess The is under development. In the meantime, check out our other content types.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/tests">
              <Button variant="outline" size="sm">Tests</Button>
            </Link>
            <Link href="/duels">
              <Button variant="outline" size="sm">Duels</Button>
            </Link>
            <Link href="/this-or-that">
              <Button variant="outline" size="sm">{t("lbl_this_or_that")}</Button>
            </Link>
            <Link href="/tierlists">
              <Button variant="outline" size="sm">{t("lbl_tierlists")}</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
