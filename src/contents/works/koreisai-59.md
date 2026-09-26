---
title: 第59回 工嶺祭
category: Web Development
date: 2024-10
image: /works/koreisai.webp
images:
  - /works/koreisai.webp
  - /works/koreisai-timetable-1.webp
  - /works/koreisai-timetable-2.webp
  - /works/koreisai-theme.webp
  - /works/koreisai-timebar.webp
  - /works/koreisai-scroll-demo.gif
tags:
  - React
  - Next.js
  - TypeScript
  - Tailwind CSS
  - Framer Motion
links:
  - label: プロジェクトを見る
    url: https://koreisai.tech/
  - label: Qiita記事を見る
    url: https://qiita.com/Crysta1221/items/95d24b07c1f0a28e3ceb
---

第59回工嶺祭（長野高専の文化祭）の外部向け公式特設Webサイトです。情報技術研究部（情技研）内で新設された「デジタル部門」の3名によるチームで開発を行いました。私は主に、来場者の利便性を左右する中心的な機能である「タイムテーブル」の設計・UIデザイン・実装を担当しました。

> [!NOTE]
> 同じドメインを翌年以降も継続して運用する仕様のため、2024年度の特設サイトは現在アーカイブとなっています。Wayback Machine等で当時のページが保存されている場合があります。

## サイト構成（サイトマップ）

来場者が求める情報に迷わずアクセスできるよう、以下の7ページ構成でサイトを展開しました。

- **トップページ (`/`)**: 文化祭のメインビジュアルと各コンテンツへのハブ
- **交通アクセスページ (`/access`)**: 会場までの交通案内とシャトルバス情報
- **クラス企画ページ (`/class-events`)**: 各クラスが実施する展示や催し物
- **学科企画ページ (`/department-events`)**: 各学科の専門展示・研究発表
- **タイムテーブルページ (`/timetable`)**: ステージイベントや企画の時間割（担当箇所）
- **ランタンイベントページ (`/local-events`)**: 夜の目玉企画であるランタンの案内
- **屋台ページ (`/stall-events`)**: 各種フード・模擬店の出店一覧

## 技術スタック

| 分野 | 採用技術 |
| --- | --- |
| 言語 | TypeScript, JavaScript |
| フレームワーク | React 18, Next.js 14 |
| スタイリング & UI | Tailwind CSS, Headless UI |
| アニメーション | Framer Motion |
| アイコン | Lucide Icons, Material Symbols |
| 日時管理 | Day.js |
| 開発管理・テスト | Git, GitHub, Storybook |

## タイムテーブルの設計と実装

タイムテーブルは「各会場で行われる多様なイベントを時間軸に沿って直感的に把握できること」を目標に設計しました。

### 1. レイアウト方式とデータモデリング

![プロトタイプ](/works/koreisai-prototype.webp)

時間軸（縦）と会場列（横）をFlexboxで並べ、各企画カードは開始・終了時刻から算出した位置へ動的に `absolute` 配置するアプローチを採用しました。データ構造は、日付ごとに複数の会場があり、会場ごとにイベントが連なる3階層の型定義で安全に管理しています。

```typescript
export interface TimeTableEvents {
  title: string;
  description: string;
  start: {
    hour: number;
    minute: number;
  };
  end: {
    hour: number;
    minute: number;
  };
}

export interface TimeTableEventsByVenue {
  id: number;
  name: string;
  events: TimeTableEvents[];
}

export interface TimeTableEventsByDate {
  id: number;
  name: string;
  eventsByVenue: TimeTableEventsByVenue[];
}
```

### 2. レスポンシブ対応と動的スケーリング

スマートフォンとPCでは最適な表示間隔が異なるため、画面幅（768px境界）を監視し、モバイル環境とデスクトップ環境で時間軸のスケールやカードの高さを動的に切り替える仕組みを導入しました。

```typescript
const [isSmallScreen, setIsSmallScreen] = useState(false);

useEffect(() => {
  const checkScreenSize = () => {
    setIsSmallScreen(window.innerWidth < 768);
  };

  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
  return () => window.removeEventListener("resize", checkScreenSize);
}, []);
```

### 3. テーマ「Infinite」に調和したUIデザイン

![テーマに合わせたデザイン](/works/koreisai-theme.webp)

第59回のテーマである「Infinite（無限）」と、宇宙をモチーフにしたキービジュアルの世界観を引き立てるため、カードの背景には微細な半透明のグラデーションを施し、ダークモードを基調とした洗練されたデザインに仕上げました。

### 4. 現在時刻バー（リアルタイムインジケーター）

![現在時刻バー](/works/koreisai-timebar.webp)

「いま何が行われているか」を一目で把握できるよう、Day.jsで取得した現在時刻と開催時間（9:00〜17:30）を比較し、リアルタイムに位置が更新される赤いインジケーターバーを実装しました。開催時間外（9:00前および17:30以降）はバーが画面外へ飛び出さないよう、開始・終了位置に固定するクリッピング処理を施しています。

### 5. スムーズな横スクロール操作

![横スクロール操作のデモ](/works/koreisai-scroll-demo.gif)

会場列が多く画面幅を超える場合でも、マウスホイールでの横スクロールが難しいPC環境に配慮し、ヘッダーに左右のスクロールボタンを設置しました。`useRef` を用いてスムーズスクロール（`element.scrollTo({ behavior: "smooth" })`）を実行し、スクロール位置が端に達した際はボタンを無効化する細やかな配慮を行っています。

### 6. 開催中・次回企画の自動ピックアップ

![開催中の企画表示](/works/koreisai-ongoing.webp)

タイムテーブルの上部には、現在時刻に基づいて「現在開催中の企画」と「次に始まる企画」を自動抽出し、リアルタイムに提示するウィジェットを設置しました。イベント開催前や終了後はステータスが「終了」に切り替わり、来場者がスムーズに次の目的地を決められるように工夫しました。

## こだわりの演出

### テーマに寄り添ったローディング

![ローディング演出](/works/koreisai-loading.webp)

サイトへの初回アクセス時には、テーマ「Infinite」にちなんで無限記号（∞）が滑らかに回転するカスタムローディングアニメーション（`react-loader-spinner` の InfinitySpin）を表示し、サイトへの期待感を高めました。

## 振り返りと学び

3名のチーム開発において、プルリクエストを通じたコードレビューやコンポーネント管理（Storybook）、細やかなコミットの積み重ねによって円滑な開発を進めることができました。また、複雑な動的レイアウトやリサイズ監視、アニメーション制御を通じてReactのライフサイクル（`useEffect`）や状態管理への理解を深める実践的な経験となりました。
