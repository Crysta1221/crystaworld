export type Project = {
  title: string;
  description: string;
  url: string;
  /** When true, fetch and show GitHub stargazer count for the repo URL. */
  isRepo: boolean;
  tags: string[];
};

export const RECENT_PROJECTS = [
  {
    title: "MoonCore",
    description: "Minecraftサーバーを簡単に管理するためのソフトウェア",
    url: "https://mooncore.crystaworld.dev",
    isRepo: false,
    tags: ["Software", "Minecraft"],
  },
  {
    title: "Syllaget",
    description: "国立高専のシラバスを簡単に検索できるサービス",
    url: "https://syllaget.crystaworld.dev",
    isRepo: false,
    tags: ["Web", "Service"],
  },
  {
    title: "skills",
    description: "Coding Agent用の独自Skills",
    url: "https://github.com/Crysta1221/skills",
    isRepo: true,
    tags: ["AI", "Skills"],
  },
  {
    title: "tauri-plugin-configurate",
    description: "Tauri v2 向けの型安全なアプリケーション設定管理プラグイン",
    url: "https://github.com/Crysta1221/tauri-plugin-configurate",
    isRepo: true,
    tags: ["Tauri", "Plugin"],
  },
] as const satisfies readonly Project[];
