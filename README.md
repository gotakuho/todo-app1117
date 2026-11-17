# todo-app（Phase 1 完成版）

「Webフロントエンド」授業 Phase 1（コマ1〜6）の完成版 TODO アプリです。
Next.js（App Router）で作っています。

## 動かし方

Node.js（LTS）が入っていれば、次の2つで起動します。

```powershell
npm install
npm run dev
```

ブラウザで http://localhost:3000 を開きます。

## できること

| 機能 | 対応コマ |
|------|---------|
| TODO の追加・完了・削除 | コマ5 本題 |
| 件数表示（全 / 完了 / 残り） | コマ5 演習1 |
| 空のまま追加したときのエラーメッセージ | コマ5 演習2 |
| すべて / 未完了 / 完了 の絞り込み | コマ5 演習3 |
| 完了済みを一括削除 | コマ5 演習4 |
| localStorage への保存（再読み込みしても消えない） | コマ6 本題 |
| 「このアプリについて」ページと共通ヘッダー | コマ6 本題 |
| 404 ページ | コマ6 演習1 |
| 「使い方」ページ | コマ6 演習2 |
| 保存データが壊れていても落ちない | コマ6 演習3 |

## ファイル構成

```text
app/
  layout.js         共通レイアウト（ヘッダー）
  page.js           TODO 一覧（/）
  about/page.js     このアプリについて（/about）
  help/page.js      使い方（/help）
  not-found.js      404 ページ
  globals.css
components/
  Header.js         共通ヘッダー
  TodoAppClient.js  TodoApp をブラウザだけで描画する（ssr: false）
  TodoApp.js        TODO の配列 state を持つ親
  TodoForm.js       入力フォーム
  TodoFilter.js     絞り込みボタン
  TodoList.js       一覧
  TodoItem.js       1件分
```

## テスト

テスト：51件（`npm test` で実行）

### クラス名で要素を探さない理由

クラス名は「見た目」のための名前で、ユーザーには見えません。
見た目を整えるためにクラス名を変えたり CSS の書き方を変えたりすると、画面の動きは何も変わっていないのにテストが失敗します。
反対に、ボタンの文字が消えて使えなくなっても、クラス名が残っていればテストは通ってしまいます。
`getByRole` のように「ユーザーに見える役割と名前」で探せば、見た目の変更では壊れず、使えなくなったときにだけ失敗するテストになります。

## その他のコマンド

```powershell
npm run lint    # ESLint でチェック
npm run build   # 本番用にビルド
npm run start   # ビルド結果を起動
```

## 教材（docs/phase1）

| コマ | ファイル | タイトル |
|-----|---------|---------|
| 1 | [01_orientation.md](docs/phase1/01_orientation.md) | オリエンテーション・環境構築（create-next-app で最初の一歩） |
| 2 | [02_jsx_props.md](docs/phase1/02_jsx_props.md) | JSXとコンポーネント・props |
| 3 | [03_state_events.md](docs/phase1/03_state_events.md) | stateとイベント・'use client' |
| 4 | [04_list_conditional.md](docs/phase1/04_list_conditional.md) | リストと条件付き表示 |
| 5 | [05_todo_app_1.md](docs/phase1/05_todo_app_1.md) | TODOアプリ実装①（追加・完了・削除） |
| 6 | [06_todo_app_2.md](docs/phase1/06_todo_app_2.md) | TODOアプリ実装②（保存・ページ分け） |
| 7 | [07_github_branch.md](docs/phase1/07_github_branch.md) | GitHub連携・ブランチ・PR体験 |

Phase 2（コマ8〜）からは、この TODO アプリに Jest と React Testing Library でテストを書いていきます。


## 環境変数

プロジェクト直下で `.env.example` をコピーして `.env.local` を作成します。既存の `.env.local` がある場合は、上書きせず不足する設定だけ追記します。

```powershell
Copy-Item .env.example .env.local
```

VS Code で UTF-8 のまま開き、次のように編集して `npm run dev` を起動します。

```dotenv
NEXT_PUBLIC_APP_NAME=TODOアプリ（開発版）
NEXT_PUBLIC_APP_VERSION=1.0.0
SECRET_WORD=himitsu123
```

| 変数 | 用途 | 未設定時 |
| --- | --- | --- |
| NEXT_PUBLIC_APP_NAME | ヘッダーのアプリ名 | TODOアプリ |
| NEXT_PUBLIC_APP_VERSION | about ページのバージョン | 開発中 |
| NEXT_PUBLIC_BUILD_TIME | about ページの最終ビルド日時 | 未ビルド |
| SECRET_WORD | サーバ API の学習用ダミー値 | API は 503 を返す |

`.env.local` を変更したら開発サーバを再起動します。`.env.local` は Git に入れず、ダミー値の `.env.example` だけをコミットします。NEXT_PUBLIC_ 付きの設定はビルド時にブラウザ向け JavaScript に埋め込まれるため、パスワードや API キーを設定してはいけません。本番で設定を変えた場合は再ビルドします。

テストは `npm run test:coverage` で実行します。next/jest はテスト時に `.env.local` を読み込まないため、公開設定が未指定なら初期値を使います。

GitHub Actions は Repository variable の `APP_NAME` を `NEXT_PUBLIC_APP_NAME` に渡します。ビルド日時は日本時間で生成して `$GITHUB_ENV` に書き、次の Build ステップで使用します。バージョンは CI では `1.0.0` です。

### 確認方法

- ヘッダーにアプリ名、`/about` にバージョンと最終ビルド日時が表示されます。
- NEXT_PUBLIC_APP_VERSION の行を消して再起動すると「開発中」になります。
- `/api/hello` は秘密の値そのものを返さず、文字数だけを返します。ダミー値 `himitsu123` なら `{"length":10}` です。この API は Next.js サーバで実行します。
- ビルド後の公開値と秘密値の検索は次のとおりです。検索対象に JavaScript があることも確認します。

```powershell
npm run build
$chunks = Get-ChildItem -Recurse -File .next/static | Where-Object { $_.Extension -eq '.js' }
if (-not $chunks) { throw 'ビルド結果がありません' }
$chunks | Select-String -SimpleMatch -List 'TODOアプリ（開発版）' | Select-Object -ExpandProperty Path
$chunks | Select-String -SimpleMatch -List 'himitsu123' | Select-Object -ExpandProperty Path
```

公開アプリ名は見つかり、秘密の文字列は見つからないことを確認します。サーバ上の変数でも画面や JSON に直接書き込めば漏れるため、検索だけで安全性を完全には証明できません。調査回答は `docs/lesson19.md` にまとめています。
