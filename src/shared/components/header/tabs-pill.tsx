import {
  useLayoutEffect,
  useRef,
  type KeyboardEvent,
  type MouseEvent,
  type TransitionEvent,
} from "react";
import { cn } from "@/shared/lib/utils";

const PILL_TRANSITION =
  "left 0.4s cubic-bezier(0.65, 0, 0.35, 1), width 0.4s cubic-bezier(0.65, 0, 0.35, 1)";

export interface TabsPillItem {
  label: string;
  href: string;
}

interface TabsPillProps {
  items: readonly TabsPillItem[];
  value: string;
  onValueChange: (href: string) => void;
  onItemActivate: (item: TabsPillItem) => void;
  className?: string;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
  Sliding pill tab navigation for the site header.
 */
export function TabsPill({
  items,
  value,
  onValueChange,
  onItemActivate,
  className,
}: TabsPillProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const valueRef = useRef(value);
  valueRef.current = value;
  const pillAnimatingRef = useRef(false);

  const movePillTo = (target: HTMLElement, animate: boolean) => {
    const pill = pillRef.current;
    if (!pill) return;

    const left = `${target.offsetLeft}px`;
    const width = `${target.offsetWidth}px`;
    const reduced = prefersReducedMotion();

    if (reduced) {
      pillAnimatingRef.current = false;
      pill.style.transition = "none";
      pill.style.left = left;
      pill.style.width = width;
      return;
    }

    // A resize from the active label's font weight used to snap the pill
    // and cancel the slide. Keep the transition and aim at the new box.
    if (animate || pillAnimatingRef.current) {
      if (pill.style.left === left && pill.style.width === width) return;
      pillAnimatingRef.current = true;
      pill.style.transition = PILL_TRANSITION;
      pill.style.left = left;
      pill.style.width = width;
      return;
    }

    pill.style.transition = "none";
    pill.style.left = left;
    pill.style.width = width;
    void pill.offsetWidth;
    pill.style.transition = PILL_TRANSITION;
  };

  const handlePillTransitionEnd = (event: TransitionEvent<HTMLSpanElement>) => {
    if (event.target !== pillRef.current) return;
    if (event.propertyName !== "left" && event.propertyName !== "width") return;
    const pill = pillRef.current;
    const stillRunning = pill
      .getAnimations()
      .some((animation) => animation.playState === "running");
    if (!stillRunning) pillAnimatingRef.current = false;
  };

  const syncToValue = (href: string, animate: boolean) => {
    const index = items.findIndex((item) => item.href === href);
    const target = itemRefs.current[index];
    if (target) movePillTo(target, animate);
  };

  useLayoutEffect(() => {
    syncToValue(valueRef.current, false);

    const track = trackRef.current;
    if (!track) return;

    const observer = new ResizeObserver(() => {
      syncToValue(valueRef.current, false);
    });
    observer.observe(track);

    let cancelled = false;
    void document.fonts?.ready.then(() => {
      if (!cancelled) syncToValue(valueRef.current, false);
    });

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [items]);

  const isFirstValueSync = useRef(true);
  useLayoutEffect(() => {
    if (isFirstValueSync.current) {
      isFirstValueSync.current = false;
      return;
    }
    syncToValue(value, true);
  }, [value]);

  const activate = (item: TabsPillItem, target: HTMLElement) => {
    movePillTo(target, true);
    onValueChange(item.href);
    onItemActivate(item);
  };

  const handleClick = (item: TabsPillItem, event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    activate(item, event.currentTarget);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = items.findIndex((item) => item.href === value);
    if (currentIndex < 0) return;

    let nextIndex = currentIndex;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % items.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + items.length) % items.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = items.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const nextItem = items[nextIndex];
    const nextEl = itemRefs.current[nextIndex];
    if (!nextItem || !nextEl) return;
    nextEl.focus();
    activate(nextItem, nextEl);
  };

  return (
    <div
      ref={trackRef}
      role="tablist"
      aria-label="Navigation sections"
      onKeyDown={handleKeyDown}
      className={cn("relative isolate flex items-center gap-1 bg-transparent", className)}
    >
      <span
        ref={pillRef}
        aria-hidden
        onTransitionEnd={handlePillTransitionEnd}
        className="pointer-events-none absolute inset-y-0 z-0 rounded-full bg-primary shadow-sm"
      />

      {items.map((item, index) => {
        const isActive = item.href === value;

        return (
          <a
            key={item.href}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            href={item.href}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={(event) => handleClick(item, event)}
            className={cn(
              "relative z-10 inline-flex cursor-pointer items-center justify-center rounded-full",
              "h-9 px-4 text-sm font-medium leading-none",
              "select-none outline-none transition-colors duration-400 ease-[cubic-bezier(0.65,0,0.35,1)]",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "motion-reduce:transition-none",
              isActive
                ? "text-primary-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </a>
        );
      })}
    </div>
  );
}
