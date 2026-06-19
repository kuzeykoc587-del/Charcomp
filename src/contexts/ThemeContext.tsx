import React, { createContext, useContext, useEffect, useState } from "react";

export type AppTheme = "default" | "bw" | "gold" | "purple" | "pink" | "blue";

interface ThemeContextType {
  appTheme: AppTheme;
  setAppTheme: (theme: AppTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = "charcomp_theme";

export const THEME_LABELS: Record<AppTheme, string> = {
  default: "Default (Purple)",
  bw: "Black & White",
  gold: "Black & Gold",
  purple: "Black & Purple",
  pink: "Purple & Pink",
  blue: "Blue & White",
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [appTheme, setAppThemeState] = useState<AppTheme>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved && ["default", "bw", "gold", "purple", "pink", "blue"].includes(saved)) {
        return saved as AppTheme;
      }
    } catch { /* ignore */ }
    return "default";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add("dark");
    root.setAttribute("data-theme", appTheme);
    try { localStorage.setItem(THEME_KEY, appTheme); } catch { /* ignore */ }
  }, [appTheme]);

  const setAppTheme = (theme: AppTheme) => {
    setAppThemeState(theme);
  };

  return (
    <ThemeContext.Provider value={{ appTheme, setAppTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
