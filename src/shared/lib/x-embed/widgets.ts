const WIDGETS_SRC = "https://platform.twitter.com/widgets.js";

export type TweetOptions = {
  theme: "light" | "dark";
  lang: string;
  /** Do Not Track: keeps the embed from being used to personalize X ads. */
  dnt: boolean;
  /** "none" hides the parent post when the embedded one is a reply. */
  conversation: "none" | "all";
  align: "left" | "center" | "right";
};

export type Twttr = {
  widgets: {
    /** Resolves to undefined when the post is deleted, protected, or otherwise unavailable. */
    createTweet(id: string, target: HTMLElement, options: TweetOptions): Promise<HTMLElement | undefined>;
  };
};

type TwttrGlobal = Partial<Twttr> & {
  ready?: (callback: (twttr: Twttr) => void) => void;
};

let loading: Promise<Twttr> | undefined;

function readGlobal(): TwttrGlobal | undefined {
  return (window as unknown as { twttr?: TwttrGlobal }).twttr;
}

/**
 * Loads X's official widgets.js once, on demand. Pages never request it
 * until an embedded post is about to scroll into view.
 */
export function loadWidgets(): Promise<Twttr> {
  if (!loading) {
    loading = new Promise<Twttr>((resolve, reject) => {
      const loaded = readGlobal();
      if (loaded?.widgets) {
        resolve(loaded as Twttr);
        return;
      }

      const script = document.createElement("script");
      script.src = WIDGETS_SRC;
      script.async = true;
      script.onload = () => {
        const twttr = readGlobal();
        if (twttr?.widgets) resolve(twttr as Twttr);
        else if (twttr?.ready) twttr.ready(resolve);
        else reject(new Error("widgets.js did not initialize"));
      };
      script.onerror = () => reject(new Error("widgets.js failed to load"));
      document.head.append(script);
    });
    // A blocked script should be retried on the next page, not cached as a failure.
    loading.catch(() => {
      loading = undefined;
    });
  }
  return loading;
}
