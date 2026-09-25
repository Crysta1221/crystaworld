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
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme(storageKey, defaultTheme));

  useEffect(() => {
    applyTheme(resolveTheme(theme));
  }, [theme]);

  const value = {
    theme,
    setTheme: (next: Theme) => {
      try {
        window.localStorage.setItem(storageKey, next);
      } catch {
        // Storage may be unavailable; still apply the theme in memory.
      }
      setTheme(next);
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
