import { PageHero } from "@/shared/components/page-hero";

import { MEMOS } from "./catalog";
import { MemoCard } from "./memo-card";

/**
 * Memos index. Cards link to each note; the note itself is a separate page.
 */
export function MemosPage() {
  return (
    <div>
      <div className="slide-enter">
        <PageHero pattern="honeycomb" title="MEMOS" />
      </div>
      <div className="py-6 sm:py-8">
        {MEMOS.length === 0 ? (
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">メモはまだありません。</p>
        ) : (
          <ul className="grid list-none items-stretch gap-3 sm:grid-cols-2">
            {MEMOS.map((post) => (
              <li key={post.id} className="min-w-0">
                <MemoCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
