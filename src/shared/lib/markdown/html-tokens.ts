export type HtmlToken =
  | { kind: "text"; value: string }
  | { kind: "open"; tag: string; attributes: Record<string, string | true>; selfClosing: boolean }
  | { kind: "close"; tag: string };

const COMMENT_OR_TAG =
  /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:\s+[^\s"'<>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*(\/?)>/g;
const ATTRIBUTE = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
const SCRIPT_OR_STYLE = /<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi;

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

function decode(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, body: string) => {
    if (body.startsWith("#")) {
      const code = body[1]?.toLowerCase() === "x" ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
      return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match;
    }
    return ENTITIES[body.toLowerCase()] ?? match;
  });
}

function parseAttributes(source: string): Record<string, string | true> {
  const attributes: Record<string, string | true> = {};
  for (const match of source.matchAll(ATTRIBUTE)) {
    const name = (match[1] ?? "").toLowerCase();
    const value = match[2] ?? match[3] ?? match[4];
    attributes[name] = value === undefined ? true : decode(value);
  }
  return attributes;
}

/** Splits the value of a Markdown `html` node into tags and text. Comments are dropped. */
export function tokenizeHtml(source: string): HtmlToken[] {
  const tokens: HtmlToken[] = [];
  let last = 0;
  const html = source.replace(SCRIPT_OR_STYLE, "");
  const pushText = (text: string) => {
    // A newline between tags only separates source lines, so it is not content.
    if (text !== "" && !/^\s*\n\s*$/.test(text)) tokens.push({ kind: "text", value: decode(text) });
  };
  for (const match of html.matchAll(COMMENT_OR_TAG)) {
    pushText(html.slice(last, match.index));
    last = match.index + match[0].length;
    if (match[2] === undefined) continue;
    const tag = match[2].toLowerCase();
    if (match[1]) tokens.push({ kind: "close", tag });
    else tokens.push({ kind: "open", tag, attributes: parseAttributes(match[3] ?? ""), selfClosing: match[4] === "/" });
  }
  pushText(html.slice(last));
  return tokens;
}
