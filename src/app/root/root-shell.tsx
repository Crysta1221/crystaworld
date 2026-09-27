import type { ReactNode } from "react";
import { HeadContent, Scripts } from "@tanstack/react-router";

/** The HTML document around every page. */
export function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
