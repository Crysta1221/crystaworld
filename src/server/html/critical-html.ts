const ASSET_PRELOAD =
  /<link\b(?=[^>]*\brel=(?:"modulepreload"|'modulepreload'))(?=[^>]*\bhref=(?:"\/assets\/[^"]+"|'\/assets\/[^']+'))[^>]*>/gi;

const ASSET_MODULE =
  /<script\b(?=[^>]*\btype=(?:"module"|'module'))(?=[^>]*\bsrc=(?:"(\/assets\/[^"]+)"|'(\/assets\/[^']+)'))[^>]*><\/script>/gi;

/**
 * Starts the entry module once the first contentful paint is recorded and the page has loaded.
 * requestAnimationFrame alone fired before Chrome presented the first frame, so hydration
 * still delayed the first paint. Browsers without paint timing fall back to the load event.
 */
function deferredModule(src: string): string {
  const url = JSON.stringify(src);
  return `<script>(function(){var started=false;function start(){if(started)return;started=true;var s=document.createElement("script");s.type="module";s.src=${url};document.body.appendChild(s);}function afterLoad(){if(document.readyState==="complete")setTimeout(start,0);else addEventListener("load",function(){setTimeout(start,0);},{once:true});}try{var seen=performance.getEntriesByName("first-contentful-paint").length>0;if(seen){afterLoad();return;}var observer=new PerformanceObserver(function(list){if(list.getEntriesByName("first-contentful-paint").length===0)return;observer.disconnect();afterLoad();});observer.observe({type:"paint",buffered:true});setTimeout(start,4000);}catch(e){afterLoad();}})();</script>`;
}

function deferEntryModule(html: string): string {
  return html
    .replace(ASSET_PRELOAD, "")
    .replace(ASSET_MODULE, (_full, doubleQuoted: string, singleQuoted: string) =>
      deferredModule(doubleQuoted || singleQuoted),
    );
}

function preloadLcpImage(html: string): string {
  const img = /<img\b[^>]*\bfetchpriority="high"[^>]*>/i.exec(html);
  if (!img) return html;
  const source = /\bsrc="([^"]+)"/.exec(img[0])?.[1];
  if (!source || source.startsWith("data:")) return html;
  const srcSet = /\bsrcset="([^"]+)"/i.exec(img[0])?.[1];
  // Preload only the mobile candidate. imagesrcset also fetched the full file.
  const href = srcSet?.split(",")[0]?.trim().split(/\s+/)[0] || source;
  if (html.includes(`href="${href}"`)) return html;
  const link = `<link rel="preload" as="image" href="${href}" fetchpriority="high"/>`;
  if (html.includes("</style>")) return html.replace("</style>", `</style>${link}`);
  return html.replace("</head>", `${link}</head>`);
}

/**
 * Drops JavaScript preloads that compete with the document and fonts.
 * The entry module starts two frames later so the first paint is already recorded.
 * The high-priority image starts once the stylesheet bytes are already in the document.
 */
export function optimizeCriticalHtml(html: string): string {
  return preloadLcpImage(deferEntryModule(html));
}

/**
 * Applies {@link optimizeCriticalHtml} to HTML documents. Prerendering runs through the
 * Worker too, so the static pages in `dist/client` already carry the same markup.
 */
export async function withCriticalHtml(response: Response): Promise<Response> {
  const type = response.headers.get("content-type") ?? "";
  if (!type.includes("text/html")) return response;
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  headers.delete("content-encoding");
  return new Response(optimizeCriticalHtml(await response.text()), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
