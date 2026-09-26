---
title: 文化祭 屋台POSシステム
category: Web Development
date: 2025-10
image: /works/festival-pos.webp
images:
  - /works/festival-pos.webp
  - /works/festival-pos-login.webp
  - /works/festival-pos-2.webp
  - /works/festival-pos-3.webp
  - /works/festival-pos-arch.webp
tags:
  - Bun
  - React
  - Next.js
  - Tailwind CSS
  - TypeScript
  - shadcn/ui
  - Jotai
  - NextAuth.js
  - Valibot
  - Biome
  - Google Sheets
  - Vercel
  - GitHub Actions
links:
  - label: プロジェクトを見る
    url: https://github.com/Crysta1221/nnct5s_pos_2025
  - label: Qiita記事を見る
    url: https://qiita.com/Crysta1221/items/892f213731065819422c
---

文化祭（工嶺祭）のクラス屋台で利用するため、開催4日前に急遽開発がスタートしたPOSシステムです。わずか3日間で設計から実装までを行い、Next.jsによるPWA（Progressive Web Apps）として構築しました。個人のスマートフォンやタブレットのブラウザから直接起動できるため、各OS向けにアプリを個別配布することなく即座に現場へ展開できるようにしました。

## システムアーキテクチャ & 技術スタック

![システム構成図](/works/festival-pos-arch.webp)

自前のデータベースサーバーを持たず、無料で運用コストを抑えること、および事前予約がもともとGoogleフォームで集約されていたことから、データの保存先にはGoogleスプレッドシートを採用しました。フロントエンドとスプレッドシート間はGoogle Sheets APIを介してNext.jsのRoute Handlersから連携しています。

| レイヤー | 使用技術 |
| --- | --- |
| フロントエンド | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Jotai, next-pwa, Lucide Icons |
| バックエンド | Next.js Route Handlers, NextAuth.js (v5), Valibot, googleapis (Google Sheets API) |
| データベース | Google Sheets (注文一覧・予約リスト) |
| ツール & CI/CD | Bun, Biome, Vercel, GitHub Actions |

## 画面構成と主要機能

### 1. 認証（ログイン画面）

![ログイン画面](/works/festival-pos-login.webp)

POSシステムとして売上データや注文履歴を扱うため、データの安全性を担保すべくNextAuth.js（Credentialsプロバイダー + JWTセッション）による独自のログイン認証を実装しました。データベースを必要としない軽量な構成とし、ユーザーIDの検証にはValibotを用いて1〜100の有効な整数値のみを受け付けるようにバリデーションを行っています。タッチ操作を想定し、テンキーのような大きめの入力インターフェースを採用しました。

### 2. メニュー画面

![メニュー画面](/works/festival-pos.webp)

ログイン後は、「POS起動（購買）」「注文管理」「売上管理」「予約情報」へワンタップで遷移できるダッシュボードを配置しました。現場での素早いオペレーションを支えるため、画面遷移のネストを極力浅くし、押しやすいよう大きめなボタンでレイアウトしています。

### 3. 購買管理・会計画面

![購買管理画面](/works/festival-pos-2.webp)

左側に商品選択パネル、右側にカート（追加アイテム一覧）を配置したPOSインターフェースです。現金のほか、文化祭特有のグルメチケット（1枚100円、11枚綴り1,000円）の会計処理にも対応し、支払い方法を選択して即座に合計金額と内訳を計算できます。

### 4. 厨房向け注文管理画面

![注文管理画面](/works/festival-pos-3.webp)

厨房スタッフがリアルタイムで調理状況を把握できるよう、未完了の注文一覧や各商品の必要個数（あんこ、カスタード、リンゴジャム等）、事前予約分の注文を一覧表示するモニタリング画面を提供しました。

## 実装のポイント

### Google Sheets API との型安全な連携

Route HandlersでGoogle Sheets APIを呼び出し、取得した行データをTypeScriptの型定義（`Order`）に安全にマッピングしてフロントエンドへ返却しています。

```typescript
export interface Order {
  orderNumber: string;
  anko: number;
  custard: number;
  appleJam: number;
  orderDate: string;
  deliveryStatus: string;
  preOrder: boolean;
  subtotal: number;
  couponUsed: boolean;
  totalAmount: number;
  reservationNumber: string;
}

export async function GET(request: NextRequest) {
  try {
    const spreadsheetId = process.env.SPREAD_SHEET_ID;
    const sheets = getGoogleSheetsClient();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: "order_list!A2:K",
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return NextResponse.json([]);
    }

    const orders: Order[] = rows.map((row: string[]) => ({
      orderNumber: row[0] || "",
      anko: Number.parseInt(row[1] || "0"),
      custard: Number.parseInt(row[2] || "0"),
      appleJam: Number.parseInt(row[3] || "0"),
      orderDate: row[4] || "",
      deliveryStatus: row[5] || "",
      preOrder: row[6] === "TRUE" || row[6] === "true" || row[6] === "はい",
      subtotal: Number.parseInt(row[7] || "0"),
      couponUsed: row[8] === "TRUE" || row[8] === "true",
      totalAmount: Number.parseInt(row[9] || "0"),
      reservationNumber: row[10] || "",
    }));

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
```

### Valibot による入力値バリデーション

ユーザーIDはValibotのパイプライン機能を用いて数値変換と範囲チェックを行い、不正な入力をサーバーサイドで防止しました。

```typescript
const UserIdSchema = v.pipe(
  v.string(),
  v.transform(Number),
  v.number("ユーザーIDは数値である必要があります"),
  v.integer("ユーザーIDは整数である必要があります"),
  v.minValue(1, "ユーザーIDが無効です"),
  v.maxValue(100, "ユーザーIDが無効です"),
);
```

## 運用における課題と改善

短期間での開発だったこともあり、実際の運用現場でいくつかの課題に直面し、即座の改善と今後に向けた貴重な知見を得ました。

> [!NOTE]
> **要件定義と現場運用のすり合わせ**
> 当初は全工程をPOSシステムで管理する想定でしたが、文化祭当日に現場で紙の呼び出し番号札（1〜50番）と手書きの注文用紙が別途併用されていることが判明しました。システムの連番と紙の番号が一致せず現場に混乱が生じたため、1日目の夜に緊急改修を実施。POS上で任意の注文番号を手動指定できる入力方式へ変更し、2日目はスムーズな運用を実現しました。運用形態を事前に深くヒアリングすることの重要性を痛感した出来事でした。

> [!WARNING]
> **APIのレート制限と拡張性の課題**
> Google Sheets APIには「1分間に350リクエスト」のクォータ制限があります。ピーク時の混雑においてこの制限に達してしまい、一時的に注文受付を中断する場面がありました。高トラフィックが予想されるシステムでは、軽量な自前DB（PostgreSQLやMySQL等）で即座に保存し、スプレッドシートへの同期はバックグラウンドで行うアーキテクチャが適しているという教訓を得ました。

## 成果と導入効果

1日目に手作業や関数電卓で行われていた計算業務と比較し、2日目のPOS稼働後は商品のワンタップ計算によって会計時間が大幅に短縮され、混雑の緩和に貢献しました。また、事前予約の検索機能により、膨大なスプレッドシートを目視で探す手間がなくなり、現場のスタッフからも高い評価を得ることができました。
