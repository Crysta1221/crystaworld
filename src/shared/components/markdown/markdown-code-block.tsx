import { Check, Copy } from "@phosphor-icons/react";
import {
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";

import { CodeFileIcon } from "@/shared/components/markdown/code-file-icon";
import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { parseCodeMeta } from "@/shared/lib/highlighting/parse-code-meta";
import { cn } from "@/shared/lib/utils";

const highlightCache = new Map<string, { className: string; innerHtml: string }>();

function classNameOf(node: { className?: unknown }): string {
  const className = node.className;
  if (typeof className === "string") return className;
  if (Array.isArray(className)) {
    return className.filter((value) => typeof value === "string").join(" ");
  }
  return "";
}

function hasClass(className: string, token: string) {
  return className.split(/\s+/).includes(token);
}

function collectText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(collectText).join("");
  if (isValidElement<{ children?: ReactNode; className?: unknown }>(node)) {
    const className = classNameOf(node.props);
    if (
      hasClass(className, "line-number") ||
      hasClass(className, "line-gutter") ||
      hasClass(className, "line-diff")
    ) {
      return "";
    }
    if (hasClass(className, "line")) return `${collectText(node.props.children)}\n`;
    return collectText(node.props.children);
  }
  return "";
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className="text-muted-foreground hover:bg-foreground/10 hover:text-foreground dark:hover:bg-foreground/10"
      aria-label={copied ? "コピーしました" : "コードをコピー"}
      onClick={async () => {
        await navigator.clipboard.writeText(text.replace(/\n$/, ""));
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      }}
    >
      {copied ? <Check /> : <Copy />}
    </Button>
  );
}

const PRE_CLASS = "m-0 py-3 pr-4 pl-0 font-mono text-sm overflow-visible leading-[1.5]";

function PlainCodeLines({ code, language }: { code: string; language?: string }) {
  const lines = code.replace(/\n$/, "").split("\n");
  const isDiff = language === "diff";

  return (
    <code>
      {lines.map((line, index) => {
        const mark = isDiff && (line.startsWith("+") || line.startsWith("-")) ? line[0] : "";
        const text = mark ? line.slice(1) : line;
        const diff = mark === "+" ? "add" : mark === "-" ? "remove" : undefined;

        return (
          <span
            key={`line-${index}`}
            className="line"
            data-line={index + 1}
            {...(diff ? { "data-diff": diff } : {})}
          >
            <span className="line-gutter" aria-hidden="true">
              <span className="line-number">{index + 1}</span>
              {isDiff ? <span className="line-diff">{mark}</span> : null}
            </span>
            <span className="line-code">{text}</span>
          </span>
        );
      })}
    </code>
  );
}

export function MarkdownCodeBlock({
  children,
  className,
  node: _node,
  ...props
}: ComponentProps<"pre"> & { node?: unknown }) {
  // Extract language and meta from child <code> if present
  const codeChild = isValidElement(children) ? children : null;
  const codeProps = (codeChild?.props ?? {}) as Record<string, unknown>;
  const childClassName = typeof codeProps.className === "string" ? codeProps.className : "";
  const langMatch = /language-(\w+)/.exec(childClassName);
  const language = langMatch?.[1];

  const rawMeta = codeProps["meta"];
  const metaString = typeof rawMeta === "string" ? rawMeta : "";
  const { filename } = parseCodeMeta(metaString);

  const rawCode = collectText(codeChild?.props ? (codeProps.children as ReactNode) : children).replace(
    /\r?\n$/,
    "",
  );
  const cacheKey = `${language ?? ""}\0${filename ?? ""}\0${rawCode}`;

  const [highlighted, setHighlighted] = useState<{ className: string; innerHtml: string } | null>(null);
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const cached = highlightCache.get(cacheKey);
    if (cached) {
      setHighlighted(cached);
      return;
    }

    const element = preRef.current;
    if (!element || rawCode.trim() === "") return;

    let cancelled = false;
    const run = () => {
      void import("@/shared/lib/highlighting/highlighter")
        .then(({ highlightCode, parseShikiPre }) =>
          highlightCode(rawCode, language, filename).then(parseShikiPre),
        )
        .then((result) => {
          if (cancelled) return;
          highlightCache.set(cacheKey, result);
          setHighlighted(result);
        })
        .catch(() => undefined);
    };

    const rect = element.getBoundingClientRect();
    if (rect.bottom >= 0 && rect.top <= window.innerHeight + 300) {
      run();
      return () => {
        cancelled = true;
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        run();
      },
      { rootMargin: "300px 0px", threshold: 0 },
    );
    observer.observe(element);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [cacheKey, rawCode, filename, language]);

  return (
    <div className="md-code-block my-4 overflow-hidden rounded-xl ring-1 ring-foreground/10">
      <div className="md-code-block-header flex h-10 items-center justify-between gap-3 border-b border-border px-2">
        <span className="flex min-w-0 items-center gap-1.5 px-1 font-mono text-sm text-muted-foreground">
          <CodeFileIcon filename={filename} language={language} />
          <span className="min-w-0 truncate">{filename ?? language ?? "code"}</span>
        </span>
        <CopyButton text={rawCode} />
      </div>
      <ScrollArea orientation="horizontal" className="w-full">
        {highlighted ? (
          <pre
            className={cn(PRE_CLASS, className, highlighted.className)}
            {...props}
            dangerouslySetInnerHTML={{ __html: highlighted.innerHtml }}
          />
        ) : (
          <pre ref={preRef} className={cn(PRE_CLASS, className)} {...props}>
            <PlainCodeLines code={rawCode} language={language} />
          </pre>
        )}
      </ScrollArea>
    </div>
  );
}
