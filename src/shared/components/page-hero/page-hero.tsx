import { useId } from "react";

import { AppContainer } from "@/shared/components/layout";
import { cn } from "@/shared/lib/utils";

import { HERO_HEIGHT, HERO_HEIGHT_COMPACT } from "./frame";
import { BlueprintGrid, DiamondField, HoneycombMatrix } from "./patterns/patterns";

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
 * Phone and desktop bands are both in the HTML, so the height does not jump after hydration.
 */
export function PageHero({ pattern, title, className }: PageHeroProps) {
  const titleId = useId();
  const Pattern = PATTERNS[pattern];

  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        "relative -mt-20 ml-[calc(50%-50dvw)] h-60 w-dvw overflow-hidden bg-background md:h-80",
        className,
      )}
    >
      <div className="md:hidden">
        <Pattern height={HERO_HEIGHT_COMPACT} />
      </div>
      <div className="hidden md:block">
        <Pattern height={HERO_HEIGHT} />
      </div>
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
