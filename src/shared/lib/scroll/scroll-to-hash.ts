/**
 * Scrolls to the element named by `hash` so it stops just below the fixed header.
 * The offset comes from `scroll-padding-top` on `html` (the `--anchor-offset` token), which
 * native `scrollIntoView` already applies. Links that call this should pass
 * `hashScrollIntoView={false}` so the router does not start a second scroll.
 */
export function scrollToDocumentHash(hash: string | undefined): void {
  const target = findTarget(hash);
  if (!target) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior: ScrollBehavior = reducedMotion ? "auto" : "smooth";
  target.scrollIntoView({ behavior, block: "start" });
  if (behavior === "smooth") settleAfterScroll(target);
}

function findTarget(hash: string | undefined): HTMLElement | null {
  if (!hash) return null;
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!raw) return null;
  let id = raw;
  try {
    id = decodeURIComponent(raw);
  } catch {
    id = raw;
  }
  return document.getElementById(id) ?? document.getElementById(raw);
}

/**
 * Article blocks use `content-visibility: auto`, so blocks the smooth scroll passes can
 * change height on the way. Once scrolling ends, snap the target back to the offset.
 */
function settleAfterScroll(target: HTMLElement): void {
  const settle = () => {
    const delta = target.getBoundingClientRect().top - anchorOffset();
    if (Math.abs(delta) > 2) window.scrollBy({ top: delta, behavior: "instant" });
  };
  if ("onscrollend" in window) {
    window.addEventListener("scrollend", settle, { once: true });
  } else {
    setTimeout(settle, 700);
  }
}

function anchorOffset(): number {
  const padding = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
  return Number.isFinite(padding) ? padding : 0;
}
