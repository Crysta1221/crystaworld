import { MarkdownArticle } from "./markdown";

/**
 * Backward compatibility wrapper around MarkdownArticle.
 */
export function MarkdownBody({ source }: { source: string }) {
  return <MarkdownArticle markdown={source} />;
}
