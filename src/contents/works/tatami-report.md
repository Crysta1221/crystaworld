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
  - label: プロジェクトを見る
    url: https://tatamiserver.com/
---

プレイヤーの報告や不具合を、ゲーム内から送れるようにするプラグインです。

## 構成

畳サーバーは Velocity で複数のサーバーへ接続しているため、Velocity 用と Paper 用に分けて開発しました。送られた内容は、特定の権限を持つプレイヤーへゲーム内で通知し、同時に Discord の Webhook でチャンネルへ送ります。
