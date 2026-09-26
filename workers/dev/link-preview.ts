import { linkPreviewResponse } from "../link-preview/response.ts";

type ConnectReq = { url?: string };
type ConnectRes = {
  statusCode: number;
  setHeader: (name: string, value: string) => void;
  end: (body?: string) => void;
};

/**
 * Serves /api/link-preview during `vp dev` and `vp preview`.
 * Production uses the same handler on the site Worker.
 */
export function linkPreviewMiddleware(): (req: ConnectReq, res: ConnectRes, next: () => void) => void {
  return (req, res, next) => {
    const raw = req.url ?? "";
    const path = raw.split("?")[0];
    if (path !== "/api/link-preview") {
      next();
      return;
    }

    void linkPreviewResponse(new Request(new URL(raw, "http://localhost"))).then(async (response) => {
      res.statusCode = response.status;
      response.headers.forEach((value, name) => {
        res.setHeader(name, value);
      });
      res.end(await response.text());
    });
  };
}
