---
title: shadcn M3E
category: Library / Plugin
date: 2026-10
image: /works/shadcn-m3e.webp
images:
  - /works/shadcn-m3e.webp
  - /works/shadcn-m3e-components.webp
  - /works/shadcn-m3e-theme.webp
tags:
  - React
  - Tailwind CSS
  - TypeScript
  - shadcn/ui
  - Bun
links:
  - label: ドキュメントを見る
    url: https://shadcn-m3e.crystaworld.dev
  - label: GitHubを見る
    url: https://github.com/Crysta1221/shadcn-m3e
---

shadcn M3E は、shadcn/ui のコンポーネントを Material 3 Expressive（M3E）のスタイルで作り直したオープンソースのコンポーネント集です。サイズ・形・色・モーション・タイポグラフィを M3E の仕様に合わせています。shadcn/ui と同じく、コードを自分のプロジェクトへコピーして使います。

## 主な特徴

### 1. shadcn/ui の全コンポーネントを M3E 化

Button、Dialog、Select、Tabs など、shadcn/ui のコンポーネントは API をそのままに、M3E のサイズ・形・色・スプリングのモーション・リップルを加えました。使い方は `@/components/ui/*` を `@/components/m3e/*` に置き換えるだけです。

```tsx
import { Button } from "@/components/m3e/button";

<Button>Filled</Button>
<Button variant="tonal" size="lg" shape="square">Tonal</Button>
```

![Button と FAB の表示例](/works/shadcn-m3e.webp)

### 2. shadcn/ui にない M3E のコンポーネント

ナビゲーションバーとレール、アプリバー、ツールバー、FAB と FAB メニュー、スプリットボタン、チップ、検索、カルーセル、時刻ピッカー、ローディングインジケーター、波形のプログレスなどを追加しています。コンポーネントは合計 79 個です。

![コンポーネント一覧のページ](/works/shadcn-m3e-components.webp)

### 3. ダイナミックカラー

Google の `material-color-utilities` で、シードカラーまたは画像からテーマを生成します。画像からの色の抽出には `node-vibrant` を使っています。ライト・ダークと、3段階のコントラストに対応し、生成した CSS はそのままコピーして使えます。

![Theme ページ](/works/shadcn-m3e-theme.webp)

### 4. 仕様に沿ったトークン

サイズ・形・タイポグラフィ・モーションの値は、目分量ではなく Compose Material3 のトークンファイルから取り込みました。M3 と M3E で食い違う部分は、M3E に合わせています。

## 構成

| 領域 | 採用技術 |
| :--- | :--- |
| UI | React 19, Base UI |
| スタイリング | Tailwind CSS v4 |
| 配布 | shadcn registry（`@m3e/<name>`） |
| 色の生成 | material-color-utilities, node-vibrant |
| 開発環境 | Bun workspace, Vite, TypeScript, oxlint, oxfmt |

コンポーネント、デザイントークンと Tailwind のユーティリティ、そのドキュメントサイトを1つのモノレポで管理しています。ドキュメントサイトは shadcn registry の配信も兼ねています。ライセンスは MIT です。
