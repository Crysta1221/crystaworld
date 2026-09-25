export type SocialLink = {
  id: string;
  name: string;
  href: string;
  icon: string;
};

export const SOCIALS_LABEL = "Social Links";

export const SOCIAL_LINKS = [
  {
    id: "github",
    name: "GitHub",
    href: "https://github.com/Crysta1221",
    icon: "/socials/github.svg",
  },
  {
    id: "x",
    name: "X",
    href: "https://x.com/cr1sta_dev",
    icon: "/socials/x.svg",
  },
  {
    id: "qiita",
    name: "Qiita",
    href: "https://qiita.com/Crysta1221",
    icon: "/socials/qiita.svg",
  },
  {
    id: "vrchat",
    name: "VRChat",
    href: "https://vrchat.com/home/user/usr_15cfdbaa-1949-4a44-963e-0b238adcce12",
    icon: "/socials/vrchat.svg",
  },
] as const satisfies readonly SocialLink[];
