import { handleCmsAuth, isCmsAuthPath } from "./cms-auth.ts";
import { withOgTags } from "./og.ts";

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
    const url = new URL(request.url);
    if (isCmsAuthPath(url.pathname)) return handleCmsAuth(request, env);
    if (url.pathname === "/admin" || url.pathname === "/admin/") {
      url.pathname = "/admin/index.html";
      return env.ASSETS.fetch(new Request(url, request));
    }
    return withOgTags(request, env.ASSETS, await env.ASSETS.fetch(request));
  },
};
