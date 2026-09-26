import { StrictMode, type ReactNode } from "react";

import { LocaleProvider } from "@/features/locale";
import { ThemeProvider } from "@/features/theme";

/**
 * Shared by the browser entry and the build-time prerender so both trees match.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <StrictMode>
      <ThemeProvider storageKey="crystaworld-theme">
        <LocaleProvider storageKey="crystaworld-locale">{children}</LocaleProvider>
      </ThemeProvider>
    </StrictMode>
  );
}
