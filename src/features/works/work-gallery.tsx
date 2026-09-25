import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

/**
 * Steps through a work's screenshots. Each picture fills the frame, and the track slides between them.
 */
export function WorkGallery({ images }: { images: readonly string[] }) {
  const [index, setIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const count = images.length;

  useGSAP(
    () => {
      const track = trackRef.current;
      const root = rootRef.current;
      if (!track || !root || count === 0) return;

      const place = (animate: boolean) => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        gsap.to(track, {
          x: -index * root.clientWidth,
          duration: animate && !reduce ? 0.65 : 0,
          ease: "power3.out",
          overwrite: "auto",
        });
      };

      place(true);
      const onResize = () => place(false);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    },
    { dependencies: [index, count], scope: rootRef },
  );

  if (count === 0) return null;

  const go = (next: number) => {
    setIndex((next + count) % count);
  };

  return (
    <div className="min-w-0">
      <div ref={rootRef} className="relative overflow-hidden rounded-2xl border border-border/80 bg-muted">
        <div ref={trackRef} className="flex w-full">
          {images.map((src) => (
            <div key={src} className="w-full min-w-0 shrink-0">
              <img src={src} alt="" className="block h-auto w-full" />
            </div>
          ))}
        </div>
        {count > 1 ? (
          <>
            <button
              type="button"
              className="absolute top-1/2 left-3 inline-flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-background/85 text-foreground outline-none hover:bg-background focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="前の画像"
              onClick={() => go(index - 1)}
            >
              <CaretLeftIcon className="size-4" />
            </button>
            <button
              type="button"
              className="absolute top-1/2 right-3 inline-flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-background/85 text-foreground outline-none hover:bg-background focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="次の画像"
              onClick={() => go(index + 1)}
            >
              <CaretRightIcon className="size-4" />
            </button>
          </>
        ) : null}
      </div>
      {count > 1 ? (
        <div className="mt-3 flex items-center justify-center gap-1.5" role="tablist" aria-label="画像">
          {images.map((src, dotIndex) => {
            const selected = dotIndex === index;
            return (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-label={`${dotIndex + 1} / ${count}`}
                className={
                  selected
                    ? "h-1.5 w-5 cursor-pointer rounded-full bg-primary transition-[width,background-color] duration-300"
                    : "size-1.5 cursor-pointer rounded-full bg-muted-foreground/40 transition-[width,background-color] duration-300"
                }
                onClick={() => go(dotIndex)}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
