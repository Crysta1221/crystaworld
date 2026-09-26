---
title: MoonCore
category: Desktop Application
date: 2026-09
image: /works/mooncore.png
images:
  - /works/mooncore-dashboard.png
tags:
  - Tauri
  - Rust
  - React
  - TypeScript
  - Tailwind CSS
  - Bun
  - Minecraft
  - Docker
links:
  - label: ウェブサイトを見る
    url: https://mooncore.crystaworld.dev
---

MoonCore は、Minecraft サーバーの運用・管理を統合的に行うための Windows 向けデスクトップアプリケーションです。ローカルマシン上で動くサーバーはもちろん、SSH 経由のリモートサーバー、Docker コンテナ、Pterodactyl Panel 配下のサーバーまで、異なる環境にあるサーバープロジェクトを単一の IDE ライクなワークスペースに集約して一元管理できます。

## 主な機能と特徴

### 1. 統合ダッシュボード & リアルタイムモニタリング

CPU使用率、メモリ消費量、ストレージ残量、オンラインプレイヤー数をリアルタイムの推移グラフで視覚的にモニタリングできます。サーバープロセスの起動・停止・再起動もワンクリックで操作可能です。

### 2. 多様なホスト環境のシームレスな統合

- **ローカル環境**: 自身のPC上で動作する開発用・プライベートサーバーの構築と即座のインポート。
- **リモート環境 (SSH)**: 外部のLinuxサーバーやVPS上にあるサーバーを安全に接続・操作。
- **Pterodactyl Panel**: ゲームサーバー管理パネル API と連携し、リモートノード上のサーバーをワークスペースへ統合。
- **Docker**: コンテナ化された Minecraft サーバーのライフサイクル管理。

### 3. 設定ファイル管理 & Monaco Editor

`server.properties` や Spigot / Paper / Velocity の設定、導入したプラグインやMODの設定ファイルをカテゴリ別に自動グループ化。組み込みの Monaco Editor により、IDE 感覚でシンタックスハイライト付きで直接編集・保存できます。

### 4. 拡張機能（プラグイン・MOD）の導入

Webブラウザを開いて手動で jar ファイルをダウンロードすることなく、アプリ内からプラグインやMODを検索し、ワンクリックでインストール・アップデートできます。

### 5. バックアップとスケジューリング

ワールドデータや設定ファイルの自動バックアップスケジュールを設定可能。手動バックアップや特定ファイルのみのバックアップ、ワンクリックでの世代復元に対応し、ワールド破損や事故から安全にデータを保護します。

## 技術アーキテクチャ

Bun workspaces によるモノレポ構成を採用し、デスクトップアプリ、公式サイト、配布用 API を一貫して開発・管理しています。

| 領域 | 技術スタック |
| :--- | :--- |
| デスクトップ基盤 | Tauri 2, Rust |
| フロントエンド | React 19, TypeScript, TanStack Router |
| UI & スタイリング | Tailwind CSS v4, Base UI, shadcn, Phosphor Icons |
| エディタ & ターミナル | Monaco Editor, Shiki, xterm.js |
| 配布・ライセンス基盤 | Cloudflare Workers, Polar, Tauri Updater |
| 公式サイト | React 19, TanStack Router, Tailwind CSS v4 |
