import { PageHero } from "@/shared/components/page-hero";

/**
 * Tips page (currently empty placeholder).
 */
export function TipsPage() {
  return (
    <div>
      <div className="slide-enter">
        <PageHero pattern="honeycomb" title="TIPS" />
      </div>
      <div className="slide-enter-content py-12 text-center text-muted-foreground">
        <p className="text-sm sm:text-base">Tips は準備中です。</p>
      </div>
    </div>
  );
}
