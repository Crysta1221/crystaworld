import { useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { XIcon } from "@phosphor-icons/react";

import { Button } from "@/shared/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/shared/components/ui/combobox";

import { isSortKey, type SortKey } from "./filter-posts";

export type PostFilter = {
  keyword: string;
  tags: readonly string[];
  sort: SortKey;
};

type PostFilterDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tags: readonly string[];
  value: PostFilter;
  onApply: (value: PostFilter) => void;
};

const SORTS: readonly { value: SortKey; label: string }[] = [
  { value: "newest", label: "日付が新しい順" },
  { value: "oldest", label: "日付が古い順" },
  { value: "name", label: "名前順" },
  { value: "name-desc", label: "名前の逆順" },
];

const FIELD =
  "h-11 w-full rounded-xl bg-muted px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50";

const TAG_SUGGESTION_LIMIT = 5;

/**
 * Search dialog for extra index rules. Draft edits apply only from the confirm button.
 */
export function PostFilterDialog({ open, onOpenChange, tags, value, onApply }: PostFilterDialogProps) {
  const [keyword, setKeyword] = useState(value.keyword);
  const [selected, setSelected] = useState<string[]>([...value.tags]);
  const [sort, setSort] = useState<SortKey>(value.sort);
  const [tagQuery, setTagQuery] = useState("");
  const tagAnchor = useComboboxAnchor();
  const tagSuggestions = tags
    .filter((tag) => !selected.includes(tag))
    .filter((tag) => tag.toLocaleLowerCase().includes(tagQuery.trim().toLocaleLowerCase()))
    .slice(0, TAG_SUGGESTION_LIMIT);

  const reset = () => {
    setKeyword("");
    setSelected([]);
    setSort("newest");
    setTagQuery("");
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (next) {
          setKeyword(value.keyword);
          setSelected([...value.tags]);
          setSort(value.sort);
          setTagQuery("");
        }
        onOpenChange(next);
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/45 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 flex max-h-[min(40rem,calc(100dvh-2rem))] w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-3xl bg-popover text-popover-foreground shadow-2xl ring-1 ring-foreground/10 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
          <header className="relative shrink-0 border-b border-border/70 px-12 py-4">
            <Dialog.Title className="text-center text-base font-bold">検索</Dialog.Title>
            <Dialog.Close
              aria-label="閉じる"
              className="absolute inset-e-3 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <XIcon className="size-4" />
            </Dialog.Close>
          </header>

          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
            <section className="space-y-2">
              <label htmlFor="post-filter-keyword" className="block text-sm font-bold">
                キーワード
              </label>
              <input
                id="post-filter-keyword"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="キーワードを入力"
                className={FIELD}
              />
              <Dialog.Description className="text-xs leading-relaxed text-muted-foreground">
                入力したキーワードのいずれかをタイトルまたは本文に含む記事が表示されます。
              </Dialog.Description>
            </section>

            <section className="space-y-2">
              <p className="text-sm font-bold">タグ</p>
              <Combobox
                items={tagSuggestions}
                multiple
                value={selected}
                onValueChange={setSelected}
                onInputValueChange={setTagQuery}
              >
                <ComboboxChips ref={tagAnchor} className="min-h-11 w-full rounded-xl border-transparent bg-muted px-3">
                  <ComboboxValue>
                    {(values: string[]) => (
                      <>
                        {values.map((tag) => (
                          <ComboboxChip key={tag}>#{tag}</ComboboxChip>
                        ))}
                        <ComboboxChipsInput placeholder="タグを入力" aria-label="タグを入力" />
                      </>
                    )}
                  </ComboboxValue>
                </ComboboxChips>
                <ComboboxContent anchor={tagAnchor}>
                  <ComboboxEmpty>一致するタグはありません。</ComboboxEmpty>
                  <ComboboxList>
                    {(tag: string) => (
                      <ComboboxItem key={tag} value={tag}>
                        #{tag}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              <p className="text-xs leading-relaxed text-muted-foreground">
                入力したタグをすべて含む記事が表示されます。
              </p>
            </section>

            <section className="space-y-2">
              <label htmlFor="post-filter-sort" className="block text-sm font-bold">
                並び順
              </label>
              <Select
                items={SORTS}
                value={sort}
                onValueChange={(next) => {
                  if (isSortKey(next)) setSort(next);
                }}
              >
                <SelectTrigger
                  id="post-filter-sort"
                  className="h-11 w-full rounded-xl border-transparent bg-muted px-3 shadow-none data-[size=default]:h-11"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  {SORTS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </section>
          </div>

          <footer className="flex shrink-0 gap-3 border-t border-border/70 px-5 py-4">
            <Button type="button" variant="secondary" className="h-11 flex-1" onClick={reset}>
              条件をクリア
            </Button>
            <Button
              type="button"
              className="h-11 flex-1"
              onClick={() => {
                onApply({ keyword, tags: selected, sort });
                onOpenChange(false);
              }}
            >
              絞り込む
            </Button>
          </footer>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
