import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { List } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import type { MarkdownHeadingItem } from "@/shared/lib/markdown/extract-headings";
import { scrollToDocumentHash } from "@/shared/lib/markdown/scroll-to-hash";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { cn } from "@/shared/lib/utils";

const TOC_LINE_BASE = 8;

function getItemOffset(depth: number): number {
  return 20 + Math.max(0, depth - 2) * 12;
}

function getLineOffset(depth: number): number {
  return TOC_LINE_BASE + Math.max(0, depth - 2) * 8;
}

function useVisibleHeadingIds(ids: string[]): string[] {
  const [visibleIds, setVisibleIds] = useState<string[]>([]);

  useEffect(() => {
    if (ids.length === 0) return;

    const update = () => {
      const elements = ids
        .map((id) => document.getElementById(id))
        .filter((element): element is HTMLElement => element !== null);
      if (elements.length === 0) return;

      const viewportTop = 96;
      const viewportBottom = window.innerHeight;

      const next = ids.filter((_, index) => {
        const element = elements[index];
        if (!element) return false;
        const sectionTop = element.getBoundingClientRect().top;
        const sectionBottom =
          elements[index + 1]?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
        return sectionBottom > viewportTop && sectionTop < viewportBottom;
      });

      setVisibleIds((current) => {
        if (current.length === next.length && current.every((id, index) => id === next[index])) {
          return current;
        }
        return next;
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ids]);

  return visibleIds;
}

export interface ArticleTocProps {
  headings: readonly MarkdownHeadingItem[];
  className?: string;
  onNavigate?: () => void;
}

/**
 * Organic curved-path Table of Contents navigation matching commapedia.
 */
export function ArticleToc({ headings, className, onNavigate }: ArticleTocProps) {
  const items = useMemo(
    () => headings.filter((heading) => heading.depth >= 2 && heading.depth <= 3),
    [headings],
  );
  const ids = useMemo(() => items.map((item) => item.id), [items]);
  const visibleIds = useVisibleHeadingIds(ids);
  const visibleSet = useMemo(() => new Set(visibleIds), [visibleIds]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState<{
    d: string;
    width: number;
    height: number;
    top: number;
    bottom: number;
    dot: { x: number; y: number } | null;
  } | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || items.length === 0) return;

    const update = () => {
      let width = 0;
      let height = 0;
      let path = "";
      let previousX = 0;
      let previousBottom = 0;
      const positions = new Map<string, { top: number; bottom: number; x: number }>();

      for (let index = 0; index < items.length; index += 1) {
        const item = items[index];
        if (!item) continue;
        const element = container.querySelector(`[data-toc-id="${CSS.escape(item.id)}"]`);
        if (!(element instanceof HTMLElement)) continue;

        const styles = getComputedStyle(element);
        const x = getLineOffset(item.depth) + 0.5;
        const top = element.offsetTop + Number.parseFloat(styles.paddingTop);
        const bottom =
          element.offsetTop + element.clientHeight - Number.parseFloat(styles.paddingBottom);
        width = Math.max(x + 8, width);
        height = Math.max(height, bottom);

        if (path === "") {
          path += `M${x} ${top} L${x} ${bottom}`;
        } else {
          path += `C${previousX} ${top - 4} ${x} ${previousBottom + 4} ${x} ${top} L${x} ${bottom}`;
        }

        previousX = x;
        previousBottom = bottom;
        positions.set(item.id, { top, bottom, x });
      }

      const active = items.filter((item) => visibleSet.has(item.id));
      let upper = Number.POSITIVE_INFINITY;
      let lower = 0;
      let endX = 0;
      for (const item of active) {
        const position = positions.get(item.id);
        if (!position) continue;
        if (position.top < upper) upper = position.top;
        if (position.bottom > lower) {
          lower = position.bottom;
          endX = position.x;
        }
      }
      const hasActive = Number.isFinite(upper);

      setThumb({
        d: path,
        width,
        height,
        top: hasActive ? upper : 0,
        bottom: hasActive ? lower : 0,
        dot: hasActive ? { x: endX, y: lower } : null,
      });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => observer.disconnect();
  }, [items, visibleSet]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="目次" className={cn("flex min-h-0 flex-1 flex-col gap-3", className)}>
      <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <List className="size-3.5" aria-hidden="true" />
        目次
      </p>
      <ScrollArea className="min-h-0 flex-1 pr-2">
        <div ref={containerRef} className="relative flex flex-col">
          {thumb ? (
            <div
              className="pointer-events-none absolute inset-s-0 top-0 z-0 overflow-visible"
              style={{ width: thumb.width, height: thumb.height }}
            >
              <svg
                className="absolute overflow-visible"
                xmlns="http://www.w3.org/2000/svg"
                viewBox={`0 0 ${thumb.width} ${thumb.height}`}
                style={{ width: thumb.width, height: thumb.height }}
              >
                <path
                  d={thumb.d}
                  className="fill-none stroke-foreground/15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                />
              </svg>
              <div
                className="absolute inset-0 transition-[clip-path] duration-300"
                style={{
                  clipPath: `polygon(0 ${thumb.top}px, 100% ${thumb.top}px, 100% ${thumb.bottom}px, 0 ${thumb.bottom}px)`,
                }}
              >
                <svg
                  className="absolute overflow-visible"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox={`0 0 ${thumb.width} ${thumb.height}`}
                  style={{ width: thumb.width, height: thumb.height }}
                >
                  <path
                    d={thumb.d}
                    className="fill-none stroke-primary"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              {thumb.dot ? (
                <span
                  className="absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
                  style={{ left: thumb.dot.x, top: thumb.dot.y }}
                />
              ) : null}
            </div>
          ) : null}
          {items.map((item, index) => {
            const isActive = visibleSet.has(item.id);
            return (
              <Link
                key={item.id}
                to="."
                hash={item.id}
                data-toc-id={item.id}
                onClick={() => {
                  scrollToDocumentHash(item.id);
                  onNavigate?.();
                }}
                aria-current={visibleIds[0] === item.id ? "location" : undefined}
                className={cn(
                  "py-1.5 text-sm text-muted-foreground no-underline transition-colors wrap-anywhere hover:text-foreground",
                  isActive && "text-primary font-medium",
                  index === 0 && "pt-0",
                  index === items.length - 1 && "pb-0",
                )}
                style={{ paddingInlineStart: getItemOffset(item.depth) }}
              >
                {item.text}
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </nav>
  );
}
