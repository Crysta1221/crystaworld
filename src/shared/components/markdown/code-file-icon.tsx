import consoleIcon from "material-icon-theme/icons/console.svg?url";
import cssIcon from "material-icon-theme/icons/css.svg?url";
import databaseIcon from "material-icon-theme/icons/database.svg?url";
import diffIcon from "material-icon-theme/icons/diff.svg?url";
import fileIcon from "material-icon-theme/icons/file.svg?url";
import htmlIcon from "material-icon-theme/icons/html.svg?url";
import javaIcon from "material-icon-theme/icons/java.svg?url";
import javascriptIcon from "material-icon-theme/icons/javascript.svg?url";
import jsonIcon from "material-icon-theme/icons/json.svg?url";
import markdownIcon from "material-icon-theme/icons/markdown.svg?url";
import pythonIcon from "material-icon-theme/icons/python.svg?url";
import reactIcon from "material-icon-theme/icons/react.svg?url";
import reactTsIcon from "material-icon-theme/icons/react_ts.svg?url";
import tomlIcon from "material-icon-theme/icons/toml.svg?url";
import typescriptIcon from "material-icon-theme/icons/typescript.svg?url";
import xmlIcon from "material-icon-theme/icons/xml.svg?url";
import yamlIcon from "material-icon-theme/icons/yaml.svg?url";

const BY_EXTENSION: Record<string, string> = {
  bash: consoleIcon,
  cjs: javascriptIcon,
  css: cssIcon,
  cts: typescriptIcon,
  diff: diffIcon,
  htm: htmlIcon,
  html: htmlIcon,
  java: javaIcon,
  js: javascriptIcon,
  json: jsonIcon,
  jsx: reactIcon,
  md: markdownIcon,
  mjs: javascriptIcon,
  mts: typescriptIcon,
  patch: diffIcon,
  py: pythonIcon,
  sh: consoleIcon,
  sql: databaseIcon,
  toml: tomlIcon,
  ts: typescriptIcon,
  tsx: reactTsIcon,
  xml: xmlIcon,
  yaml: yamlIcon,
  yml: yamlIcon,
};

const BY_LANGUAGE: Record<string, string> = {
  bash: consoleIcon,
  css: cssIcon,
  diff: diffIcon,
  html: htmlIcon,
  java: javaIcon,
  javascript: javascriptIcon,
  json: jsonIcon,
  jsx: reactIcon,
  markdown: markdownIcon,
  python: pythonIcon,
  shell: consoleIcon,
  shellscript: consoleIcon,
  sql: databaseIcon,
  toml: tomlIcon,
  tsx: reactTsIcon,
  typescript: typescriptIcon,
  xml: xmlIcon,
  yaml: yamlIcon,
};

function extensionOf(filename: string) {
  const base = filename.split(/[/\\]/).pop() ?? filename;
  const dot = base.lastIndexOf(".");
  return dot >= 0 ? base.slice(dot + 1).toLowerCase() : "";
}

export function CodeFileIcon({ filename, language }: { filename?: string; language?: string }) {
  const fromFile = filename ? BY_EXTENSION[extensionOf(filename)] : undefined;
  const src = fromFile ?? BY_LANGUAGE[language?.toLowerCase() ?? ""] ?? fileIcon;

  return (
    <img
      alt=""
      aria-hidden
      className="md-code-file-icon size-4 max-h-4 max-w-4 shrink-0"
      height={16}
      src={src}
      width={16}
    />
  );
}
