declare module "virtual:crystaworld/code-highlights" {
  /** Shiki output for the article code blocks, keyed by the code block lookup key. */
  const blocks: Readonly<Record<string, { className: string; innerHtml: string }>>;
  export default blocks;
}
