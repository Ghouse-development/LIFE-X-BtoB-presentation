# LIFE X BtoB Presentation - Deployment Guide

## デプロイ方法

### 1. ローカルでのテスト

```bash
# シンプルなHTTPサーバーを起動
python -m http.server 8000

# または、Node.jsを使用
npx http-server -p 8000
```

ブラウザで `http://localhost:8000` にアクセス

### 2. GitHub Pagesへのデプロイ

このリポジトリはGitHub Pagesで公開できます。

#### 手順：

1. GitHubリポジトリのSettingsに移動
2. 左メニューの「Pages」をクリック
3. Source: `main` ブランチ、`/` (root) を選択
4. Save

数分後、`https://ghouse-development.github.io/LIFE-X-BtoB-presentation/` でアクセス可能になります。

### 3. Vercel / Netlifyへのデプロイ

#### Vercel:
```bash
npm install -g vercel
vercel
```

#### Netlify:
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### 4. 独自ドメインでの公開

#### Supabase Storageを使用する場合:

1. Supabaseプロジェクトにログイン
2. Storageバケットを作成（public設定）
3. 全ファイルをアップロード
4. Public URLを共有

#### カスタムサーバー:
- Apache / Nginx 等のWebサーバーに配置
- SSLを設定（HTTPS推奨）
- `index.html` をルートに配置

## 必要な環境

- モダンブラウザ（Chrome, Edge, Safari, Firefox）
- インターネット接続（GSAP CDN使用のため）

## オフライン使用

完全オフラインで使用する場合：
1. GSAPライブラリをダウンロード
2. `index.html` のCDN参照をローカルファイルに変更

```html
<!-- 変更前 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>

<!-- 変更後 -->
<script src="src/js/vendor/gsap.min.js"></script>
```

## トラブルシューティング

### 画像が表示されない
- パスが正しいか確認
- 画像ファイルが存在するか確認
- ブラウザのコンソールでエラーを確認

### アニメーションが動作しない
- GSAPが読み込まれているか確認
- JavaScriptエラーがないか確認
- `main.js` が正しく読み込まれているか確認

### YouTubeビデオが表示されない
- インターネット接続を確認
- iframeがブロックされていないか確認
- URLが正しいか確認

## パフォーマンス最適化

### 画像の最適化:
```bash
# 画像を圧縮（推奨）
npx @squoosh/cli --webp auto resources/image/gaikan/*.jpg
```

### ファイルのミニファイ:
```bash
# CSSのミニファイ
npx csso src/css/main.css -o src/css/main.min.css

# JavaScriptのミニファイ
npx terser src/js/main.js -o src/js/main.min.js
```

## セキュリティ

- Supabase APIキーは必要に応じて環境変数に移動
- 本番環境では `.env` ファイルを使用
- 機密情報をGitにコミットしない

## サポート

問題が発生した場合：
1. ブラウザのコンソールを確認
2. `LIFEX` オブジェクトでデバッグ情報を確認
3. GitHubのIssuesに報告
