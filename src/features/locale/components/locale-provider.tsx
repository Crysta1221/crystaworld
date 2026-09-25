import { createContext, useContext, useEffect, useState } from "react";

import { applyLocale, getStoredLocale } from "../lib/locale";
import type { Locale } from "../lib/locale";

type LocaleProviderProps = {
  children: React.ReactNode;
  storageKey?: string;
};

type LocaleProviderState = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleProviderContext = createContext<LocaleProviderState | undefined>(undefined);

export function LocaleProvider({
  children,
  storageKey = "crystaworld-locale",
}: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(() => getStoredLocale(storageKey));

  useEffect(() => {
    applyLocale(locale);
  }, [locale]);

  const setLocale = (next: Locale) => {
    try {
      window.localStorage.setItem(storageKey, next);
    } catch {
      // Storage may be unavailable; still apply the locale in memory.
    }
    setLocaleState(next);
  };

  return (
    <LocaleProviderContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleProviderContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleProviderContext);

  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }

  return context;
}
