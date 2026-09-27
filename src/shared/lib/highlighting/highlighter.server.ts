import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import bash from "@shikijs/langs/bash";
import css from "@shikijs/langs/css";
import diff from "@shikijs/langs/diff";
import html from "@shikijs/langs/html";
import javascript from "@shikijs/langs/javascript";
import json from "@shikijs/langs/json";
import jsx from "@shikijs/langs/jsx";
import kotlin from "@shikijs/langs/kotlin";
import markdown from "@shikijs/langs/markdown";
import python from "@shikijs/langs/python";
import rust from "@shikijs/langs/rust";
import sql from "@shikijs/langs/sql";
import toml from "@shikijs/langs/toml";
import tsx from "@shikijs/langs/tsx";
import typescript from "@shikijs/langs/typescript";
import yaml from "@shikijs/langs/yaml";
import darkPlus from "@shikijs/themes/dark-plus";
import lightPlus from "@shikijs/themes/light-plus";

import { codeBlockTransformer } from "./code-block-transformer";
import { resolveLanguage } from "./languages";

let highlighterPromise: Promise<HighlighterCore> | undefined;

/**
 * Workers disallow runtime WebAssembly compilation, so article highlighting
 * uses Shiki's JavaScript regex engine instead of Oniguruma.
 */
function getHighlighter(): Promise<HighlighterCore> {
  highlighterPromise ??= createHighlighterCore({
    themes: [lightPlus, darkPlus],
    langs: [
      javascript,
      typescript,
      tsx,
      jsx,
      html,
      css,
      json,
      bash,
      python,
      rust,
      kotlin,
      yaml,
      markdown,
      diff,
      toml,
      sql,
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
