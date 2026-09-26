---
title: tauri-plugin-configurate
category: Library / Plugin
date: 2026-07
image: /works/tauri-plugin-configurate.png
images:
  - /works/tauri-plugin-configurate.png
tags:
  - Tauri
  - Rust
  - TypeScript
  - Bun
links:
  - label: GitHubを見る
    url: https://github.com/Crysta1221/tauri-plugin-configurate
  - label: crates.io
    url: https://crates.io/crates/tauri-plugin-configurate
  - label: npm
    url: https://www.npmjs.com/package/tauri-plugin-configurate-api
---

Tauri v2 アプリケーション向けに設計された、型安全な設定ファイル管理プラグインです。Rust 製コアによる高信頼なファイル I/O と、TypeScript 側の強力なスキーマ検証・型推論を統合し、デスクトップアプリにおけるユーザー設定や機密情報の取り扱いをシンプルかつ安全にします。crates.io および npm にてオープンソースとして公開されています。

## 主な特徴

### 1. OS キーリング（認証情報ストア）とのネイティブ連携

API キーやデータベースの接続パスワードなどの機密データを、通常の平文設定ファイルに保存するのではなく、OS ネイティブの安全なストレージ（Windows Credential Manager / macOS Keychain / Linux Secret Service）に分離して自動暗号化保存（ロック/アンロック）できます。

### 2. 複数のファイルフォーマット対応

用途や好みに応じて選べるプロバイダーを提供しています。

- **JSON (`JsonProvider`)**: 最も標準的な設定フォーマット
- **YAML (`YmlProvider`)**: 人間が読みやすくコメントも維持しやすいフォーマット
- **TOML (`TomlProvider`)**: Rust エコシステムと親和性の高い設定形式
- **Binary (`BinaryProvider`)**: 高速なバイナリ形式。パスワード暗号化（Argon2 KDF）や高エントロピー鍵（SHA-256 KDF）による暗号化保存に対応

### 3. 型安全なスキーマ定義

TypeScript 上で `defineConfig` を用いてスキーマを定義することで、読み込み時や書き込み時に厳格な型推論とバリデーションが自動的に効くようになります。

```typescript
import {
  BaseDirectory,
  Configurate,
  JsonProvider,
  defineConfig,
  keyring,
} from "tauri-plugin-configurate-api";

const schema = defineConfig({
  theme: String,
  database: {
    host: String,
    password: keyring(String, { id: "db-password" }),
  },
});

const config = new Configurate({
  schema,
  fileName: "app.json",
  baseDir: BaseDirectory.AppConfig,
  provider: JsonProvider(),
});

const KEYRING = { service: "my-app", account: "default" };

// 保存（パスワードは OS キーリングへ自動退避）
await config
  .create({
    theme: "dark",
    database: { host: "localhost", password: "secret" },
  })
  .lock(KEYRING)
  .run();

// 読み込み（OS キーリングから複合して展開）
const { data } = await config.load().unlock(KEYRING);
```

### 4. 堅牢なセキュリティとアトミック書き込み

- **アトミック更新**: `tempfile` を用いたアトミックなファイル置換処理により、保存中の予期せぬクラッシュや電源断による設定破損を防止。
- **サンドボックス制限**: `BaseDirectory` によるアクセス可能ディレクトリの制限を設け、パストラバーサルやアプリ外ファイルへの不正アクセスを遮断。
- **ファイル監視（File Watching）**: 外部エディタによる設定変更を検知して自動反映するイベント駆動設計。

## 技術仕様

| 分野                         | 採用技術                                                                     |
| :--------------------------- | :--------------------------------------------------------------------------- |
| コア言語                     | Rust (2021 edition, 1.85+)                                                   |
| プラットフォーム             | Tauri v2 Plugin Architecture                                                 |
| 対応OS                       | Windows, macOS, Linux (デスクトップ専用)                                     |
| フロントエンドバインディング | TypeScript, Rollup, npm / bun                                                |
| 暗号化 & セキュリティ        | OS Keyring (keyring-rs), Argon2, tempfile                                    |
| パッケージ配信               | crates.io (`tauri-plugin-configurate`), npm (`tauri-plugin-configurate-api`) |
