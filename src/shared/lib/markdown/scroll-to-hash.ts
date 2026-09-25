export function scrollToDocumentHash(hash: string | undefined): void {
  if (!hash) return;

  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!raw) return;

  let id = raw;
  try {
    id = decodeURIComponent(raw);
  } catch {
    id = raw;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const target = document.getElementById(id) ?? document.getElementById(raw);
  if (!target) return;

  const parsedPadding = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
  const headerOffset = Number.isFinite(parsedPadding) && parsedPadding > 0 ? parsedPadding : 88;
  const top = window.scrollY + target.getBoundingClientRect().top - headerOffset;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: reducedMotion ? "auto" : "smooth",
  });
}
