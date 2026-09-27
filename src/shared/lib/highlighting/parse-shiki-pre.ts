export function parseShikiPre(html: string): { className: string; innerHtml: string } {
  const match = /<pre([^>]*)>([\s\S]*)<\/pre>/.exec(html);
  const attributes = match?.[1] ?? "";
  const className = /class="([^"]*)"/.exec(attributes)?.[1] ?? "shiki";

  return {
    className,
    innerHtml: match?.[2] ?? html,
  };
}
