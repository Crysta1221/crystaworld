import { hydrateRoot, createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";

import { AppProviders } from "./providers";
import { router } from "./router";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const app = (
  <AppProviders>
    <RouterProvider router={router} />
  </AppProviders>
);

// Production HTML already contains the page. Development starts from an empty root.
if (rootElement.childElementCount > 0) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}
