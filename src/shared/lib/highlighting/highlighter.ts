import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import darkPlus from "@shikijs/themes/dark-plus";
import lightPlus from "@shikijs/themes/light-plus";

import { codeBlockTransformer } from "./code-block-transformer";
import { resolveLanguage } from "./languages";

export { parseShikiPre } from "./parse-shiki-pre";

let highlighterPromise: Promise<HighlighterCore> | undefined;

/**
 * One highlighter for the Worker (article pages) and the browser (CMS preview), so both
 * render the same languages. Workers disallow runtime WebAssembly compilation, so it uses
 * Shiki's JavaScript regex engine instead of Oniguruma.
 */
function getHighlighter(): Promise<HighlighterCore> {
  highlighterPromise ??= createHighlighterCore({
    themes: [lightPlus, darkPlus],
    // Dynamic imports keep each grammar in its own chunk.
    langs: [
      import("@shikijs/langs/javascript"),
      import("@shikijs/langs/typescript"),
      import("@shikijs/langs/tsx"),
      import("@shikijs/langs/jsx"),
      import("@shikijs/langs/html"),
      import("@shikijs/langs/css"),
      import("@shikijs/langs/json"),
      import("@shikijs/langs/bash"),
      import("@shikijs/langs/python"),
      import("@shikijs/langs/rust"),
      import("@shikijs/langs/kotlin"),
      import("@shikijs/langs/yaml"),
      import("@shikijs/langs/markdown"),
      import("@shikijs/langs/diff"),
      import("@shikijs/langs/toml"),
      import("@shikijs/langs/sql"),
    ],
    engine: createJavaScriptRegexEngine({ forgiving: true }),
  });
  return highlighterPromise;
}

export async function highlightCode(code: string, language?: string, filename?: string): Promise<string> {
  const highlighter = await getHighlighter();
  const resolved = resolveLanguage(language);
  const loaded = highlighter.getLoadedLanguages();
  const targetLang = loaded.includes(resolved) ? resolved : "text";
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
