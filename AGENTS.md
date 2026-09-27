<!--VITE PLUS START-->

# Using Vite+

This project uses Vite+ (`vp` CLI) on top of Vite. Run `vp help` for commands. Use `vp <name>` for built-ins and `vp run <name>` for `package.json` scripts / `vite.config.ts` tasks. Docs: `node_modules/vite-plus/docs` or https://viteplus.dev/guide/.

<!--VITE PLUS END-->

# Project Rules

- Write all code comments in English.
- After any change, `vp lint` and `bunx tsc --noEmit` must pass with no errors and no warnings.
- Keep files small and focused; split code into multiple files instead of overloading a single file.
- Organize the directory structure by feature (`src/app`, `src/features/<feature>`, `src/shared`). Keep route files in `src/routes` thin and delegate to features. `README.md` maps every folder; update it when the layout changes.
- Non-app code also lives under `src`: `src/server` is the Cloudflare Worker runtime (entry `src/server/site.ts`), and `src/build` holds build-time Node code (Vite plugins, prerender paths). App code must not import from either.
- Place self-hosted font files under `public/fonts/` and reference them with `@font-face` (served from `/fonts/`). Zen Maru Gothic and JetBrains Mono come from `@fontsource`.
- Anchor scrolling uses one offset: `--anchor-offset` (applied as `scroll-padding-top` on `html`). Do not add `scroll-margin-top` to targets, and give same-page hash `Link`s `hashScrollIntoView={false}` plus `scrollToDocumentHash`.
- Zen Maru Gothic is subset at build time by `src/build/plugins/fonts` from the text in `src`; never edit `src/app/fonts.css` to point at generated files.
