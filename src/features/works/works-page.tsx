import { PageHero } from "@/shared/components/page-hero";

import { WORKS } from "./catalog";
import { WorkCard } from "./work-card";

/**
 * Works index. Cards are image-led; each detail page is still to come.
 */
export function WorksPage() {
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
          {WORKS.map((work, index) => (
            <li key={work.id} className="min-w-0">
              <WorkCard work={work} priority={index === 0} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
