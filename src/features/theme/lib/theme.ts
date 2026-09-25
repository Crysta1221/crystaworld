export type Theme = "dark" | "light" | "system";

const FALLBACK_THEME: Theme = "system";

function isTheme(value: string | null): value is Theme {
  return value === "dark" || value === "light" || value === "system";
}

// Read the persisted theme without throwing in restricted contexts.
export function getStoredTheme(storageKey: string, defaultTheme: Theme): Theme {
  try {
    const stored = window.localStorage.getItem(storageKey);
    return isTheme(stored) ? stored : defaultTheme;
  } catch {
    return defaultTheme;
  }
}

// Resolve "system" to the OS-level preference.
export function resolveTheme(theme: Theme): "dark" | "light" {
  if (theme !== "system") {
    return theme;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// Mirror the docs behavior: keep exactly one of the classes on <html>.
export function applyTheme(theme: "dark" | "light"): void {
  const root = window.document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
}

export { FALLBACK_THEME };
