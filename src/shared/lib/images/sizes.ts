/** Intrinsic sizes for local content images so lazy loading can see them below the fold. */
export const IMAGE_SIZES: Readonly<Record<string, { width: number; height: number }>> = {
  "/works/festival-pos-2.webp": { width: 1400, height: 752 },
  "/works/festival-pos-3.webp": { width: 1400, height: 754 },
  "/works/festival-pos-arch.webp": { width: 1024, height: 559 },
  "/works/festival-pos-login.webp": { width: 1600, height: 859 },
  "/works/festival-pos.webp": { width: 1400, height: 757 },
  "/works/koreisai-events.webp": { width: 1600, height: 1045 },
  "/works/koreisai-loading.webp": { width: 1600, height: 867 },
  "/works/koreisai-ongoing.webp": { width: 1600, height: 372 },
  "/works/koreisai-prototype.webp": { width: 1600, height: 1112 },
  "/works/koreisai-scroll-demo.webp": { width: 1280, height: 695 },
  "/works/koreisai-theme.webp": { width: 1600, height: 900 },
  "/works/koreisai-timebar.webp": { width: 1600, height: 900 },
  "/works/koreisai-timetable-1.webp": { width: 1600, height: 1010 },
  "/works/koreisai-timetable-2.webp": { width: 1600, height: 1011 },
  "/works/koreisai.webp": { width: 1600, height: 1009 },
  "/works/mooncore-dashboard.webp": { width: 1600, height: 950 },
  "/works/mooncore.webp": { width: 1536, height: 1024 },
  "/works/tatami-report-2.webp": { width: 1600, height: 924 },
  "/works/tatami-report-3.webp": { width: 1600, height: 924 },
  "/works/tatami-report.webp": { width: 1600, height: 924 },
  "/works/tauri-plugin-configurate.webp": { width: 1200, height: 600 },
  "/blogs/cms-screenshot.webp": { width: 2174, height: 1169 },
};

export function imageSize(src: string): { width: number; height: number } | undefined {
  return IMAGE_SIZES[src];
}
