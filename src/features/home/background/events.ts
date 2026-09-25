export type BackgroundEvent = {
  dateTime: string;
  text: {
    ja: string;
    en: string;
  };
};

export const BACKGROUND_EVENTS: readonly BackgroundEvent[] = [
  {
    dateTime: "2026-04",
    text: {
      ja: "長野工業高等専門学校 入学 (専攻科)",
      en: "Enrolled in the advanced course at National Institute of Technology, Nagano College.",
    },
  },
  {
    dateTime: "2026-03",
    text: {
      ja: "長野工業高等専門学校 卒業 (電子制御工学科卒・準学士)",
      en: "Graduated from National Institute of Technology, Nagano College (Department of Electronics and Control Engineering, associate degree).",
    },
  },
  {
    dateTime: "2021-10",
    text: {
      ja: "高専プログラミングコンテスト 課題部門で特別賞をチームで受賞",
      en: "Received a Special Award in the Theme Category of the Kosen Programming Contest as a team member.",
    },
  },
  {
    dateTime: "2021-04",
    text: {
      ja: "長野工業高等専門学校 入学 (電子制御工学科)",
      en: "Enrolled in the Department of Electronics and Control Engineering at National Institute of Technology, Nagano College.",
    },
  },
  {
    dateTime: "2006-03",
    text: {
      ja: "誕生",
      en: "Born.",
    },
  },
];
