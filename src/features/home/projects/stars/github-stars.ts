export type GithubRepoRef = {
  owner: string;
  repo: string;
};

type StarsCacheEntry =
  | { status: "pending"; promise: Promise<number | null> }
  | { status: "resolved"; stars: number | null };

const starsCache = new Map<string, StarsCacheEntry>();

/**
 * Parse owner/repo from a github.com repository URL.
 * Returns null for non-repo links (website, gist, etc.).
 */
export function parseGithubRepoUrl(url: string): GithubRepoRef | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "github.com" && parsed.hostname !== "www.github.com") {
      return null;
    }

    const segments = parsed.pathname.split("/").filter(Boolean);
    if (segments.length < 2) return null;

    const [owner, repoSegment] = segments;
    if (!owner || !repoSegment) return null;

    const repo = repoSegment.replace(/\.git$/i, "");
    if (!owner || !repo) return null;

    return { owner, repo };
  } catch {
    return null;
  }
}

function cacheKey(owner: string, repo: string): string {
  return `${owner}/${repo}`.toLowerCase();
}

async function requestStargazersCount(owner: string, repo: string): Promise<number | null> {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Accept: "application/vnd.github+json",
      },
    });

    if (!response.ok) return null;

    const data: unknown = await response.json();
    if (
      typeof data === "object" &&
      data !== null &&
      "stargazers_count" in data &&
      typeof data.stargazers_count === "number"
    ) {
      return data.stargazers_count;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Fetch stargazers_count for a GitHub repo.
 * Deduplicates in-flight and completed requests for SPA navigations.
 */
export function fetchGithubStars(owner: string, repo: string): Promise<number | null> {
  const key = cacheKey(owner, repo);
  const cached = starsCache.get(key);

  if (cached?.status === "resolved") {
    return Promise.resolve(cached.stars);
  }
  if (cached?.status === "pending") {
    return cached.promise;
  }

  const promise = requestStargazersCount(owner, repo).then((stars) => {
    starsCache.set(key, { status: "resolved", stars });
    return stars;
  });

  starsCache.set(key, { status: "pending", promise });
  return promise;
}

/**
 * Kick off star fetches for repo projects (fire-and-forget friendly for route loaders).
 */
export function prefetchGithubStarsForUrls(urls: readonly string[]): void {
  for (const url of urls) {
    const ref = parseGithubRepoUrl(url);
    if (!ref) continue;
    void fetchGithubStars(ref.owner, ref.repo);
  }
}

export function getCachedGithubStars(owner: string, repo: string): number | null | undefined {
  const cached = starsCache.get(cacheKey(owner, repo));
  if (!cached) return undefined;
  if (cached.status === "resolved") return cached.stars;
  return undefined;
}
