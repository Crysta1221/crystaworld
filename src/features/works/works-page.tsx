import { PageHero } from "@/shared/components/page-hero";

import type { Work } from "./catalog";
import { WorkCard } from "./work-card";

/**
 * Works index. Cards are image-led; each detail page is still to come.
 */
export function WorksPage({ works }: { works: readonly Work[] }) {
  return (
    <div>
      <div className="slide-enter">
        <PageHero pattern="diamond" title="WORKS" />
      </div>
      <div className="py-6 sm:py-8">
        <ul
          className="slide-enter-content grid list-none items-stretch gap-3 sm:grid-cols-2 lg:grid-cols-3"
          style={{ "--start": "60ms" } as React.CSSProperties}
        >
          {works.map((work, index) => (
            <li key={work.id} className={index === 0 ? "min-w-0" : "skip-offscreen min-w-0"}>
              <WorkCard work={work} priority={index === 0} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
