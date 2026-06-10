import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../i18n/translations";

type Language = "en" | "tr";
type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("charcomp_language");
    if (saved === "en" || saved === "tr") return saved;
    const browserLang = navigator.language;
    if (browserLang.startsWith("tr")) return "tr";
    return "en";
  });

  useEffect(() => {
    localStorage.setItem("charcomp_language", language);
  }, [language]);

  const t = (key: TranslationKey) => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
