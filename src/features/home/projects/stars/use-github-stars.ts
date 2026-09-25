import { useEffect, useState } from "react";

import {
  fetchGithubStars,
  getCachedGithubStars,
  parseGithubRepoUrl,
} from "./github-stars";

type GithubStarsState = {
  stars: number | null;
  isLoading: boolean;
};

/**
 * Load GitHub star count for a repository URL.
 * Safe for TanStack Router SPAs: uses a shared cache that route loaders can warm.
 */
export function useGithubStars(repoUrl: string | null | undefined): GithubStarsState {
  const ref = repoUrl ? parseGithubRepoUrl(repoUrl) : null;
  const owner = ref?.owner ?? null;
  const repo = ref?.repo ?? null;
  const cached =
    owner && repo ? getCachedGithubStars(owner, repo) : undefined;

  const [stars, setStars] = useState<number | null>(cached ?? null);
  const [isLoading, setIsLoading] = useState(Boolean(owner && repo && cached === undefined));

  useEffect(() => {
    if (!owner || !repo) {
      setStars(null);
      setIsLoading(false);
      return;
    }

    const existing = getCachedGithubStars(owner, repo);
    if (existing !== undefined) {
      setStars(existing);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    void fetchGithubStars(owner, repo).then((count) => {
      if (cancelled) return;
      setStars(count);
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [owner, repo]);

  if (!owner || !repo) {
    return { stars: null, isLoading: false };
  }

  return { stars, isLoading };
}
