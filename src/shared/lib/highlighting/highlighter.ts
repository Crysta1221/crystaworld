import { createHighlighter, type Highlighter } from "shiki";
import { codeBlockTransformer } from "./code-block-transformer";
import { resolveLanguage } from "./languages";

export { parseShikiPre } from "./parse-shiki-pre";

let highlighterPromise: Promise<Highlighter> | undefined;

const BUNDLED_LANGUAGES = [
  "javascript",
  "typescript",
  "tsx",
  "jsx",
  "html",
  "css",
  "json",
  "bash",
  "shell",
  "python",
  "rust",
  "kotlin",
  "yaml",
  "markdown",
  "diff",
  "toml",
  "sql",
] as const;

export function getHighlighter(): Promise<Highlighter> {
  highlighterPromise ??= createHighlighter({
    themes: ["light-plus", "dark-plus"],
    langs: [...BUNDLED_LANGUAGES],
  });
  return highlighterPromise;
}

export async function highlightCode(code: string, language?: string, filename?: string): Promise<string> {
  const highlighter = await getHighlighter();
  const resolved = resolveLanguage(language);
  const loadedLangs = highlighter.getLoadedLanguages();

  let targetLang = "text";
  if (loadedLangs.includes(resolved)) {
    targetLang = resolved;
  } else {
    try {
      await highlighter.loadLanguage(resolved as Parameters<typeof highlighter.loadLanguage>[0]);
      targetLang = resolved;
    } catch {
      targetLang = "text";
    }
  }

  const source = code.replace(/\r?\n$/, "");

  return highlighter.codeToHtml(source, {
    lang: targetLang,
    themes: {
      light: "light-plus",
      dark: "dark-plus",
    },
    defaultColor: false,
    ...(filename ? { meta: { filename } } : {}),
    transformers: [codeBlockTransformer],
  });
}
