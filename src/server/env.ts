/** The part of the Workers execution context the site Worker uses. */
export type SiteContext = {
  waitUntil: (promise: Promise<unknown>) => void;
};

/** Bindings and secrets available to the site Worker. */
export type SiteEnv = {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  ALLOWED_DOMAINS?: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  GITHUB_HOSTNAME?: string;
  GITLAB_CLIENT_ID?: string;
  GITLAB_CLIENT_SECRET?: string;
  GITLAB_HOSTNAME?: string;
};
