import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";

import { LocaleProvider } from "@/features/locale";
import { ThemeProvider } from "@/features/theme";

import { router } from "./router";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider storageKey="crystaworld-theme">
      <LocaleProvider storageKey="crystaworld-locale">
        <RouterProvider router={router} />
      </LocaleProvider>
    </ThemeProvider>
  </StrictMode>,
);
