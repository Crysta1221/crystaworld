import { createRootRoute } from "@tanstack/react-router";

import { RootLayout, RootShell, rootHead } from "@/app/root";

import "@/app/styles.css";
import "@/app/fonts.css";

export const Route = createRootRoute({
  ssr: true,
  shellComponent: RootShell,
  component: RootLayout,
  head: rootHead,
});
