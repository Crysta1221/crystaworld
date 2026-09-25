import type { GroupLink } from "../group-button/link-group";

export const DONATE_LABEL = "Buy Me a Coffee ☕";

export const DONATE_COPY = {
  ja: "私の活動を気に入ってもらえたら是非コーヒーをおごってください！",
  en: "If you like what I do, please buy me a coffee!",
} as const;

export const DONATE_LINKS = [
  {
    id: "kofi",
    name: "Ko-fi",
    href: "https://ko-fi.com/cr1sta_dev",
    icon: "/socials/kofi.svg",
  },
  {
    id: "github-sponsors",
    name: "GitHub Sponsors",
    href: "https://github.com/sponsors/Crysta1221",
    icon: "/socials/github.svg",
  },
] as const satisfies readonly GroupLink[];
