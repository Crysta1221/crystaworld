import { createHighlighter, type Highlighter } from "shiki";
import { codeBlockTransformer } from "./code-block-transformer";

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

const LANGUAGE_ALIASES: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  py: "python",
  sh: "bash",
  shell: "bash",
  yml: "yaml",
  md: "markdown",
  rs: "rust",
  kt: "kotlin",
};

export function resolveLanguage(lang?: string): string {
  if (!lang) return "text";
  const normalized = lang.toLowerCase().trim();
  return LANGUAGE_ALIASES[normalized] ?? normalized;
}

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

export function parseShikiPre(html: string): { className: string; innerHtml: string } {
  const match = /<pre([^>]*)>([\s\S]*)<\/pre>/.exec(html);
  const attributes = match?.[1] ?? "";
  const className = /class="([^"]*)"/.exec(attributes)?.[1] ?? "shiki";

  return {
    className,
    innerHtml: match?.[2] ?? html,
  };
}
