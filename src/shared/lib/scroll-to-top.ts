/**
 * Jumps to the top of the window without the smooth-scroll animation on `html`.
 * Page transitions should start at the top, then play their own entrance motion.
 */
export function scrollWindowToTop(): void {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}
