import { useState } from "react";
import { FunnelIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";

import { Button } from "@/shared/components/ui/button";

import { PostFilterDialog, type PostFilter } from "./post-filter-dialog";

type PostIndexToolbarProps = {
  query: string;
  onQueryChange: (query: string) => void;
  filter: PostFilter;
  onFilterApply: (filter: PostFilter) => void;
  tags: readonly string[];
};

/**
 * Search field plus a button that opens the filter dialog.
 */
export function PostIndexToolbar({ query, onQueryChange, filter, onFilterApply, tags }: PostIndexToolbarProps) {
  const [open, setOpen] = useState(false);
  const filtering = filter.sort !== "newest" || filter.tags.length > 0;

  return (
    <div className="flex items-center gap-2">
      <div className="relative min-w-0 flex-1">
        <MagnifyingGlassIcon className="pointer-events-none absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="タイトルや本文から探す"
          aria-label="タイトルや本文から探す"
          className="h-9 w-full rounded-full bg-muted ps-9 pe-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
        />
      </div>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        <FunnelIcon />
        フィルタ
        {filtering ? <span className="size-1.5 rounded-full bg-primary" /> : null}
      </Button>
      <PostFilterDialog
        open={open}
        onOpenChange={setOpen}
        tags={tags}
        value={filter}
        onApply={onFilterApply}
      />
    </div>
  );
}
