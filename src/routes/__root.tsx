import { useLayoutEffect, useState } from "react";
import { Outlet, createRootRoute, useRouterState } from "@tanstack/react-router";
import { SiteFooter } from "@/shared/components/footer";
import { SiteHeader } from "@/shared/components/header";
import { AppContainer } from "@/shared/components/layout";
import { ScrollTopButton } from "@/shared/components/scroll-top-button";
import { scrollWindowToTop } from "@/shared/lib/scroll-to-top";
import { cn } from "@/shared/lib/utils";

import "@/app/styles.css";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  // `location` updates while the previous page is still rendered. Keying and
  // enabling the entrance animation from the committed match avoids restarting
  // that animation on the page that is still on screen.
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

  if (pathname === "/cms-preview") {
    return (
      <div className="min-h-dvh bg-background">
        <AppContainer>
          <Outlet />
        </AppContainer>
      </div>
    );
  }

  return (
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
  );
}
