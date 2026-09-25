import { useSyncExternalStore } from "react";

import { HERO_COMPACT_QUERY, HERO_HEIGHT, HERO_HEIGHT_COMPACT } from "./frame";

function subscribe(onStoreChange: () => void) {
  const media = window.matchMedia(HERO_COMPACT_QUERY);
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function isCompact() {
  return window.matchMedia(HERO_COMPACT_QUERY).matches;
}

/** Band height for the current viewport. Phone widths use the shorter band. */
export function useHeroHeight() {
  const compact = useSyncExternalStore(subscribe, isCompact, () => false);
  return compact ? HERO_HEIGHT_COMPACT : HERO_HEIGHT;
}
