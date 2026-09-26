/**
 * Serve the static CMS page for /admin as well as /admin/index.html.
 * The SPA fallback would otherwise return the site shell for the directory URL.
 */
export function cmsAdminMiddleware(): (
  req: { url?: string },
  res: unknown,
  next: () => void,
) => void {
  return (req, _res, next) => {
    if (!req.url) {
      next();
      return;
    }

    const queryIndex = req.url.indexOf("?");
    const path = queryIndex === -1 ? req.url : req.url.slice(0, queryIndex);
    const query = queryIndex === -1 ? "" : req.url.slice(queryIndex);
    if (path === "/admin" || path === "/admin/") {
      req.url = `/admin/index.html${query}`;
    }
    next();
  };
}
