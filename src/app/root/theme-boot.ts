/**
 * Inline script that applies the stored theme and locale before the first paint.
 * Keys match the providers in `src/app/providers.tsx`.
 */
export const THEME_BOOT = `try {
  var storedTheme = localStorage.getItem("crystaworld-theme");
  var wantsDark = storedTheme === "dark" || (storedTheme !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  if (wantsDark) document.documentElement.classList.add("dark");
  var storedLocale = localStorage.getItem("crystaworld-locale");
  document.documentElement.lang = storedLocale === "en" || storedLocale === "ja" ? storedLocale : "ja";
} catch (e) {}`;
