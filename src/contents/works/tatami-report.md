---
title: 畳サーバー 報告プラグイン
category: Game Plugin
date: 2025-08
image: /works/tatami-report.png
images:
  - /works/tatami-report.png
  - /works/tatami-report-2.png
  - /works/tatami-report-3.png
tags:
  - Minecraft
  - Kotlin
  - Paper API
  - Discord
  - Webhook
  - Velocity
links:
  - label: 畳サーバーを見る
    url: https://tatamiserver.com/
  - label: GitHubを見る
    url: https://github.com/crystaworld/TatamiReport
---

Minecraftのマルチサーバーネットワーク「畳サーバー（TatamiServer）」において、プレイヤーがゲーム内から悪質なプレイヤーや迷惑行為、不具合を直感的に通報・報告できるように設計したクロスサーバー対応の報告プラグイン（`TatamiReport`）です。

チャット欄に複雑なコマンドを手入力する必要なく、インベントリGUIや本UI、金床入力による親切なウィザード形式で通報を行えるユーザー体験と、誤送信や虚偽報告を防止する2段階の確認プロセスを兼ね備えています。

## アーキテクチャ設計（マルチモジュール構成）

ネットワーク全体を横断する報告機能を実現するため、Gradleによるマルチモジュール構成を採用し、プロキシ側と各バックエンドサーバー側で責務を明確に分離しました。

| モジュール | 役割と責務                                                                                                                      |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------ |
| `common`   | プロキシとバックエンドで共有する設定管理（Configurate YAML）、非同期タイムアウト管理、Discord Webhookクライアント               |
| `velocity` | Velocityプロキシ上で動作。`/report` コマンド処理、全サーバーのプレイヤー状態集約、保留セッション管理、スタッフ通知、Webhook送信 |
| `spigot`   | 各バックエンドサーバー（Paper/Spigot）上で動作。プレイヤーのGUI表示（頭アイテム一覧、本UI、金床文字入力）を担当                 |

### Plugin Messaging Channel によるクロスサーバー通信

Velocityプロキシと各Spigotサーバー間は、独自のPlugin Messaging Channel（`tatami:report`）を介して双方向にメッセージを送受信しています。プレイヤー一覧のリクエストやGUI表示のトリガー、入力された理由データの受け渡しなどをリアルタイムかつ非同期に仲介します。

## 通報フローと画面構成

### 1. プレイヤー選択GUI

![プレイヤー選択GUI](/works/tatami-report.png)

`/report` コマンドを実行すると、Triumph GUIを活用した6行（45スロット）のページネーション付きインベントリ画面が開きます。ネットワーク内のオンラインプレイヤーがスキン頭部アイテム（`PLAYER_HEAD`）として並び、ツールチップ（Lore）で現在の接続サーバー名を確認できます。対象が特定できない状況を考慮し、「プレイヤーが不明な場合（エンダーアイ）」のボタンも用意しています。

### 2. 通報カテゴリ選択本

![通報カテゴリ選択本](/works/tatami-report-2.png)

プレイヤーを選択すると、Adventure APIの `Book` を利用した本UIが開きます。「チート・ハッキング」「チャット上の暴言・スパム」「VCでの暴言・スパム」「サーバー内の荒らし行為」「嫌がらせ行為」「妨害行為・チーミング」「その他」などのカテゴリがクリック可能リンクとして並び、ワンクリックで次のステップへ進みます。

### 3. 金床UIによる通報理由入力

![金床UIによる理由入力](/works/tatami-report-3.png)

カテゴリ選択後、AnvilGUIを活用した金床の文字入力インターフェースが起動します。チャット欄を汚すことなく、GUI上で直接キーボードから詳細な通報理由を入力できます。

## 誤通報防止と安全設計

通報システムにおける重要な課題の一つが「誤送信」や「いたずら・虚偽報告」の防止です。TatamiReportでは以下の安全機構を組み込みました。

> [!NOTE]
> **30秒の確認猶予とタイムアウト管理**
> 金床での理由入力完了後、チャット上に確認メッセージが表示されます（「虚偽の報告を行うと処罰される場合があります」「30秒以内に `/report confirm` を実行してください」）。`ScheduledExecutorService` により30秒間の保留（Pending）タイマーが管理され、時間内に確認されなかった場合は自動的にキャンセルされます。

> [!IMPORTANT]
> **多重送信防止とセッション制御**
> 保留中の通報がある間は新たな通報を開始できないよう制限し、確定時にはアトミックにセッションを取り出す（`take`）ことで、ネットワーク遅延や連打による多重送信を確実に防止しています。

## スタッフ通知 & Discord Webhook 連携

通報が確定すると、ゲーム内とDiscordの両方へ即座に情報が連携されます。

- **ゲーム内通知**: サーバー内にいる運営スタッフ（`tatamireport.notify` 権限所持者）に対し、MiniMessage形式で装飾された通報内容（通報者、通報対象、カテゴリ、理由、発生サーバー）が一斉通知されます。
- **Discord Webhook**: Fuel HTTPクライアントを通じてDiscordの運営チャンネルへリッチなEmbed形式で通知。オフラインの運営スタッフも即座に状況を把握し、素早いモデレーション対応を行うことができます。

## 技術スタック

| 分野           | 採用技術                                                 |
| :------------- | :------------------------------------------------------- |
| 言語           | Kotlin 2.2 (JVM 21)                                      |
| プロキシAPI    | Velocity API 3.4                                         |
| サーバーAPI    | Paper API 1.21.4 (Spigot / Paper)                        |
| GUI・UI        | Triumph GUI, AnvilGUI, Adventure API (MiniMessage, Book) |
| サーバー間通信 | Minecraft Plugin Messaging Channel (`tatami:report`)     |
| 設定管理       | Configurate (YAML / Kotlin Extension)                    |
| ネットワーク   | Fuel HTTP Client (Discord Webhook)                       |
| ビルドツール   | Gradle (Kotlin DSL), Shadow Plugin                       |
