import type { Connect } from "vite";

/**
 * Serve the static CMS page for /admin as well as /admin/index.html.
 * The app router would otherwise answer the directory URL.
 */
export function cmsAdminMiddleware(): Connect.NextHandleFunction {
  return (req, _res, next) => {
    const raw = req.url ?? "";
    const queryIndex = raw.indexOf("?");
    const path = queryIndex === -1 ? raw : raw.slice(0, queryIndex);
    const query = queryIndex === -1 ? "" : raw.slice(queryIndex);
    if (path === "/admin" || path === "/admin/") {
      req.url = `/admin/index.html${query}`;
    }
    next();
  };
}
