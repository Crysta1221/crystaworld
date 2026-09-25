<!--VITE PLUS START-->

# Using Vite+

This project uses Vite+ (`vp` CLI) on top of Vite. Run `vp help` for commands. Use `vp <name>` for built-ins and `vp run <name>` for `package.json` scripts / `vite.config.ts` tasks. Docs: `node_modules/vite-plus/docs` or https://viteplus.dev/guide/.

<!--VITE PLUS END-->

# Project Rules

- Write all code comments in English.
- After any change, `vp lint` and `bunx tsc --noEmit` must pass with no errors and no warnings.
- Keep files small and focused; split code into multiple files instead of overloading a single file.
- Organize the directory structure by feature (`src/app`, `src/features/<feature>`, `src/shared`). Keep route files in `src/routes` thin and delegate to features.
- Place self-hosted external font files under `public/fonts/` and reference them via `@font-face` (served from `/fonts/`).
- Declare Google Fonts in `index.html`; they are self-hosted at build time by `vite-plugin-webfont-dl`, so keep them as plain links.
