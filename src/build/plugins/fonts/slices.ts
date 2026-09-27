import type { ArticleText, FontCorpus } from "./corpus.ts";
import { collectCodes } from "./unicode-range.ts";

export type FontWeight = 500 | 700;

export type FontSlice = {
  /** File name suffix, such as `500-home`. */
  name: string;
  weight: FontWeight;
  codes: number[];
  /** Preloaded by the document head (and inlined when tiny). */
  critical: boolean;
};

type Group = { name: string; text: string; critical?: boolean };

/**
 * Splits the corpus into slices ordered from widely used to page specific.
 * Every code point lands in the first group that uses it, so a page downloads
 * the home slice, the UI slice, and only the article slices it renders.
 */
export function planSlices(corpus: FontCorpus): FontSlice[] {
  const home = corpus.sources.filter((source) => source.home);
  const regular: Group[] = [
    { name: "home", text: joinText(home, "text"), critical: true },
    { name: "ui", text: joinText(corpus.sources, "text") },
    { name: "cards", text: corpus.labels + joinText(corpus.articles, "card") },
    ...articleGroups(corpus.articles, "full"),
  ];
  const bold: Group[] = [
    { name: "home", text: joinText(home, "bold"), critical: true },
    { name: "ui", text: joinText(corpus.sources, "bold") },
    { name: "cards", text: corpus.labels + joinText(corpus.articles, "title") },
    ...articleGroups(corpus.articles, "bold"),
    // Bold text the build cannot see, such as link card titles fetched at runtime.
    { name: "rest", text: joinText(regular, "text") },
  ];
  return [...slice(500, regular), ...slice(700, bold)];
}

/** One group of glyphs shared by several articles, then one group per article. */
function articleGroups(articles: readonly ArticleText[], key: "full" | "bold"): Group[] {
  const usage = new Map<number, number>();
  for (const article of articles) {
    for (const code of collectCodes(article[key])) usage.set(code, (usage.get(code) ?? 0) + 1);
  }
  const shared = [...usage].filter(([, count]) => count > 1).map(([code]) => String.fromCodePoint(code));
  return [
    { name: "articles", text: shared.join("") },
    ...articles.map((article) => ({ name: article.name, text: article[key] })),
  ];
}

function slice(weight: FontWeight, groups: readonly Group[]): FontSlice[] {
  const taken = new Set<number>();
  const slices: FontSlice[] = [];
  for (const group of groups) {
    const codes = collectCodes(group.text).filter((code) => !taken.has(code));
    for (const code of codes) taken.add(code);
    if (codes.length === 0) continue;
    slices.push({ name: `${weight}-${group.name}`, weight, codes, critical: group.critical ?? false });
  }
  return slices;
}

function joinText<K extends string>(items: readonly { [key in K]: string }[], key: K): string {
  return items.map((item) => item[key]).join("\n");
}
