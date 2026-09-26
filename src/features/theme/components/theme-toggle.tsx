import { useRef } from "react";
import type GSAP from "gsap";

import { MoonIcon, SunIcon } from "@phosphor-icons/react";

import { resolveTheme } from "../lib/theme";
import { useTheme } from "./theme-provider";
import { cn } from "@/shared/lib/utils";

let gsapLoader: Promise<typeof GSAP> | undefined;

/** Load GSAP on first intent so the home page does not pay for it up front. */
function loadGsap(): Promise<typeof GSAP> {
  gsapLoader ??= Promise.all([import("gsap"), import("gsap/MotionPathPlugin")]).then(
    ([{ default: gsap }, { MotionPathPlugin }]) => {
      gsap.registerPlugin(MotionPathPlugin);
      return gsap;
    },
  );
  return gsapLoader;
}

/**
 * Left→right sky arc (CSS y grows downward), kept inside the circular button.
 * Zenith is the button center; sides sit slightly lower.
 */
const ORBIT_X = 10;
const ORBIT_DIP = 4;
const ORBIT_DURATION = 0.6;

type IconPose = {
  x: number;
  y: number;
  opacity: number;
  scale: number;
  rotation: number;
  visibility: "visible" | "hidden";
};

function restingPose(active: boolean): IconPose {
  return {
    x: 0,
    y: 0,
    opacity: active ? 1 : 0,
    scale: active ? 1 : 0.85,
    rotation: 0,
    visibility: active ? "visible" : "hidden",
  };
}

interface ThemeToggleProps {
  className?: string;
}

/**
 * Theme toggle with a left-to-right celestial arc:
 * the next icon rises from the left while the current one sets to the right.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const rootRef = useRef<HTMLButtonElement>(null);
  const sunRef = useRef<HTMLSpanElement>(null);
  const moonRef = useRef<HTMLSpanElement>(null);
  const animatingRef = useRef(false);

  const isDark = typeof window === "undefined" ? false : resolveTheme(theme) === "dark";

  const toggle = () => {
    if (animatingRef.current) return;
    const sun = sunRef.current;
    const moon = moonRef.current;
    if (!sun || !moon) return;

    animatingRef.current = true;
    const nextDark = !isDark;
    void loadGsap()
      .then((gsap) => {
        const nextTheme = nextDark ? "dark" : "light";
        const outgoing = isDark ? moon : sun;
        const incoming = isDark ? sun : moon;

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          gsap.set(outgoing, restingPose(false));
          gsap.set(incoming, restingPose(true));
          animatingRef.current = false;
          setTheme(nextTheme);
          return;
        }

        animatingRef.current = true;

        // Start just left of center, slightly below — then travel rightward up to zenith.
        gsap.set(incoming, {
          x: -ORBIT_X,
          y: ORBIT_DIP,
          opacity: 0,
          scale: 0.85,
          rotation: -20,
          visibility: "visible",
        });
        gsap.set(outgoing, { rotation: 0 });

        const timeline = gsap.timeline({
          defaults: { duration: ORBIT_DURATION, ease: "power2.inOut" },
          onComplete: () => {
            gsap.set(outgoing, restingPose(false));
            gsap.set(incoming, restingPose(true));
            animatingRef.current = false;
          },
        });

        // Shift page theme mid-arc so sky and body change together.
        timeline.call(() => setTheme(nextTheme), undefined, ORBIT_DURATION * 0.4);

        // Current body sets toward the right along the same sky arc.
        timeline.to(
          outgoing,
          {
            motionPath: {
              path: [
                { x: 0, y: 0 },
                { x: ORBIT_X * 0.5, y: ORBIT_DIP * 0.35 },
                { x: ORBIT_X, y: ORBIT_DIP },
              ],
              curviness: 1.1,
            },
            opacity: 0,
            scale: 0.85,
            rotation: 20,
          },
          0,
        );

        // Next body rises from the left into center (zenith).
        timeline.to(
          incoming,
          {
            motionPath: {
              path: [
                { x: -ORBIT_X, y: ORBIT_DIP },
                { x: -ORBIT_X * 0.5, y: ORBIT_DIP * 0.35 },
                { x: 0, y: 0 },
              ],
              curviness: 1.1,
            },
            opacity: 1,
            scale: 1,
            rotation: 0,
          },
          0,
        );
      })
      .catch(() => {
        animatingRef.current = false;
      });
  };

  return (
    <button
      ref={rootRef}
      type="button"
      onClick={toggle}
      onPointerEnter={() => void loadGsap()}
      onFocus={() => void loadGsap()}
      aria-label="Toggle theme"
      aria-pressed={isDark}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "relative inline-flex size-9 cursor-pointer items-center justify-center overflow-hidden rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring select-none",
        className,
      )}
    >
      <span
        ref={sunRef}
        className="pointer-events-none absolute inset-0 flex items-center justify-center dark:invisible dark:opacity-0"
        aria-hidden
      >
        <SunIcon className="size-[1.15rem]" />
      </span>
      <span
        ref={moonRef}
        className="pointer-events-none invisible absolute inset-0 flex items-center justify-center opacity-0 dark:visible dark:opacity-100"
        aria-hidden
      >
        <MoonIcon className="size-[1.15rem]" />
      </span>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
