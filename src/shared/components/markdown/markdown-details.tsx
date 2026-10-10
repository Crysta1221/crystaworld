import { Children, isValidElement, useRef, type ComponentProps, type MouseEvent, type ReactNode } from "react";

const DURATION_MS = 220;

/** The native <details> jumps open; this animates its height between the summary and the full box. */
function animateToggle(details: HTMLDetailsElement, running: { current: Animation | null }) {
  const summary = details.querySelector<HTMLElement>(":scope > summary");
  if (!summary) return;

  // A click during an animation reverses it from the height currently on screen.
  const from = details.offsetHeight;
  const closing = details.open && details.dataset.closing !== "true";
  running.current?.cancel();
  delete details.dataset.closing;

  let to: number;
  if (closing) {
    // Set first so the summary is measured without its open-state border.
    details.dataset.closing = "true";
    to = summary.offsetHeight + (details.offsetHeight - details.clientHeight);
  } else {
    details.open = true;
    to = details.offsetHeight;
  }

  const animation = details.animate(
    { height: [`${from}px`, `${to}px`] },
    { duration: DURATION_MS, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
  );
  running.current = animation;
  animation.onfinish = () => {
    running.current = null;
    delete details.dataset.closing;
    if (closing) details.open = false;
  };
}

/** Without a `<summary>` the browser draws its own label, which the article styles cannot reach. */
const DEFAULT_SUMMARY = "詳細";

/** `<details>` in Markdown with an opening and closing animation. */
export function MarkdownDetails({
  children,
  node: _node,
  onClick,
  ...props
}: ComponentProps<"details"> & { node?: unknown }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const running = useRef<Animation | null>(null);

  const handleClick = (event: MouseEvent<HTMLDetailsElement>) => {
    onClick?.(event);
    const details = ref.current;
    const target = event.target as Element;
    const summary = target.closest("summary");
    // Links inside the summary keep their own behavior.
    if (!details || summary?.parentElement !== details || target.closest("a")) return;
    if (typeof details.animate !== "function") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    event.preventDefault();
    animateToggle(details, running);
  };

  // Bare text after the summary has no element to carry padding, so the body gets a wrapper.
  const items = Children.toArray(children);
  const isSummary = (child: ReactNode) => isValidElement(child) && child.type === "summary";
  const summary = items.find(isSummary);

  return (
    <details ref={ref} {...props} onClick={handleClick}>
      {summary ?? <summary>{DEFAULT_SUMMARY}</summary>}
      <div className="md-details-body">{items.filter((child) => !isSummary(child))}</div>
    </details>
  );
}
