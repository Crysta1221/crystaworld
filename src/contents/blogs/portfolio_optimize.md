---
title: ポートフォリオを高速化した
date: 2026-10-10
tags:
  - Random
---

> [!NOTE]
> **追記**
> 具体的にどのように最適化を行ったかを記載しました。<br/>速度の調査はClaude Codeを用い、chrome-devtoolsによるLighthouseをPage Speedと同じような環境に設定して行いました。 <br/>環境によっては、うまくいかないことも考えられますのであくまで<u>**参考程度**</u>としてご覧ください。

## はじめに

先日、このポートフォリオを公開しました。
このサイトはTanstack RouterでSPAで構築していましたが、GoogleのPage Speedで計測したところモバイルが93点でした。

![](/blogs/pasted-image-1791565736126.png "SPA時のモバイルスコア")

これでも十分高いのですが、できればモバイルでも100点は目指したいところです。 そこへ、インフラエンジニアをされている[LaPhさん](https://x.com/R0u9h)より以下の助言をいただきました。

[https://x.com/R0u9h/status/2103882316905148855?s=20](https://x.com/R0u9h/status/2103882316905148855?s=20)

そこで本ポートフォリオはTanstack RouterからTanstack Start + Redact 構成を採用しました。
結果は以下の通りです。Page Speedはタイミングや、コード変更等により多少の変動があるためその辺はご了承ください。

| ページ | 改善前 | 改善後 |
| --- | --- | --- |
| `/` | 93 | **100** |
| `/works` | 88 | **100** |
| `/blogs` / `/memos` | 83 / 82 | **99 / 99** |
| `/blogs/welcome` | 81 | **95** |
| `/works/koreisai-59` | 76 | **95** |
| その他の Works 詳細ページ | 未計測 | **各 96** |
| Memos 詳細ページ | 未計測 | **99** |

主に行ったのは次の6つです。

1. 公開ページをビルド時にHTMLにして、Cloudflareから直接返す
2. JSの読み込みを、最初の描画の後ろにずらす
3. LCPの画像をpreloadする
4. フォントを、使われている文字だけに分割する
5. 画像を軽くする
6. レイアウトのずれを抑える

ここからは、それぞれの中身をコードを交えて書いていきます。

## 1. ビルド時のprerenderと直接配信

まず、公開ページをビルド時にHTMLとして書き出すようにしました。これには、TanStack Startのprerenderを使っています。対象のパスは、Markdownのファイル名をベースに設定します。

```ts title="src/build/prerender-pages.ts"
function contentPages(folder: string, prefix: string) {
  return readdirSync(`src/contents/${folder}`)
    .filter((file) => file.endsWith(".md"))
    .map((file) => ({ path: `${prefix}/${encodeURIComponent(file.slice(0, -3))}` }));
}

export function prerenderPages() {
  return [
    { path: "/" },
    { path: "/works" },
    { path: "/blogs" },
    { path: "/memos" },
    ...contentPages("works", "/works"),
    ...contentPages("blogs", "/blogs"),
    ...contentPages("memos", "/memos"),
  ];
}
```

記事を追加すると、ページも自動で増えるため、パスを手動で書き足す必要がありません。

```ts title="vite.config.ts"
tanstackStart({
  server: { build: { inlineCss: true } },
  prerender: {
    enabled: true,
    crawlLinks: false,
    autoStaticPathsDiscovery: true,
    // `/works` -> works.html so the asset layer serves it without a trailing-slash redirect.
    autoSubfolderIndex: false,
    failOnError: true,
    filter: ({ path }) => path !== "/cms-preview",
  },
  pages: prerenderPages(),
}),
```

あわせて `inlineCss: true` を指定し、CSSをHTMLの中に埋め込みました。CSSファイルを別に取得しなくてよいので、レンダラーがCSSの取得を待つ必要がなくなります。ホームのHTMLは生で約157KB（gzipで約30KB）あり、そのうち約104KBがCSSです。

### Workerを通さずに返す

最初の構成では、prerenderしたHTMLがあるにもかかわらず、すべてのページでWorkerが先にリクエストを受けていました。そのため、せっかくのHTMLは使われず、リクエストのたびにページを描画し直していました。

現在は、対応するファイルがあればCloudflareがそのまま返すようにしました。Workerが先に動作するのは、管理画面、CMSの認証、リンクプレビュー、サーバー関数、CMSのプレビューだけになります。

```json title="wrangler.jsonc"
"assets": {
  "directory": "./dist",
  "binding": "ASSETS",
  // Prerendered pages and files are served straight from the asset layer.
  // Paths without an asset fall through to the Worker (TanStack Start SSR).
  "not_found_handling": "none",
  "run_worker_first": [
    "/admin", "/admin/", "/auth", "/callback",
    "/oauth/authorize", "/oauth/redirect",
    "/api/link-preview", "/_serverFn/*", "/cms-preview"
  ]
}
```

対応するファイルがないパスだけがWorkerに渡り、TanStack Startが404ページを描画します。

キャッシュは `public/_headers` で指定しました。ファイル名にハッシュが付くビルド成果物は1年間の `immutable`、ハッシュのないフォントや画像は1週間にしています。

```text title="public/_headers"
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/fonts/*
  Cache-Control: public, max-age=604800, stale-while-revalidate=86400
/images/*
  Cache-Control: public, max-age=604800, stale-while-revalidate=86400
```

## 2. JSの読み込みを描画の後にずらす

prerenderしたHTMLがあっても、`<script type="module">` がそのまま入っていると、ブラウザはすぐにJSの取得と実行を始めます。それにより、ハイドレーションが最初の描画を遅らせてしまいます。

そこで、HTMLを書き換えて、JSの読み込みを遅らせました。`modulepreload` のリンクを外し、`<script type="module">` の代わりに、最初の描画の後でそのJSを読み込むスクリプトを入れています。

```ts title="src/server/html/critical-html.ts"
function deferEntryModule(html: string): string {
  return html
    .replace(ASSET_PRELOAD, "")
    .replace(ASSET_MODULE, (_full, doubleQuoted: string, singleQuoted: string) =>
      deferredModule(doubleQuoted || singleQuoted),
    );
}
```

入れているスクリプトの中身を、展開すると次のとおりです。実際には1行に圧縮して埋め込み、ファイル名のハッシュはビルドのたびに変わります。

```ts
let started = false;

function start() {
  if (started) return;
  started = true;
  const script = document.createElement("script");
  script.type = "module";
  script.src = "/assets/index-xxxx.js";
  document.body.appendChild(script);
}

function afterLoad() {
  if (document.readyState === "complete") setTimeout(start, 0);
  else addEventListener("load", () => setTimeout(start, 0), { once: true });
}

const painted = performance.getEntriesByName("first-contentful-paint").length > 0;
if (painted) {
  afterLoad();
} else {
  const observer = new PerformanceObserver((list) => {
    if (list.getEntriesByName("first-contentful-paint").length === 0) return;
    observer.disconnect();
    afterLoad();
  });
  observer.observe({ type: "paint", buffered: true });
  setTimeout(start, 4000);
}
```

FCPが記録され、さらにloadイベントも終わってから、JSの読み込みを始めます。FCPが記録されない場合に備えて、4秒たったら読み込むよう保険もかけました。

最初は `requestAnimationFrame` で1フレーム待つだけでした。ところが、Chromeが最初のフレームを表示する前にこれが発火してしまい、ハイドレーションが最初の描画を遅らせる状況は変わりませんでした。そこで、FCPが記録されるのを待つ方式に変えました。

とはいえ、あくまで読み込みを遅らせただけで、残念ながらJSはあまり減っていません。

## 3. LCPの画像をpreloadする

一覧ページでは、最初に表示されるカードの画像が、LCPの候補になります。HTMLを読み進めた先で初めてこの画像が見つかるのでは遅いので、`<head>` でpreloadしています。

最初のカードの画像には、あらかじめ `fetchpriority="high"` を付けてあります。HTMLからその `<img>` を探し、同じファイルを指す `<link rel="preload">` を差し込む処理を追加しました。

```ts title="src/server/html/critical-html.ts"
function preloadLcpImage(html: string): string {
  const img = /<img\b[^>]*\bfetchpriority="high"[^>]*>/i.exec(html);
  if (!img) return html;
  const source = /\bsrc="([^"]+)"/.exec(img[0])?.[1];
  if (!source || source.startsWith("data:")) return html;
  const srcSet = /\bsrcset="([^"]+)"/i.exec(img[0])?.[1];
  // Preload only the mobile candidate. imagesrcset also fetched the full file.
  const href = srcSet?.split(",")[0]?.trim().split(/\s+/)[0] || source;
  if (html.includes(`href="${href}"`)) return html;
  const link = `<link rel="preload" as="image" href="${href}" fetchpriority="high"/>`;
  if (html.includes("</style>")) return html.replace("</style>", `</style>${link}`);
  return html.replace("</head>", `${link}</head>`);
}
```

たとえば `/works` のHTMLには、次のリンクが入ります。

```html
<link rel="preload" as="image" href="/works/meltype-800.webp" fetchpriority="high"/>
```

`fetchpriority="high"` の画像がないページには、何も差し込みません。ホームは画像のpreloadをしていません。

## 4. フォントを使われた文字だけに分割する

日本語のWebフォントは、まるごと配信すると重くなります。そこでZen Maru Gothicは、Google Fontsからの配信をやめて自前で配信し、ビルド時に、実際に使われている文字だけを含むフォントへ分割しました。

使われている文字は、`src` のコードとMarkdownの記事から集めています。集めた文字は、ページごとに必要なスライスへ振り分けます。

```ts title="src/build/plugins/fonts/slices.ts"
const regular: Group[] = [
  { name: "home", text: joinText(home, "text"), critical: true },
  { name: "ui", text: joinText(corpus.sources, "text") },
  { name: "cards", text: corpus.labels + joinText(corpus.articles, "card") },
  ...articleGroups(corpus.articles, "full"),
];
```

スライスは、ホーム、共通のUI、一覧のカード、複数の記事で共通する文字、記事ごとの文字、の順に作ります。同じ文字は最初に使われたスライスにだけ入るので、重複しません。

生成される `@font-face` には `unicode-range` が付いています。そのため、ページが取得するのは、そのページで実際に使う文字を含むスライスだけです。

```css
@font-face {
  font-family: "Zen Maru Gothic";
  src: url(/assets/zen-maru-gothic-500-home-CFJwl4UT.woff2) format("woff2");
  font-weight: 500;
  font-display: swap;
  unicode-range: U+3042, U+3044, U+3046, /* ... */;
}
```

ホームで最初に必要になるスライスは、`<head>` でpreloadしています。太字のホーム用スライスは小さいので、ファイルにせず、データURLとしてCSSに埋め込みました。

Next.jsにはnext/font があり、これらの処理をある程度自動でやってくれるためTanstackでも欲しいものです。

## 5. 画像を軽くする

画像はWebPにし、幅の広いものにはスマホ向けの800px版を用意しました。

```ts title="src/shared/lib/images/sources.ts"
export function responsiveSources(src: string) {
  const size = imageSize(src);
  if (!size || size.width <= 900 || src.includes("scroll-demo")) return {};
  const compact = src.replace(/\.(webp|png|jpe?g)$/i, "-800.webp");
  return {
    src: compact,
    srcSet: `${compact} 800w, ${src} ${size.width}w`,
    sizes: "(min-width: 1024px) 960px, 100vw",
  };
}
```

`srcset` と `sizes` を指定してあるので、ブラウザが画面の幅に合う方を選びます。スマホなら800px版でおおよそ足ります。

PNGのスクリーンショットは、1枚が1MB前後のものもありました。WebPにすると、比較的小さかった `tauri-plugin-configurate` の画像でも、約100KBから約21KBになりました。

## 6. レイアウトのずれを抑える

スコアを下げる要因は、読み込みの遅さだけではなく、表示された後にレイアウトがずれること（CLS）も、スコアに響くため、次の3か所を直しました。

### ページ見出しの高さ

Works、Blogs、Memosのページ見出しは、以前は、ハイドレーションの後にJSで画面幅を測り、スマホとPCで高さを切り替えていました。そのため、スマホでは表示後に約80pxずれていました。

今は、スマホ用とPC用のパターンを両方ともHTMLに入れておき、高さはTailwindのブレークポイントで決めています。

```tsx title="src/shared/components/page-hero/page-hero.tsx"
<section
  className="relative -mt-20 ml-[calc(50%-50dvw)] h-60 w-dvw overflow-hidden bg-background md:h-80"
>
  <div className="md:hidden">
    <Pattern height={HERO_HEIGHT_COMPACT} />
  </div>
  {/* ... */}
</section>
```

### 入場アニメーション

ページが表示されるときのアニメーションは、`opacity: 0` から始まっていました。そのせいで、最大のコンテンツが見えるのが遅れ、レイアウトもずれていました。

そこで、最初のページ表示では再生せず、サイト内でページを移動したときだけ再生するようにしました。

```diff title="src/app/styles.css"
 @media (prefers-reduced-motion: no-preference) {
-  .slide-enter,
-  .slide-enter-content > * {
+  .is-transition .slide-enter,
+  .is-transition .slide-enter-content > * {
     animation: slide-enter 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
```

`is-transition` クラスは、ルートが実際に切り替わったときに付与します。URLは、次のページの準備ができる前に変わってしまうため、URLではなく、切り替わりが確定したルートで判定しています。

### 画像とロゴの大きさ

本文中の画像には、大きさの表（`src/shared/lib/images/sizes.ts`）から `width` と `height` を渡しています。これで、画像を読み込む前から表示する場所を確保できます。フッターのロゴにも、幅を明示しました。

## おわりに

ほかにも、テーマ切り替えのGSAPをボタンに触れるまで読み込まない、ホームでGitHubのスター数を先読みしない、といった細かい調整をしました。それでも、フレームワークを使っているとモバイルで100点にするのはなかなか大変ですね。

特に、Reactは個人的には使いやすいと思っているものの、バンドルされているものが多いため、結局JSバンドルの肥大化によりスコアが落ちるといった問題が起きました。Tanstack Redactを導入したところ、割といいかなという感じですが、それでも警告レベルで大きいので次回の選定はどうしようかなという感じです。  
また、Vueに戻ろうかな...なんてうっすら思い始めてます。2年ぐらい離れていた間に周辺の機能がかなり豊富になっていて興味はあるんですが...

一旦今回はここで区切りをつけておきます。

ついでに宣伝も。shadcn-m3eというOSSのUIライブラリを作りました。

https://shadcn-m3e.crystaworld.dev/

shadcn/ui でMaterial 3 Expressiveを扱えるようにしたものです。現在79コンポーネントありますので是非使ってみては👀

また、この辺の背景についてもブログで書いていこうと思います。それではまた👋
