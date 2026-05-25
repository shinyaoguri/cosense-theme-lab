# cosense-theme-lab

A research-lab website from a public [Cosense](https://scrapbox.io) project. Members, research topics, publications, and news come from one Cosense project; deploys to GitHub Pages via GitHub Actions (cron, twice daily).

> **テンプレートリポジトリです。** テーマのコード（`theme/`）はこのリポジトリに同梱されており、**あなたのものとして自由に編集**できます。npm から取り込むのはフレームワーク（`@cosense-site-kit/*`）だけ。

## 立ち上げ（ブラウザだけ）

1. **「Use this template」** で自分のリポジトリを作成。
2. `cosense.config.ts` の `source.project` を自分の公開 Cosense プロジェクト名に変更。
3. **Settings → Pages → Source** を **「GitHub Actions」** に。
4. **Actions → Build and deploy → Run workflow** を実行（以降は cron）。

サブパス公開（`<user>.github.io/<repo>/`）なら `cosense.config.ts` の `site.base` に `"/<repo>"` を設定。

## 機能

- **全文検索** — ビルド時に [Pagefind](https://pagefind.app) インデックスを生成し、ヘッダーの検索アイコンから利用（ビルド後・`astro preview` で動作）。`themeLab({ search: false })` で無効化。
- **ダークスキン** — `theme/presets/dark.ts` の `presetDark`。`astro.config.ts` で `themeLab({ preset: presetDark })`、または Cosense の `code:site.yaml` に `theme: { skin: dark }` を書けばリポジトリを触らず切替可能。
- **SEO / 配信** — 各ページに OpenGraph / Twitter Card / JSON-LD / canonical を出力。`/feed.xml`（News の RSS）・`/sitemap.xml`・`/robots.txt`・`/link-previews.json` を自動生成。
- **読み物系** — ホバー目次・コードのコピーボタン・内部リンクのプレビューカード・関連ページ（2-hop）。
- 本文は Shiki シンタックスハイライト・YouTube/Vimeo/Spotify 埋め込み・数式（KaTeX）・ネストリスト・引用に対応。

## テーマをカスタムする

見た目と構造は `theme/` にあります（fork して所有しているので直接編集可）:

- `theme/components/Layout.astro` `Header.astro` `Footer.astro` — 枠と配色（CSS は `theme/styles/global.css`）
- `theme/templates/` — `/research`・`/news` などのページ、`feed.xml`/`sitemap.xml` などの配信エンドポイント
- `theme/presets/` — スキン（配色トークン）。`theme/styles/global.css` の `:root` トークンを上書きする
- `theme/integration/pagefind.ts` — 検索インデックス生成
- `theme/lib/` — `code:members.yaml` / `code:publications.yaml` のパース

本文の描画（Cosense AST → HTML）は `@cosense-site-kit/theme-utils`（npm）に集約されているので、パーサ更新は `npm update` で取り込めます。テーマ自作の汎用ガイド: <https://github.com/shinyaoguri/cosense-site-kit>（`docs/THEMES.md`）

## Cosense 側のページ構成

- `.site` の `code:site.yaml` — nav / home / featured など
- `Members` ページの `code:members.yaml`、`Publications` ページの `code:publications.yaml`
- `#research` / `#news` タグで研究テーマ・お知らせを分類
- **メンバーの顔写真とリンク** — メンバー名と同じタイトルの Cosense ページ（`#publish` で公開）があれば、メンバーカードがそのページにリンクし、本文先頭の画像が自動でアバターに使われます。`members.yaml` に `photo:` を明示すればアバターはそちらが優先。画像が無ければ頭文字プレースホルダ、ページが無ければリンクなし。

## ローカル開発

```bash
npm install
npm run fetch   # Cosense からページ取得 → .cosense-cache/
npm run dev     # http://localhost:4321
```
