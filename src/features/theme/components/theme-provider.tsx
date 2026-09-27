import { createContext, useContext, useEffect, useState } from "react";

import { applyTheme, FALLBACK_THEME, getStoredTheme, resolveTheme } from "../lib/theme";
import type { Theme } from "../lib/theme";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: FALLBACK_THEME,
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// Theme provider following the shadcn dark-mode docs for Vite.
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  // The prerendered tree is the default theme. Read storage after mount so hydration matches.
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const stored = getStoredTheme(storageKey, defaultTheme);
    setThemeState(stored);
    applyTheme(resolveTheme(stored));
  }, [defaultTheme, storageKey]);

  const value = {
    theme,
    setTheme: (next: Theme) => {
      try {
        window.localStorage.setItem(storageKey, next);
      } catch {
        // Storage may be unavailable; still apply the theme in memory.
      }
      setThemeState(next);
      applyTheme(resolveTheme(next));
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
