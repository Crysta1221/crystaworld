import { handleCmsAuth, isCmsAuthPath } from "./cms-auth.ts";

type SiteEnv = {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  ALLOWED_DOMAINS?: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  GITHUB_HOSTNAME?: string;
  GITLAB_CLIENT_ID?: string;
  GITLAB_CLIENT_SECRET?: string;
  GITLAB_HOSTNAME?: string;
};

export default {
  async fetch(request: Request, env: SiteEnv): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (isCmsAuthPath(pathname)) return handleCmsAuth(request, env);
    return env.ASSETS.fetch(request);
  },
};
