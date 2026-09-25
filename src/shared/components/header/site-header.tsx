import { useEffect, useRef, useState, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { LocaleToggle } from "@/features/locale";
import { ThemeToggle } from "@/features/theme";
import { AppContainer } from "@/shared/components/layout";
import { HeaderMenuFrame } from "./header-menu-frame";
import { MenuToggleIcon } from "./menu-toggle-icon";
import { TabsPill, type TabsPillItem } from "./tabs-pill";
import { cn } from "@/shared/lib/utils";

const NAV_ITEMS: readonly TabsPillItem[] = [
  { label: "Home", href: "/" },
  { label: "Works", href: "/works" },
  { label: "Blogs", href: "/blogs" },
  { label: "Tips", href: "/tips" },
] as const;

const MENU_EASE = "ease-[cubic-bezier(0.65,0,0.35,1)]";

function activeNavHref(pathname: string): string {
  const match = NAV_ITEMS.filter(
    (item) => item.href !== "/" && (pathname === item.href || pathname.startsWith(`${item.href}/`)),
  ).sort((a, b) => b.href.length - a.href.length)[0];

  return match?.href ?? "/";
}

/**
  SiteHeader component integrating TabsPill, Logo, ThemeToggle and GSAP mobile navigation.
 */
export function SiteHeader() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const closeInstantly = useRef(false);
  const pathname = useLocation({ select: (location) => location.pathname });
  const navigate = useNavigate();
  const activeHref = activeNavHref(pathname);
  const hideWithoutMotion = closeInstantly.current && !isMobileOpen;

  const selectItem = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;

    event.preventDefault();
    closeInstantly.current = true;
    flushSync(() => setIsMobileOpen(false));
    requestAnimationFrame(() => {
      void navigate({ to: href as "/" });
    });
  };

  const goTo = (href: string) => {
    setIsMobileOpen(false);
    void navigate({ to: href as "/" });
  };

  useEffect(() => {
    if (!isMobileOpen) return;

    const root = document.documentElement;
    const scrollY = window.scrollY;
    const previous = {
      rootOverflow: root.style.overflow,
      bodyOverflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
    };
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileOpen(false);
    };

    const media = window.matchMedia("(min-width: 768px)");
    const onViewportChange = () => {
      if (media.matches) setIsMobileOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    media.addEventListener("change", onViewportChange);

    return () => {
      root.style.overflow = previous.rootOverflow;
      document.body.style.overflow = previous.bodyOverflow;
      document.body.style.position = previous.position;
      document.body.style.top = previous.top;
      document.body.style.left = previous.left;
      document.body.style.right = previous.right;
      document.body.style.width = previous.width;
      window.scrollTo(0, scrollY);
      window.removeEventListener("keydown", onKeyDown);
      media.removeEventListener("change", onViewportChange);
    };
  }, [isMobileOpen]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 w-full bg-transparent">
      {/* Mobile Navigation Drawer */}
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal={isMobileOpen}
        aria-label="Mobile navigation"
        aria-hidden={!isMobileOpen}
        inert={!isMobileOpen}
        className={cn(
          "fixed inset-0 z-0 flex flex-col items-center justify-center gap-8 overflow-hidden bg-background md:hidden",
          "transition-opacity duration-300",
          MENU_EASE,
          "motion-reduce:transition-none",
          isMobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
          hideWithoutMotion && "transition-none",
        )}
        style={hideWithoutMotion ? { transition: "none" } : undefined}
      >
        {NAV_ITEMS.map((item, index) => (
          <Link
            key={item.href}
            to={item.href as "/"}
            tabIndex={isMobileOpen ? 0 : -1}
            onClick={(event) => selectItem(event, item.href)}
            style={
              hideWithoutMotion
                ? { transition: "none" }
                : {
                    transitionDelay: isMobileOpen
                      ? `${70 + index * 50}ms`
                      : `${(NAV_ITEMS.length - 1 - index) * 30}ms`,
                  }
            }
            className={cn(
              "cursor-pointer text-2xl font-medium text-foreground",
              "transition-[opacity,transform] duration-400",
              MENU_EASE,
              "motion-reduce:translate-y-0 motion-reduce:transition-none",
              isMobileOpen ? "translate-y-0" : "translate-y-4",
              isMobileOpen
                ? item.href === activeHref
                  ? "text-primary font-bold opacity-100"
                  : "opacity-75 hover:opacity-100"
                : "opacity-0",
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Main Header Bar */}
      <AppContainer className="relative z-10 flex items-center justify-end py-3">
        {/* Desktop: Right-aligned Integrated Island Pill with Navigation + Divider + ThemeToggle */}
        <HeaderMenuFrame className="hidden md:flex items-center">
          <nav aria-label="Primary navigation">
            <TabsPill
              items={NAV_ITEMS}
              value={activeHref}
              onValueChange={() => {}}
              onItemActivate={(item) => goTo(item.href)}
            />
          </nav>
          <div className="mx-1 h-5 w-px shrink-0 bg-border/80" aria-hidden="true" />
          <ThemeToggle />
          <LocaleToggle />
        </HeaderMenuFrame>

        {/* Mobile: Unified Control Pill */}
        <HeaderMenuFrame className="flex md:hidden items-center gap-1">
          <ThemeToggle />
          <LocaleToggle />
          <div className="mx-0.5 h-5 w-px shrink-0 bg-border/80" aria-hidden="true" />
          <button
            type="button"
            className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring select-none"
            aria-expanded={isMobileOpen}
            aria-controls="mobile-nav"
            aria-label={
              isMobileOpen ? "Close mobile navigation menu" : "Open mobile navigation menu"
            }
            onClick={() => {
              closeInstantly.current = false;
              setIsMobileOpen((open) => !open);
            }}
          >
            <MenuToggleIcon open={isMobileOpen} />
          </button>
        </HeaderMenuFrame>
      </AppContainer>
    </header>
  );
}
