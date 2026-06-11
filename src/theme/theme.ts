import { createContext, useContext } from "react";

export const THEMES = ["Light", "Dark", "Marine", "Forest"] as const;
export type Theme = (typeof THEMES)[number];

export type ThemeContextValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export const THEME_STORAGE_KEY = "linguaswap.theme";

export function isTheme(value: string | null): value is Theme {
  return value !== null && (THEMES as readonly string[]).includes(value);
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}