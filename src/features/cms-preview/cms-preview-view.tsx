import { formatYearMonth } from "@/features/locale";
import { MarkdownArticle } from "@/shared/components/markdown";
import { Button } from "@/shared/components/ui/button";
import { ArrowUpRightIcon } from "@phosphor-icons/react";

import { BlogPostView } from "@/features/blogs/blog-post-view";
import { WorkGallery } from "@/features/works/work-gallery";
import { WorkTech } from "@/features/works/work-tech";

export type CmsPreviewPayload = {
  type: "crystaworld-cms-preview";
  collection: "works" | "blogs" | "memos";
  title: string;
  date: string;
  category: string;
  image: string;
  images: string[];
  tags: string[];
  url: string;
  body: string;
};

export function isPreviewPayload(value: unknown): value is CmsPreviewPayload {
  if (!value || typeof value !== "object") return false;
  const payload = value as Partial<CmsPreviewPayload>;
  return (
    payload.type === "crystaworld-cms-preview" &&
    (payload.collection === "works" || payload.collection === "blogs" || payload.collection === "memos")
  );
}

export function CmsPreviewView({ payload }: { payload: CmsPreviewPayload }) {
  if (payload.collection === "blogs" || payload.collection === "memos") {
    return (
      <div className="py-8">
        <BlogPostView
          post={{
            id: "preview",
            title: payload.title,
            date: payload.date,
            tags: payload.tags,
            body: payload.body,
          }}
        />
      </div>
    );
  }

  const images = payload.images.length > 0 ? payload.images : payload.image ? [payload.image] : [];

  return (
    <article className="py-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-stretch gap-4">
          <span aria-hidden className="w-2 shrink-0 rounded-sm bg-primary" />
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">// {payload.category}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
              {payload.title}
            </h1>
          </div>
        </div>
        {payload.date ? (
          <p className="ml-6 w-fit shrink-0 rounded-full bg-foreground px-3.5 py-1.5 text-sm text-background sm:mt-1 sm:ml-0">
            {formatYearMonth(payload.date, "ja")}
          </p>
        ) : null}
      </header>

      <div className="mt-8 space-y-8 sm:mt-10">
        <WorkGallery images={images} />
        <div className="space-y-8">
          <div className="space-y-4">
            {payload.url ? (
              <div className="flex justify-end">
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-auto px-5 py-2"
                  nativeButton={false}
                  render={<a href={payload.url} target="_blank" rel="noopener noreferrer" />}
                >
                  プロジェクトを見る
                  <ArrowUpRightIcon />
                </Button>
              </div>
            ) : null}
            <section aria-labelledby="work-description-heading">
              <h2
                id="work-description-heading"
                className="inline-flex rounded-full bg-primary/15 px-3 py-1 text-sm font-medium text-primary"
              >
                Description
              </h2>
              <div className="mt-4">
                <MarkdownArticle markdown={payload.body} />
              </div>
            </section>
          </div>
          <WorkTech tags={payload.tags} />
        </div>
      </div>
    </article>
  );
}
