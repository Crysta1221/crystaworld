import { Outlet, createRootRoute, useLocation } from "@tanstack/react-router";
import { SiteHeader } from "@/shared/components/header";
import { AppContainer } from "@/shared/components/layout";

import "@/app/styles.css";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const pathname = useLocation({ select: (location) => location.pathname });

  return (
    <>
      <SiteHeader />
      <main className="pt-20">
        <AppContainer>
          <div key={pathname}>
            <Outlet />
          </div>
        </AppContainer>
      </main>
    </>
  );
}
