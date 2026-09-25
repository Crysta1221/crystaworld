import { ArrowRightIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/shared/components/ui/button";

import { RECENT_PROJECTS } from "./catalog";
import { ProjectCard } from "./project-card";

/**
 * Home section listing recent work as interactive project cards.
 */
export function RecentProjects() {
  return (
    <section aria-labelledby="recent-projects-heading" className="mt-4 space-y-4 sm:mt-6">
      <div className="flex items-center justify-between gap-4">
        <h2
          id="recent-projects-heading"
          className="text-balance text-lg tracking-tight text-foreground sm:text-xl"
        >
          Recent Projects
        </h2>
        <Button
          variant="ghost"
          size="default"
          nativeButton={false}
          render={<Link to="/works" />}
        >
          すべて見る
          <ArrowRightIcon />
        </Button>
      </div>

      <ul className="grid list-none items-stretch gap-3 sm:grid-cols-2 sm:gap-4">
        {RECENT_PROJECTS.map((project) => (
          <li key={project.url} className="flex min-h-0">
            <ProjectCard project={project} className="w-full flex-1" />
          </li>
        ))}
      </ul>
    </section>
  );
}
