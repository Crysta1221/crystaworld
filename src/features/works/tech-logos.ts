export type TechLogo = {
  name: string;
  src: string;
  /** Monochrome marks are painted with the text color so they stay visible in both themes. */
  mask?: boolean;
  /** Wider marks, such as wordmarks, need a different box than a square icon. */
  markClass?: string;
};

const TECH_LOGOS = [
  { test: /^react\b/i, logo: { name: "React", src: "/logos/react.svg" } },
  { test: /^next\.js\b/i, logo: { name: "Next.js", src: "/logos/nextjs.svg" } },
  { test: /^typescript\b/i, logo: { name: "TypeScript", src: "/logos/typescript.svg" } },
  { test: /^tailwind css\b/i, logo: { name: "Tailwind CSS", src: "/logos/tailwindcss.svg" } },
  { test: /^framer motion\b/i, logo: { name: "Framer Motion", src: "/logos/framer.svg", mask: true } },
  { test: /^minecraft\b/i, logo: { name: "Minecraft", src: "/logos/minecraft.svg" } },
  { test: /^kotlin\b/i, logo: { name: "Kotlin", src: "/logos/kotlin.svg" } },
  { test: /^paper api\b/i, logo: { name: "PaperMC", src: "/logos/paper.svg" } },
  { test: /^discord\b/i, logo: { name: "Discord", src: "/logos/discord.svg" } },
  { test: /^velocity\b/i, logo: { name: "Velocity", src: "/logos/velocity.svg" } },
  { test: /^shadcn\/ui\b/i, logo: { name: "shadcn/ui", src: "/logos/shadcn.svg", mask: true } },
  { test: /^jotai\b/i, logo: { name: "Jotai", src: "/logos/jotai.svg", mask: true, markClass: "h-5 w-10" } },
  { test: /^nextauth\.js\b/i, logo: { name: "Auth.js", src: "/logos/authjs.svg" } },
  { test: /^valibot\b/i, logo: { name: "Valibot", src: "/logos/valibot.svg" } },
  { test: /^google sheets\b/i, logo: { name: "Google Sheets", src: "/logos/google-sheets.svg" } },
  { test: /^bun\b/i, logo: { name: "Bun", src: "/logos/bun.svg" } },
  { test: /^biome\b/i, logo: { name: "Biome", src: "/logos/biome.svg" } },
  { test: /^vercel\b/i, logo: { name: "Vercel", src: "/logos/vercel.svg", mask: true } },
  { test: /^github actions\b/i, logo: { name: "GitHub Actions", src: "/logos/github-actions.svg" } },
] as const satisfies readonly { test: RegExp; logo: TechLogo }[];

export function techLogosFor(tags: readonly string[]): TechLogo[] {
  const seen = new Set<string>();
  const logos: TechLogo[] = [];

  for (const tag of tags) {
    const match = TECH_LOGOS.find((item) => item.test.test(tag));
    if (!match || seen.has(match.logo.name)) continue;
    seen.add(match.logo.name);
    logos.push(match.logo);
  }

  return logos;
}
