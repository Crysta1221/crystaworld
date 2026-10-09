---
title: NIIPS（長野高専 デジタルサイネージ）
category: Desktop Application
date: 2026-07
image: /works/niips.webp
images:
  - /works/niips.webp
  - /works/niips-weather.webp
  - /works/niips-arch.webp
  - /works/niips-design-v1.webp
  - /works/niips-design-v2.webp
tags:
  - Tauri
  - Rust
  - React
  - TypeScript
  - Tailwind CSS
  - shadcn/ui
  - Bun
  - Discord
  - Webhook
links:
  - label: 開発秘話（X）を見る
    url: https://x.com/cr1sta_dev/status/2094729172623229322
  - label: 登壇スライドを見る
    url: https://speakerdeck.com/crysta1221/kousen-kyaria-lt-happyou-naiyou
---

NIIPS（ニープス）は、Nagano Kosen Integrated Information Panel System の略で、長野高専の校内に設置するデジタルサイネージです。最寄り駅の発車時刻と、徒歩・自転車・バスで間に合うかどうか、天気予報と注意報・警報、ニュースを1台のディスプレイで表示します。所属する部活の顧問から「うちの高専でもサイネージを出したい」と提案されたことがきっかけで、2026年の春休みにモックアップを作り始めました。

> [!NOTE] 開発の経緯とデザインの変遷は、[X の記事](https://x.com/cr1sta_dev/status/2094729172623229322)にまとめています。高専キャリア夏の全国大会の LT で発表した内容は、SpeakerDeck でも公開しています。

## システム構成

![NIIPS のシステム構成図](/works/niips-arch.webp)

実機は Raspberry Pi（メモリ 8GB）で動かすため、Windows 向けの構成は使えません。デザインの自由度と開発コストの両方を考えて、Tauri 2 と React 19 を組み合わせました。Electron よりメモリ使用量を抑えられることと、Linux 上の WebKitGTK への負荷が小さいことも採用の理由です。

| 領域 | 採用技術 |
| :-- | :-- |
| デスクトップ基盤 | Tauri 2, Rust |
| UI | React 19, Tailwind CSS v4, shadcn/ui |
| 設定の保存 | [tauri-plugin-configurate](/works/tauri-plugin-configurate)（自作の設定ファイル管理プラグイン） |
| 開発ツール | Bun, Oxc（oxlint / oxfmt）, TypeScript, Vite+ |
| 通知 | Discord Webhook |

外部データは次の方針で取得しています。

- **天気**: Open-Meteo を主に使い、無料版の障害に備えて Met Weather API（ノルウェー気象研究所）をフォールバックにしています。
- **注意報・警報**: 気象庁が公開している JSON をもとに、負荷がかからないよう気を付けながら配信しています。
- **ニュース**: Google News の RSS を取得して表示します。
- **障害通知**: システムでエラーが起きたときは Discord へ Webhook で通知し、いつ・どこで止まったかを後から追えるようにしています。

## デザインの変遷

既存の表示システムを参考にしながら、時刻表は3版を作りました。

### Ver1: 発車標に寄せたデザイン

![Ver1 の時刻表](/works/niips-design-v1.webp)

首都圏の駅にある LCD 発車標を参考にしたデザインです。実物とほぼ同じ見た目になるほど寄せましたが、似すぎていたことと、最低要件だった「徒歩・自転車・バスで間に合うかどうかが分かること」を満たせなかったため、採用を見送りました。

### Ver2: 間に合うかどうかを加えたデザイン

![Ver2 の時刻表](/works/niips-design-v2.webp)

長野駅で今年から始まったバス発車時刻表のデザインをもとに実装し、間に合うかどうかの部分は、JR 東日本の「空席案内ディスプレイ」を参考にしました。ただし、1画面に上り・下りのどちらか一方しか表示できないため、これも見送りました。

### Ver3（最終版）: 上り・下りを1画面に

![Ver3 の時刻表](/works/niips.webp)

種別の見せ方は JR 東日本の LCD を参考にしつつ、上り・下りの両方を1画面に載せました。最寄り駅は3駅あるため、方面別に分けると6枚になるところが3枚で済みます。

### 天気画面

![天気画面](/works/niips-weather.webp)

首都圏の電車内で見られる「Train TV Weather+」のデザインがベースです。今日・明日の天気予報の画面に、週間天気などの情報も加えたため、見た目は大きく変わりました。
