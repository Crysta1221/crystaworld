import { useLayoutEffect, useState } from "react";
import { Outlet, useRouterState } from "@tanstack/react-router";

import { AppProviders } from "@/app/providers";
import { AppContainer, ScrollTopButton, SiteFooter, SiteHeader } from "@/shared/components/layout";
import { scrollWindowToTop } from "@/shared/lib/scroll/scroll-to-top";
import { cn } from "@/shared/lib/utils";

/** Site chrome around every page. The CMS preview renders bare. */
export function RootLayout() {
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
