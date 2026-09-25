import { PageHero } from "@/shared/components/page-hero";
import { PostIndex } from "@/shared/components/post-index/post-index";

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
        <PostIndex
          posts={MEMOS}
          emptyMessage="メモはまだありません。"
          renderPost={(post) => <MemoCard post={post} />}
        />
      </div>
    </div>
  );
}
