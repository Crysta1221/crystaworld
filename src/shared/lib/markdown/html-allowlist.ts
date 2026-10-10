/**
 * HTML that Markdown articles may contain. The tag list follows what GitHub renders;
 * scripts, embeds, forms, headings, and `class` attributes are left out. `style` keeps only the
 * text-decoration properties below.
 */
export const VOID_TAGS = new Set(["br", "hr", "img", "wbr"]);

export const ALLOWED_TAGS = new Set([
  // Inline text
  "a", "abbr", "b", "bdo", "br", "cite", "code", "del", "dfn", "em", "i", "ins", "kbd", "mark",
  "q", "rp", "rt", "ruby", "s", "samp", "small", "span", "strike", "strong", "sub", "sup",
  "time", "u", "var", "wbr",
  // Blocks
  "blockquote", "details", "div", "dl", "dt", "dd", "figcaption", "figure", "hr", "img", "li",
  "ol", "p", "summary", "ul",
  // Tables
  "caption", "table", "tbody", "td", "tfoot", "th", "thead", "tr",
]);

const GLOBAL_ATTRIBUTES = ["title", "lang", "dir", "style"];

const TAG_ATTRIBUTES: Record<string, string[]> = {
  a: ["href"],
  img: ["src", "alt", "width", "height", "align"],
  details: ["open"],
  ol: ["start"],
  time: ["datetime"],
  td: ["align", "colspan", "rowspan"],
  th: ["align", "colspan", "rowspan"],
  div: ["align"],
  p: ["align"],
};

/** HTML attribute names that differ from their hast property names. */
const PROPERTY_NAMES: Record<string, string> = { colspan: "colSpan", rowspan: "rowSpan", datetime: "dateTime" };

/** CSS properties `style` may set. Layout and anything that loads a file (`background`) stay out. */
const STYLE_PROPERTIES = new Set([
  "color", "background-color", "font-size", "font-weight", "font-style", "line-height", "letter-spacing",
  "text-align", "text-decoration", "text-decoration-line", "text-decoration-color",
  "text-decoration-style", "text-decoration-thickness", "text-underline-offset",
]);
/** Words, numbers, and the punctuation of colors and lengths; `var(--token)` works too. */
const STYLE_VALUE = /^[\w\s#%.,()+-]+$/;
const STYLE_FORBIDDEN = /url\(|expression|image|attr\(/i;

function cleanStyle(source: string): string {
  const declarations: string[] = [];
  for (const declaration of source.split(";")) {
    const colon = declaration.indexOf(":");
    if (colon < 0) continue;
    const property = declaration.slice(0, colon).trim().toLowerCase();
    const value = declaration.slice(colon + 1).trim();
    if (!STYLE_PROPERTIES.has(property) || !STYLE_VALUE.test(value) || STYLE_FORBIDDEN.test(value)) continue;
    declarations.push(`${property}: ${value}`);
  }
  return declarations.join("; ");
}

const LINK_SCHEMES = new Set(["http", "https", "mailto", "tel"]);
const IMAGE_SCHEMES = new Set(["http", "https"]);

/** Relative URLs pass; anything with a scheme must be on the list for its attribute. */
function isSafeUrl(value: string, schemes: Set<string>): boolean {
  // Browsers ignore whitespace and control characters inside a scheme, such as "java\tscript:".
  const compact = value.split("").filter((char) => char.charCodeAt(0) > 32).join("");
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(compact)?.[1];
  return !scheme || schemes.has(scheme.toLowerCase());
}

/** Keeps only the attributes allowed for the tag, under their hast property names. */
export function cleanAttributes(tag: string, raw: Record<string, string | true>) {
  const allowed = new Set([...GLOBAL_ATTRIBUTES, ...(TAG_ATTRIBUTES[tag] ?? [])]);
  const clean: Record<string, string | boolean> = {};
  for (const [name, value] of Object.entries(raw)) {
    if (!allowed.has(name)) continue;
    if (name === "open") {
      clean.open = true;
      continue;
    }
    if (typeof value !== "string") continue;
    if (name === "style") {
      const style = cleanStyle(value);
      if (style) clean.style = style;
      continue;
    }
    if (name === "href" && !isSafeUrl(value, LINK_SCHEMES)) continue;
    if (name === "src" && !isSafeUrl(value, IMAGE_SCHEMES)) continue;
    clean[PROPERTY_NAMES[name] ?? name] = value;
  }
  return clean;
}
