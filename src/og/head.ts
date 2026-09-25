export type OgEntry = {
  title: string;
  description: string;
  image: string;
  type: "website" | "article";
};

export type OgManifest = {
  site: OgEntry;
  /** Keyed by pathname, such as `/blogs/welcome`. */
  articles: Record<string, OgEntry>;
};

const START = "<!-- og -->";
const END = "<!-- /og -->";

/**
 * Blog and memo posts get their own card. Every other document uses the site card.
 */
export function resolveOgEntry(manifest: OgManifest, pathname: string): OgEntry {
  const trimmed = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  return manifest.articles[safeDecode(trimmed)] ?? manifest.site;
}

export function applyOg(html: string, entry: OgEntry, pageUrl: string): string {
  const block = renderOgBlock(entry, pageUrl);
  if (html.includes(START) && html.includes(END)) {
    return html.replace(new RegExp(`${START}[\\s\\S]*?${END}`), block);
  }
  return html.replace("</head>", `    ${block}\n  </head>`);
}

function renderOgBlock(entry: OgEntry, pageUrl: string): string {
  const imageUrl = new URL(entry.image, pageUrl).href;
  const title = entry.type === "article" ? `${entry.title} | Crystaworld` : entry.title;
  const lines = [
    START,
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(entry.description)}" />`,
    `<meta property="og:site_name" content="Crystaworld" />`,
    `<meta property="og:title" content="${escapeHtml(entry.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(entry.description)}" />`,
    `<meta property="og:type" content="${entry.type}" />`,
    `<meta property="og:url" content="${escapeHtml(pageUrl)}" />`,
    `<meta property="og:image" content="${escapeHtml(imageUrl)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:locale" content="ja_JP" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    END,
  ];
  return lines.join("\n    ");
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
