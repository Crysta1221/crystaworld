/**
 * GitHub/GitLab OAuth for Sveltia CMS, adapted from sveltia-cms-auth (MIT).
 * Routes stay on this site Worker: GET /auth and GET /callback.
 * @see https://github.com/sveltia/sveltia-cms-auth
 */

const supportedProviders = ["github", "gitlab"] as const;

type Provider = (typeof supportedProviders)[number];

type AuthEnv = {
  ALLOWED_DOMAINS?: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  GITHUB_HOSTNAME?: string;
  GITLAB_CLIENT_ID?: string;
  GITLAB_CLIENT_SECRET?: string;
  GITLAB_HOSTNAME?: string;
};

const providerScopes: Record<Provider, { default: string; separator: string; allowed: string[] }> = {
  github: {
    default: "repo,user",
    separator: ",",
    allowed: ["repo", "public_repo", "user", "read:user", "user:email"],
  },
  gitlab: {
    default: "api",
    separator: " ",
    allowed: ["api", "read_api", "read_user", "read_repository", "write_repository"],
  },
};

const isProvider = (value: string | undefined): value is Provider =>
  supportedProviders.some((provider) => provider === value);

const getScope = (provider: Provider, requested: string | undefined): string => {
  const { default: fallback, separator, allowed } = providerScopes[provider];
  const scopes = (requested ?? "").split(/[\s,]+/).filter(Boolean);
  if (!scopes.length) return fallback;
  if (scopes.every((scope) => allowed.includes(scope))) return scopes.join(separator);
  console.warn(
    `Ignoring the unsupported "${requested}" scope for ${provider}; requesting "${fallback}".`,
  );
  return fallback;
};

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getDomainPatterns = (allowedDomains: string | undefined): string[] =>
  (allowedDomains ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => `^${escapeRegExp(item).replaceAll("\\*", ".+")}$`);

const serialize = (value: string | boolean | string[]): string =>
  JSON.stringify(value).replaceAll("<", "\\u003c");

const outputHTML = ({
  provider = "unknown",
  token,
  error,
  errorCode,
  env,
}: {
  provider?: string;
  token?: string;
  error?: string;
  errorCode?: string;
  env: AuthEnv;
}): Response => {
  const state = error ? "error" : "success";
  const content = error ? { provider, error, errorCode } : { provider, token };
  const handshake = serialize(`authorizing:${provider}`);
  const result = serialize(`authorization:${provider}:${state}:${JSON.stringify(content)}`);
  const script = `
(() => {
  const trustedPatterns = ${serialize(getDomainPatterns(env.ALLOWED_DOMAINS))};
  const hasToken = ${serialize(Boolean(token))};
  const handshake = ${handshake};
  const result = ${result};
  const isTrusted = (origin) => {
    try {
      const { hostname } = new URL(origin);
      return trustedPatterns.some((pattern) => new RegExp(pattern).test(hostname));
    } catch {
      return false;
    }
  };
  window.addEventListener("message", ({ data, origin }) => {
    if (data !== handshake) return;
    if (hasToken && trustedPatterns.length && !isTrusted(origin)) return;
    window.opener?.postMessage(result, origin);
  });
  window.opener?.postMessage(handshake, "*");
})();
`;

  return new Response(`<!doctype html><meta charset="utf-8"><script>${script}</script>`, {
    headers: {
      "Content-Type": "text/html;charset=UTF-8",
      "Set-Cookie": "csrf-token=deleted; HttpOnly; Max-Age=0; Path=/; SameSite=Lax; Secure",
    },
  });
};

const handleAuth = (request: Request, env: AuthEnv): Response => {
  const { origin, searchParams } = new URL(request.url);
  const providerParam = searchParams.get("provider") ?? undefined;
  const domain = searchParams.get("site_id") ?? undefined;
  const requestedScope = searchParams.get("scope") ?? undefined;

  if (!isProvider(providerParam)) {
    return outputHTML({
      env,
      error: "Your Git backend is not supported by the authenticator.",
      errorCode: "UNSUPPORTED_BACKEND",
    });
  }

  const provider = providerParam;
  const scope = getScope(provider, requestedScope);
  const domainPatterns = getDomainPatterns(env.ALLOWED_DOMAINS);

  if (
    domainPatterns.length > 0 &&
    !domainPatterns.some((pattern) => new RegExp(pattern).test(domain ?? ""))
  ) {
    return outputHTML({
      env,
      provider,
      error: "Your domain is not allowed to use the authenticator.",
      errorCode: "UNSUPPORTED_DOMAIN",
    });
  }

  const csrfToken = crypto.randomUUID().replaceAll("-", "");
  const githubHost = env.GITHUB_HOSTNAME ?? "github.com";
  const gitlabHost = env.GITLAB_HOSTNAME ?? "gitlab.com";

  if (provider === "github") {
    if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
      return outputHTML({
        env,
        provider,
        error: "OAuth app client ID or secret is not configured.",
        errorCode: "MISCONFIGURED_CLIENT",
      });
    }
    const params = new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID,
      scope,
      state: csrfToken,
    });
    return redirect(`https://${githubHost}/login/oauth/authorize?${params.toString()}`, provider, csrfToken);
  }

  if (!env.GITLAB_CLIENT_ID || !env.GITLAB_CLIENT_SECRET) {
    return outputHTML({
      env,
      provider,
      error: "OAuth app client ID or secret is not configured.",
      errorCode: "MISCONFIGURED_CLIENT",
    });
  }

  const params = new URLSearchParams({
    client_id: env.GITLAB_CLIENT_ID,
    redirect_uri: `${origin}/callback`,
    response_type: "code",
    scope,
    state: csrfToken,
  });
  return redirect(`https://${gitlabHost}/oauth/authorize?${params.toString()}`, provider, csrfToken);
};

