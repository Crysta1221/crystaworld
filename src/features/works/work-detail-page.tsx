import { ArrowLeftIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";

import { formatYearMonth } from "@/features/locale";
import { MarkdownArticle } from "@/shared/components/markdown";
import { Button } from "@/shared/components/ui/button";

import { getWork } from "./catalog";
import { WorkGallery } from "./work-gallery";
import { WorkLinks } from "./work-links";
import { WorkTech } from "./work-tech";

/**
 * Work detail. No page hero: a back pill, then the title, carousel, and copy.
 */
export function WorkDetailPage({ workId }: { workId: string }) {
  const work = getWork(workId);

  return (
    <div className="slide-enter-content py-6 sm:py-8">
      <Button
        variant="secondary"
        size="sm"
        className="h-auto px-5 py-2"
        nativeButton={false}
        render={<Link to="/works" />}
      >
        <ArrowLeftIcon />
        戻る
      </Button>

      {work ? (
        <article className="slide-enter-content mt-6 sm:mt-8">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-stretch gap-4">
              <span aria-hidden className="w-2 shrink-0 rounded-sm bg-primary" />
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">// {work.category}</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
                  {work.title}
                </h1>
              </div>
            </div>
            <p className="ml-6 w-fit shrink-0 rounded-full bg-foreground px-3.5 py-1.5 text-sm text-background sm:mt-1 sm:ml-0">
              {formatYearMonth(work.date, "ja")}
            </p>
          </header>

          <div className="mt-8 space-y-8 sm:mt-10">
            <WorkGallery key={work.id} images={work.images} />
            <div className="space-y-8">
              <div className="space-y-4">
                <WorkLinks links={work.links} />
                <section aria-labelledby="work-description-heading">
                  <h2
                    id="work-description-heading"
                    className="inline-flex rounded-full bg-primary/15 px-3 py-1 text-sm font-medium text-primary"
                  >
                    Description
                  </h2>
                  <div className="mt-4">
                    <MarkdownArticle markdown={work.body} />
                  </div>
                </section>
              </div>
              <WorkTech tags={work.tags} />
            </div>
          </div>
        </article>
      ) : (
        <p className="mt-8 text-sm text-muted-foreground">
          この作品は見つかりませんでした。
        </p>
      )}
    </div>
  );
}
