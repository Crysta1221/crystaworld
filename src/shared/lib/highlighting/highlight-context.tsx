import { createContext, useContext, type ReactNode } from "react";

export type HighlightBlock = {
  className: string;
  innerHtml: string;
};

const HighlightContext = createContext<Readonly<Record<string, HighlightBlock>> | null>(null);

export function HighlightProvider({
  highlights,
  children,
}: {
  highlights: Readonly<Record<string, HighlightBlock>>;
  children: ReactNode;
}) {
  return <HighlightContext.Provider value={highlights}>{children}</HighlightContext.Provider>;
}

export function useProvidedHighlight(cacheKey: string): HighlightBlock | null {
  return useContext(HighlightContext)?.[cacheKey] ?? null;
}
