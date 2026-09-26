import { useLayoutEffect } from "react";
import { Outlet, createRootRoute, useLocation } from "@tanstack/react-router";
import { SiteFooter } from "@/shared/components/footer";
import { SiteHeader } from "@/shared/components/header";
import { AppContainer } from "@/shared/components/layout";
import { ScrollTopButton } from "@/shared/components/scroll-top-button";
import { scrollWindowToTop } from "@/shared/lib/scroll-to-top";

import "@/app/styles.css";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const pathname = useLocation({ select: (location) => location.pathname });

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
            <div key={pathname}>
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
