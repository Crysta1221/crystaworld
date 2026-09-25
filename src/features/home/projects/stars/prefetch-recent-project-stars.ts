import { RECENT_PROJECTS } from "../catalog";
import { prefetchGithubStarsForUrls } from "./github-stars";

/**
 * Warm the GitHub stars cache from a TanStack Router loader (SPA-safe).
 */
export function prefetchRecentProjectStars(): void {
  const repoUrls = RECENT_PROJECTS.filter((project) => project.isRepo).map(
    (project) => project.url,
  );
  prefetchGithubStarsForUrls(repoUrls);
}
