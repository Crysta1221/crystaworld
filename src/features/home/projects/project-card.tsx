import { StarIcon } from "@phosphor-icons/react";

import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";

import type { Project } from "./catalog";
import { useGithubStars } from "./stars/use-github-stars";

type ProjectCardProps = {
  project: Project;
  className?: string;
};

function formatStarCount(count: number): string {
  return new Intl.NumberFormat("en", {
    notation: count >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(count);
}

/**
 * Interactive project card: title, description, tags, and optional GitHub stars.
 */
export function ProjectCard({ project, className }: ProjectCardProps) {
  const { stars, isLoading } = useGithubStars(project.isRepo ? project.url : null);
  const isExternal = project.url.startsWith("http");

  return (
    <a
      href={project.url}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={cn(
        "group flex h-full min-h-0 flex-col gap-3 rounded-2xl border border-border/80 bg-card/40 p-4 text-left transition-colors outline-none",
        "hover:border-border hover:bg-muted/40 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className,
      )}
    >
      <div className="flex h-6 items-center justify-between gap-3">
        <h3 className="min-w-0 truncate text-base text-foreground group-hover:text-primary">
          {project.title}
        </h3>
        {project.isRepo ? (
          <span
            className="inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2.5 text-xs font-medium leading-none text-foreground tabular-nums"
            aria-label={
              stars === null
                ? isLoading
                  ? "Loading star count"
                  : "Star count unavailable"
                : `${stars} stars`
            }
          >
            <StarIcon className="block size-3.5 shrink-0 text-primary" weight="fill" aria-hidden />
            <span className="leading-none">
              {isLoading ? "…" : stars === null ? "—" : formatStarCount(stars)}
            </span>
          </span>
        ) : null}
      </div>

      {/* Fixed 2-line slot so every card matches height across grid rows. */}
      <p className="h-[2lh] line-clamp-2 text-pretty text-sm leading-relaxed text-muted-foreground">
        {project.description}
      </p>

      {project.tags.length > 0 ? (
        <ul className="mt-auto flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <li key={tag}>
              <Badge variant="outline">#{tag.replace(/^#/, "")}</Badge>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-auto h-5" aria-hidden />
      )}
    </a>
  );
}
