# Crystaworld

くりすたのポートフォリオサイトです。TanStack Start（React）でページを prerender し、Cloudflare Workers から配信します。記事は Markdown で書き、Sveltia CMS（`/admin`）から編集できます。

## コマンド

| コマンド | 内容 |
| --- | --- |
| `bun install` | 依存パッケージを入れる |
| `bun run dev` | 開発サーバー（http://localhost:3000） |
| `bun run build` | 本番ビルド（`dist/` に出力。全ページを prerender） |
| `bun run preview:cf` | ビルドして Cloudflare Workers と同じ環境で確認 |
| `vp lint` / `bunx tsc --noEmit` | Lint と型チェック（変更後は必ず両方通す） |

CMS のログインをローカルで試すときは `.dev.vars.example` を `.dev.vars` にコピーして値を入れます。

## ディレクトリ構成

```
crystaworld/
├─ src/
│  ├─ routes/        URL と 1 対 1 のファイル。中身は薄く、features を呼ぶだけ
│  ├─ features/      ページや機能ごとのコード（下の表を参照）
│  ├─ shared/        複数の feature で使う部品
│  │  ├─ components/
│  │  │  ├─ layout/     ヘッダー・フッター・AppContainer・トップへ戻るボタン
│  │  │  ├─ markdown/   記事本文の描画（見出し・目次・コード・リンクカード）
│  │  │  ├─ media/      画像とカード（ContentImage, PostMediaCard）
│  │  │  ├─ page-hero/  一覧ページ上部の大見出しと背景パターン
│  │  │  ├─ post-index/ Blogs / Memos 一覧の検索・絞り込み
│  │  │  └─ ui/         shadcn ベースの汎用 UI（Button など）
│  │  └─ lib/
│  │     ├─ highlighting/ コードのシンタックスハイライト（Shiki）
│  │     ├─ images/       画像サイズ表とレスポンシブ画像
│  │     ├─ link-preview/ リンクカードのデータ取得
│  │     ├─ markdown/     frontmatter の読み取り・見出し抽出など
│  │     ├─ scroll/       ページ先頭・アンカーへのスクロール
│  │     ├─ site.ts       サイト名・URL などの定数
│  │     └─ utils.ts      cn()（クラス名の結合）
│  ├─ app/           アプリの土台
│  │  ├─ root/          <html> の枠・共通レイアウト・<head> の設定
│  │  ├─ providers.tsx  テーマと言語の Provider
│  │  ├─ styles.css     全体のスタイル（Tailwind）
│  │  └─ fonts.css      Zen Maru Gothic（本番ではビルド時にサブセットへ置き換え）
│  ├─ contents/      記事などの Markdown（CMS がここを編集する）
│  │  ├─ works/ blogs/ memos/   各記事
│  │  └─ tech-tags/ tags/ categories/   タグやカテゴリの定義
│  ├─ server/        Cloudflare Worker（本番のリクエスト処理）
│  │  ├─ site.ts        Worker の入口
│  │  ├─ cms-auth.ts    CMS の GitHub ログイン（/auth, /callback）
│  │  ├─ link-preview/  /api/link-preview
│  │  └─ html/          HTML の最適化（JS の読み込みを初回描画の後へ）
│  ├─ build/         ビルド時だけ動くコード（ブラウザには届かない）
│  │  ├─ plugins/fonts/          フォントをページごとにサブセット化
│  │  ├─ plugins/og/             OG 画像（SNS 共有用カード）の生成
│  │  ├─ plugins/dev-middleware/ 開発サーバーで /admin と /api を動かす
│  │  └─ prerender-pages.ts      prerender するページの一覧
│  ├─ router.tsx     ルーターの設定（404 ページの指定もここ）
│  ├─ start.ts       TanStack Start の設定
│  └─ routeTree.gen.ts  自動生成（編集しない）
├─ public/           そのまま配信するファイル
│  ├─ admin/         CMS（Sveltia）の画面と設定 config.yml
│  ├─ works/ blogs/ memos/   記事の画像（CMS のアップロード先）
│  ├─ images/        アバター・ロゴ
│  ├─ logos/ socials/ flags/ gears/   アイコン類
│  ├─ fonts/         Natadecoco（英字フォント）
│  └─ _headers       キャッシュ設定
├─ design/           デザインファイル（design.pen とその素材）
├─ vite.config.ts    ビルド設定
└─ wrangler.jsonc    Cloudflare Workers の設定
```

### features の中身

| フォルダ | 内容 |
| --- | --- |
| `home/` | トップページ（自己紹介・スキル・経歴・SNS など） |
| `works/` | Works 一覧と詳細 |
| `blogs/` | Blogs 一覧と詳細 |
| `memos/` | Memos 一覧と詳細 |
| `articles/` | Works / Blogs / Memos の Markdown を読むサーバー関数と、記事ページの `<head>` |
| `cms-preview/` | CMS の編集画面に出すプレビュー（`/cms-preview`） |
| `not-found/` | 404 ページ |
| `locale/` | 日本語 / 英語の切り替え |
| `theme/` | ライト / ダークの切り替え |