const redirect = (location: string, provider: Provider, csrfToken: string): Response =>
  new Response("", {
    status: 302,
    headers: {
      Location: location,
      "Set-Cookie": `csrf-token=${provider}_${csrfToken}; HttpOnly; Path=/; Max-Age=600; SameSite=Lax; Secure`,
    },
  });

const handleCallback = async (request: Request, env: AuthEnv): Promise<Response> => {
  const { origin, searchParams } = new URL(request.url);
  const code = searchParams.get("code") ?? "";
  const state = searchParams.get("state") ?? "";
  const cookie = request.headers.get("Cookie") ?? "";
  const match = /\bcsrf-token=([a-z-]+?)_([0-9a-f]{32})\b/.exec(cookie);
  const providerParam = match?.[1];
  const csrfToken = match?.[2];

  if (!isProvider(providerParam)) {
    return outputHTML({
      env,
      error: "Your Git backend is not supported by the authenticator.",
      errorCode: "UNSUPPORTED_BACKEND",
    });
  }

  const provider = providerParam;

  if (!code || !state) {
    return outputHTML({
      env,
      provider,
      error: "Failed to receive an authorization code. Please try again later.",
      errorCode: "AUTH_CODE_REQUEST_FAILED",
    });
  }

  if (!csrfToken || state !== csrfToken) {
    return outputHTML({
      env,
      provider,
      error: "Potential CSRF attack detected. Authentication flow aborted.",
      errorCode: "CSRF_DETECTED",
    });
  }

  const githubHost = env.GITHUB_HOSTNAME ?? "github.com";
  const gitlabHost = env.GITLAB_HOSTNAME ?? "gitlab.com";
  let tokenURL = "";
  let requestBody: Record<string, string> = {};

  if (provider === "github") {
    if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
      return outputHTML({
        env,
        provider,
        error: "OAuth app client ID or secret is not configured.",
        errorCode: "MISCONFIGURED_CLIENT",
      });
    }
    tokenURL = `https://${githubHost}/login/oauth/access_token`;
    requestBody = {
      code,
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
    };
  } else {
    if (!env.GITLAB_CLIENT_ID || !env.GITLAB_CLIENT_SECRET) {
      return outputHTML({
        env,
        provider,
        error: "OAuth app client ID or secret is not configured.",
        errorCode: "MISCONFIGURED_CLIENT",
      });
    }
    tokenURL = `https://${gitlabHost}/oauth/token`;
    requestBody = {
      code,
      client_id: env.GITLAB_CLIENT_ID,
      client_secret: env.GITLAB_CLIENT_SECRET,
      grant_type: "authorization_code",
      redirect_uri: `${origin}/callback`,
    };
  }

  let response: Response;
  try {
    response = await fetch(tokenURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
  } catch {
    return outputHTML({
      env,
      provider,
      error: "Failed to request an access token. Please try again later.",
      errorCode: "TOKEN_REQUEST_FAILED",
    });
  }

  let token = "";
  let error = "";
  try {
    const payload = (await response.json()) as { access_token?: string; error?: string };
    token = payload.access_token ?? "";
    error = payload.error ?? "";
  } catch {
    return outputHTML({
      env,
      provider,
      error: "Server responded with malformed data. Please try again later.",
      errorCode: "MALFORMED_RESPONSE",
    });
  }

  return outputHTML({
    env,
    provider,
    token: token || undefined,
    error: error || undefined,
  });
};

export const isCmsAuthPath = (pathname: string): boolean =>
  pathname === "/auth" ||
  pathname === "/callback" ||
  pathname === "/oauth/authorize" ||
  pathname === "/oauth/redirect";

export const handleCmsAuth = (request: Request, env: AuthEnv): Promise<Response> | Response => {
  const { pathname } = new URL(request.url);
  if (request.method !== "GET") return new Response("", { status: 404 });
  if (pathname === "/auth" || pathname === "/oauth/authorize") return handleAuth(request, env);
  if (pathname === "/callback" || pathname === "/oauth/redirect") return handleCallback(request, env);
  return new Response("", { status: 404 });
};
