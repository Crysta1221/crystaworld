import { useEffect, useState } from "react";
import { ArrowUpIcon } from "@phosphor-icons/react";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

const SHOW_AFTER = 320;

/**
 * Floating control that appears once the page has moved away from the top.
 */
export function ScrollTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > SHOW_AFTER;
      setVisible((current) => (current === next ? current : next));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      aria-label="ページの先頭へ戻る"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={(event) => {
        event.currentTarget.blur();
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, left: 0, behavior: reduce ? "instant" : "smooth" });
      }}
      className={cn(
        "fixed z-40 size-11 rounded-full shadow-lg ring-1 ring-foreground/10",
        "inset-e-[max(1.25rem,env(safe-area-inset-right))] bottom-[max(1.25rem,env(safe-area-inset-bottom))]",
        "transition duration-200 motion-reduce:transition-none",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
      )}
    >
      <ArrowUpIcon weight="bold" />
    </Button>
  );
}
