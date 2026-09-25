import { useId } from "react";

import { AppContainer } from "@/shared/components/layout";
import { cn } from "@/shared/lib/utils";

import { BlueprintGrid, DiamondField, HoneycombMatrix } from "./patterns/patterns";
import { useHeroHeight } from "./use-hero-height";

export type PageHeroPattern = "diamond" | "blueprint" | "honeycomb";

const PATTERNS = {
  diamond: DiamondField,
  blueprint: BlueprintGrid,
  honeycomb: HoneycombMatrix,
} as const;

type PageHeroProps = {
  pattern: PageHeroPattern;
  title: string;
  className?: string;
};

/**
 * Full-bleed page header for every route except Home.
 * Pulls up under the fixed site header. The title is not transformed.
 */
export function PageHero({ pattern, title, className }: PageHeroProps) {
  const titleId = useId();
  const Pattern = PATTERNS[pattern];
  const height = useHeroHeight();

  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        "relative -mt-20 ml-[calc(50%-50dvw)] w-dvw overflow-hidden bg-background",
        className,
      )}
      style={{ height }}
    >
      <Pattern height={height} />
      <div className="relative flex h-full items-end">
        <AppContainer className="pb-7">
          <h1
            id={titleId}
            className="m-0 font-heading text-[clamp(3.25rem,7vw,5.5rem)] leading-none font-bold tracking-[2px] whitespace-nowrap text-foreground"
          >
            {title}
          </h1>
        </AppContainer>
      </div>
    </section>
  );
}
