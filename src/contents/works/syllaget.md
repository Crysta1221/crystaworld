---
title: Syllaget
category: Web Development
date: 2026-02
image: /works/syllaget.png
images:
  - /works/syllaget.png
  - /works/syllaget-home.png
  - /works/syllaget-schools.png
  - /works/syllaget-list.png
  - /works/syllaget-detail.png
  - /works/syllaget-calc.png
  - /works/syllaget-arch.png
tags:
  - Bun
  - React
  - TypeScript
  - Tailwind CSS
  - shadcn/ui
  - TanStack Start
  - Hono
  - Cloudflare Workers
links:
  - label: サイトを見る
    url: https://syllaget.crystaworld.dev
---

**Syllaget** は、全国の高専（高等専門学校）のシラバスを横断して検索・閲覧できる Web アプリケーションです。学校・年度・学科・科目ごとに分散しがちな公式シラバスの情報を統一されたモダンな UI に集約し、授業計画や評価割合の確認、履修の検討をスムーズに行えるように設計しました。

## 主な機能と特徴

### 1. ホーム画面と直感的なナビゲーション

![ホーム画面](/works/syllaget-home.png)

トップ画面からシラバス検索・ブックマーク・評価計算ツールへ迷わずアクセスでき、最新のお知らせやアップデート情報も一覧で確認できます。

### 2. 学校・学科・年度別のシラバス検索とフィルタリング

![学校・年度・学科の選択](/works/syllaget-schools.png)

![シラバス一覧画面](/works/syllaget-list.png)

学校一覧から対象の高専・年度・学科を選択し、開講されている科目を一覧で素早く検索できます。専門／一般、必修／選択、学年、開講区分などの条件による絞り込みや並び替えに対応し、目的の科目へ迷わずたどり着けます。

### 3. 科目詳細のわかりやすい可視化

![科目詳細画面](/works/syllaget-detail.png)

科目の基本情報や週あたりの時間数、達成目標、授業計画、ルーブリック、モデルコアカリキュラムとの対応関係などをカード形式で整理して表示します。評価割合についてはグラフによる視覚化も行い、成績評価の比重を一目で把握できるようにしました。

### 4. ブックマーク & 成績評価計算ツール

![成績評価計算ツール](/works/syllaget-calc.png)

- **ブックマーク**: 気になる科目や履修中の科目をローカルに保存し、一覧からすぐに見返せます。
- **成績評価計算ツール (`/tools/subject-calc`)**: 対象科目の評価割合データを引き継ぎ、中間・期末試験などの得点から総合評価をシミュレーションできます。
- **PWA 対応**: モバイル端末のホーム画面に追加して、アプリ感覚で軽快にアクセスできます。

## システムアーキテクチャ & 技術スタック

![システム構成図](/works/syllaget-arch.png)

フロントエンド（`kosen-syllaget`）と API・データパイプライン（`kosen-syllaget-api`）を分離し、どちらも Cloudflare Workers 上のエッジ環境で動作する構成を採用しました。

### バッチスクレイピングと R2 による低コスト・高速配信

公式の高専 Web シラバスから Cheerio を用いて学校・学科・科目詳細を段階的にスクレイピングし、構造化した JSON データを Cloudflare R2 へ格納しています。API サーバー（Hono + `@hono/zod-openapi`）は R2 から直接 JSON を読み出して返却し、Cloudflare のエッジキャッシュ（`s-maxage=86400`）と組み合わせることで、データベースサーバーを持たずに高速かつ安定したレスポンスを実現しました。

| レイヤー | 使用技術 |
| :--- | :--- |
| フロントエンド | React 19, TanStack Start (SSR), TanStack Router, TanStack Query, TanStack Table, TypeScript |
| UI & スタイリング | Tailwind CSS v4, shadcn/ui, Base UI, Recharts, Lucide Icons |
| API サーバー | Hono, `@hono/zod-openapi`, Zod, Swagger UI, Cloudflare Workers |
| データ収集・保存 | Cheerio (HTML スクレイパー), Cloudflare R2 (S3 互換 API) |
| 開発ツール | Bun, Vite, Oxlint / Oxfmt, Vitest, Wrangler |
