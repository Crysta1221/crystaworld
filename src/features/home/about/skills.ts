export const SKILL_LEVELS = ["low", "medium", "high", "ultra"] as const;

export type SkillLevel = (typeof SKILL_LEVELS)[number];

export const SKILL_LEVEL_LABELS = {
  ja: {
    low: "勉強中",
    medium: "ある程度",
    high: "できる",
    ultra: "得意",
  },
  en: {
    low: "Learning",
    medium: "Familiar",
    high: "Capable",
    ultra: "Strong",
  },
} as const;

/**
 * Technology marks from gilbarbara/logos, one file per skill.
 * Languages come first, then frameworks, in one continuous list.
 */
export const SKILLS = [
  { id: "javascript", level: "high", name: "JavaScript", logo: "/logos/javascript.svg" },
  { id: "typescript", level: "medium", name: "TypeScript", logo: "/logos/typescript.svg" },
  { id: "python", level: "medium", name: "Python", logo: "/logos/python.svg" },
  { id: "kotlin", level: "medium", name: "Kotlin", logo: "/logos/kotlin.svg" },
  { id: "rust", level: "medium", name: "Rust", logo: "/logos/rust.svg" },
  { id: "vue", level: "high", name: "Vue.js", logo: "/logos/vue.svg" },
  { id: "nuxt", level: "medium", name: "Nuxt", logo: "/logos/nuxt.svg" },
  { id: "react", level: "high", name: "React", logo: "/logos/react.svg" },
  { id: "next", level: "medium", name: "Next.js", logo: "/logos/nextjs.svg" },
  { id: "discord", level: "high", name: "Discord.js", logo: "/logos/discord.svg" },
  { id: "tailwind", level: "high", name: "Tailwind CSS", logo: "/logos/tailwindcss.svg" },
  { id: "docker", level: "medium", name: "Docker", logo: "/logos/docker.svg" },
] as const satisfies readonly {
  id: string;
  level: SkillLevel;
  name: string;
  logo: string;
}[];
