import type { Plugin } from "vite";

import { buildHighlightTable, type HighlightTable } from "./table.ts";

const MODULE_ID = "virtual:crystaworld/code-highlights";
const RESOLVED_MODULE_ID = `\0${MODULE_ID}`;

/**
 * `virtual:crystaworld/code-highlights` exports the Shiki output of every article code block.
 * Server functions look blocks up there instead of highlighting on each request.
 */
export function codeHighlightsPlugin(): Plugin {
  let root = process.cwd();
  let isBuild = false;
  let buildTable: Promise<HighlightTable> | undefined;

  const table = () => {
    // A build loads the module once per environment; share one run between them.
    if (!isBuild) return buildHighlightTable(root, true);
    return (buildTable ??= buildHighlightTable(root, false));
  };

  return {
    name: "crystaworld:code-highlights",
    configResolved(config) {
      root = config.root;
      isBuild = config.command === "build";
    },
    resolveId(id) {
      return id === MODULE_ID ? RESOLVED_MODULE_ID : undefined;
    },
    async load(id) {
      if (id !== RESOLVED_MODULE_ID) return undefined;
      const { blocks, files } = await table();
      // Editing an article in dev rebuilds the table.
      for (const file of files) this.addWatchFile(file);
      return `export default ${JSON.stringify(blocks)};\n`;
    },
  };
}
