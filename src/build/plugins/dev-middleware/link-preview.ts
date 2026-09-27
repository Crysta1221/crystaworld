import type { Connect } from "vite";

import { linkPreviewResponse } from "../../../server/link-preview/response.ts";

/**
 * Serves /api/link-preview during `vp dev` and `vp preview`.
 * Production uses the same handler on the site Worker.
 */
export function linkPreviewMiddleware(): Connect.NextHandleFunction {
  return (req, res, next) => {
    const raw = req.url ?? "";
    if (raw.split("?")[0] !== "/api/link-preview") {
      next();
      return;
    }

    void linkPreviewResponse(new Request(new URL(raw, "http://localhost")))
      .then(async (response) => {
        res.statusCode = response.status;
        response.headers.forEach((value, name) => {
          res.setHeader(name, value);
        });
        res.end(await response.text());
      })
      .catch(next);
  };
}
