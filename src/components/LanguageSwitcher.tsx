import { useTranslation } from "../contexts/LanguageContext";
import { Button } from "./ui/button";

export function LanguageSwitcher({ mobile }: { mobile?: boolean }) {
  const { language, setLanguage } = useTranslation();

  return (
    <Button
      variant="outline"
      size="sm"
      className="font-mono text-xs w-10 px-0 h-8"
      onClick={() => setLanguage(language === "en" ? "tr" : "en")}
      data-testid="button-language-switcher"
    >
      {language.toUpperCase()}
    </Button>
  );
}
