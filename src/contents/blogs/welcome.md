---
title: Crystaworld へようこそ
date: 2026-09
tags:
  - React
  - TypeScript
  - Tailwind CSS
---

ポートフォリオサイト「Crystaworld」の技術スタックと、Markdown 表現のサンプル記事です。

## このサイトについて

Crystaworld は、モダンな Web フロントエンド技術を活用して制作されたポートフォリオです。高速なページ読み込みと滑らかな画面遷移、直感的な UI インタラクションを重視しています。

> [!NOTE]
> このサイトでは **Catppuccin** の配色をベースに、ライトテーマとダークテーマの両方で読みやすいコントラストを追求しています。

### 主な技術スタック

以下のモダンなライブラリやツールで構築されています。

* **フレームワーク:** React 19 + Vite+ (`vp`)
* **ルーティング:** TanStack Router (File-based Routing)
* **スタイリング:** Tailwind CSS v4 + tw-animate-css
* **アニメーション:** GSAP + CSS Staggered Entrance
* **シンタックスハイライト:** Shiki (Catppuccin Themes)

> [!TIP]
> コードブロックは右上のボタンをクリックすることで、ワンタップでクリップボードにコピーできます。

## コードハイライトの例

TypeScript の `satisfies` 演算子と Shiki の行番号表示・ハイライトの例です。

```typescript filename="config.ts"
interface SiteConfig {
  name: string;
  url: string;
  features: string[];
}

export const siteConfig = {
  name: "Crystaworld",
  url: "https://crysta.dev",
  features: ["Works", "Blogs", "Memos"],
} as const satisfies SiteConfig;
```

### Git の差分 (diff) 表示

差分表示にも対応しており、追加行と削除行がハイライトされます。

```diff filename="package.json"
- "version": "0.1.0",
+ "version": "1.0.0",
```

## 比較表のサンプル

GFM テーブル記法による比較例です。

| 機能 | 従来のアプローチ | Crystaworld |
| :--- | :--- | :--- |
| **ルーティング** | フルページリロード | TanStack Router (SPA) |
| **ページ遷移** | 唐突な切り替え | ピル連動 + Stagger アニメーション |
| **コード表示** | 静的テキスト | Shiki 遅延ハイライト + 行番号 |
