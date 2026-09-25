import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { CaretLeftIcon } from "@phosphor-icons/react";
import type { MarkdownHeadingItem } from "@/shared/lib/markdown/extract-headings";
import { cn } from "@/shared/lib/utils";
import { ArticleToc } from "./article-toc";

const PANEL_EASE = "ease-[cubic-bezier(0.32,0.72,0,1)]";

interface ArticleTocSlideProps {
  headings: readonly MarkdownHeadingItem[];
}

/**
 * Phone and tablet table of contents. A handle on the trailing edge
 * slides a panel in from the right, leaving a strip of the article
 * so the page can still be scrolled.
 */
export function ArticleTocSlide({ headings }: ArticleTocSlideProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const hasItems = headings.some((heading) => heading.depth >= 2 && heading.depth <= 3);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!hasItems) return null;

  return createPortal(
    <div
      className={cn(
        "fixed z-30 lg:hidden",
        "top-20 bottom-[max(1rem,env(safe-area-inset-bottom))]",
        "inset-e-[max(0px,env(safe-area-inset-right))]",
        "w-[min(20rem,calc(100dvw-6.5rem))]",
        "transition-transform duration-300 motion-reduce:transition-none",
        PANEL_EASE,
        open ? "translate-x-0" : "translate-x-full",
      )}
    >
      <button
        type="button"
        className={cn(
          "absolute top-1/2 z-10 flex h-16 w-10 -translate-y-1/2 -inset-s-10 items-center justify-center",
          "rounded-s-xl border border-e-0 border-border bg-background/95 text-foreground shadow-md backdrop-blur-md",
          "cursor-pointer transition-colors hover:text-primary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
      >
        <CaretLeftIcon
          className={cn(
            "size-4 transition-transform duration-300 motion-reduce:transition-none",
            PANEL_EASE,
            open && "rotate-180",
          )}
          weight="bold"
          aria-hidden="true"
        />
        <span className="sr-only">{open ? "目次を閉じる" : "目次を開く"}</span>
      </button>

      <div
        id={panelId}
        inert={open ? undefined : true}
        className={cn(
          "flex h-full min-h-0 w-full flex-col overflow-hidden overscroll-contain",
          "rounded-s-2xl border border-border bg-background/95 shadow-2xl backdrop-blur-md",
        )}
      >
        <ArticleToc
          headings={headings}
          className="h-full px-4 py-4"
          onNavigate={() => setOpen(false)}
        />
      </div>
    </div>,
    document.body,
  );
}
