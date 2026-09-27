import { useLayoutEffect, useState, type ReactNode } from "react";
import { HeadContent, Outlet, Scripts, createRootRoute, useRouterState } from "@tanstack/react-router";
import { SiteFooter } from "@/shared/components/footer";
import { SiteHeader } from "@/shared/components/header";
import { AppContainer } from "@/shared/components/layout";
import { ScrollTopButton } from "@/shared/components/scroll-top-button";
import { scrollWindowToTop } from "@/shared/lib/scroll-to-top";
import { cn } from "@/shared/lib/utils";

import { AppProviders } from "@/app/providers";

import "@/app/styles.css";

const THEME_BOOT = `try {
  var storedTheme = localStorage.getItem("crystaworld-theme");
  var wantsDark = storedTheme === "dark" || (storedTheme !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  if (wantsDark) document.documentElement.classList.add("dark");
  var storedLocale = localStorage.getItem("crystaworld-locale");
  document.documentElement.lang = storedLocale === "en" || storedLocale === "ja" ? storedLocale : "ja";
} catch (e) {}`;

export const Route = createRootRoute({
  ssr: true,
  shellComponent: RootShell,
  component: RootLayout,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { title: "Crystaworld" },
      { name: "description", content: "くりすたのポートフォリオへようこそ！" },
      { property: "og:site_name", content: "Crystaworld" },
      { property: "og:title", content: "Crystaworld" },
      { property: "og:description", content: "くりすたのポートフォリオへようこそ！" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://crystaworld.dev/" },
      { property: "og:image", content: "https://crystaworld.dev/og/default.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:locale", content: "ja_JP" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "icon", href: "/images/crysta-avatar.webp", type: "image/webp", sizes: "192x192" },
      { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
      {
        rel: "preload",
        href: "/fonts/Natadecoco-gothic.otf",
        as: "font",
        type: "font/otf",
        crossOrigin: "anonymous" as const,
      },
      ...(import.meta.env.PROD
        ? [
            {
              rel: "preload",
              href: "/fonts/zen-maru-gothic-500.woff2",
              as: "font",
              type: "font/woff2",
              crossOrigin: "anonymous" as const,
            },
            {
              rel: "preload",
              href: "/fonts/zen-maru-gothic-700.woff2",
              as: "font",
              type: "font/woff2",
              crossOrigin: "anonymous" as const,
            },
          ]
        : []),
    ],
    scripts: [{ children: THEME_BOOT }],
  }),
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootLayout() {
  const pathname = useRouterState({
    select: (state) => state.matches.at(-1)?.pathname ?? state.location.pathname,
  });
  const [seenPath, setSeenPath] = useState(pathname);
  const [animateEnter, setAnimateEnter] = useState(false);
  if (pathname !== seenPath) {
    setSeenPath(pathname);
    setAnimateEnter(true);
  }

  useLayoutEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    scrollWindowToTop();
  }, [pathname]);

  return (
    <AppProviders>
      {pathname === "/cms-preview" ? (
        <div className="min-h-dvh bg-background">
          <AppContainer>
            <Outlet />
          </AppContainer>
        </div>
      ) : (
        <div className="flex w-full flex-1 flex-col">
          <div className="flex min-h-dvh flex-col">
            <SiteHeader />
            <main className="flex-1 pt-20">
              <AppContainer>
                <div key={pathname} className={cn(animateEnter && "is-transition")}>
                  <Outlet />
                </div>
              </AppContainer>
            </main>
          </div>
          <SiteFooter />
          <ScrollTopButton />
        </div>
      )}
    </AppProviders>
  );
}
