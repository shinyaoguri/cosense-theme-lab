# cosense-theme-lab

A research-lab website from a public [Cosense](https://scrapbox.io) project. Members, research topics, publications, and news come from one Cosense project; deploys to GitHub Pages via GitHub Actions (cron, twice daily).

> **テンプレートリポジトリです。** テーマのコード（`theme/`）はこのリポジトリに同梱されており、**あなたのものとして自由に編集**できます。npm から取り込むのはフレームワーク（`@cosense-site-kit/*`）だけ。

## 立ち上げ（ブラウザだけ）

1. **「Use this template」** で自分のリポジトリを作成。
2. `cosense.config.ts` の `source.project` を自分の公開 Cosense プロジェクト名に変更。
3. **Settings → Pages → Source** を **「GitHub Actions」** に。
4. **Actions → Build and deploy → Run workflow** を実行（以降は cron）。

サブパス公開（`<user>.github.io/<repo>/`）なら `cosense.config.ts` の `site.base` に `"/<repo>"` を設定。

## テーマをカスタムする

見た目と構造は `theme/` にあります（fork して所有しているので直接編集可）:

- `theme/components/Layout.astro` `Header.astro` `Footer.astro` — 枠と配色（CSS は `theme/styles/global.css`）
- `theme/templates/` — `/research`・`/news` などのページ
- `theme/lib/` — `code:members.yaml` / `code:publications.yaml` のパース

本文の描画（Cosense AST → HTML）は `@cosense-site-kit/theme-utils`（npm）に集約されているので、パーサ更新は `npm update` で取り込めます。テーマ自作の汎用ガイド: <https://github.com/shinyaoguri/cosense-site-kit>（`docs/THEMES.md`）

## Cosense 側のページ構成

- `.site` の `code:site.yaml` — nav / home / featured など
- `Members` ページの `code:members.yaml`、`Publications` ページの `code:publications.yaml`
- `#research` / `#news` タグで研究テーマ・お知らせを分類

## ローカル開発

```bash
npm install
npm run fetch   # Cosense からページ取得 → .cosense-cache/
npm run dev     # http://localhost:4321
```
