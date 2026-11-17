# コマ19 Secretsと環境変数 調査回答

## 本番用 Secrets を main からの実行に制限する

Settings → Environments で production を作成し、Deployment branches and tags の Selected branches and tags を選択する。Branch の main だけを許可し、Tag の許可ルールは追加しない。本番用のキーは production の Environment secrets に登録し、Repository secrets には同じキーを置かない。

本番ジョブには `environment: production` を指定する。さらにワークフローを main への push に限定し、ジョブにも `if: github.event_name == 'push' && github.ref == 'refs/heads/main'` を付ける。main の保護とワークフローのレビューを維持する。Environment を作成しただけでは不十分で、ジョブからの参照が必要である。環境機能の利用可否は GitHub のプランとリポジトリの公開範囲による。これは次コマのデプロイに向けた設定方法の調査であり、本番の実キーは作成しない。

## API キーを push してしまった場合

最初にサービス側でキーを無効化し、新しいキーを発行する。次のコミットで .env を削除するだけでは過去の Git 履歴や既存のコピーにキーが残るため不十分である。利用履歴や請求を確認し、必要なら共同作業者と調整して履歴から削除する。履歴削除はキーの無効化の代わりにはならない。再発防止として .gitignore、Secret scanning、Push protection を確認する。

## Server Component と Client Component

NEXT_PUBLIC_ がない SECRET_WORD はサーバ上で読み取れるが、ブラウザの Client Component からは通常参照できない。ただし Server Component の JSX に値を入れれば、その表示内容がブラウザに送信される。秘密を使う処理はサーバ内で行い、必要な結果だけを返す。動作確認のために秘密を表示したコードは残さない。

## ビルド時に起きること

NEXT_PUBLIC_APP_NAME の直接参照は、ビルド時に値へ置き換えられ、Header を含むブラウザ向け JavaScript に入る。SECRET_WORD は Route Handler 内でのみ使用し、文字列を JSON や画面に含めないため、公開する .next/static には入らない。API が返す文字数自体は公開される情報なので、本実装は学習用とする。

## 参考資料

- https://nextjs.org/docs/app/guides/environment-variables
- https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments
- https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository

## 実行確認

2026年11月17日、npm run lint、npm run test:coverage -- --runInBand、npm run build が成功した。テストは14スイート61件が成功した。ビルド後の .next/static の13個の JavaScript を検索し、公開アプリ名を1ファイルで確認し、ダミー秘密文字列は0件だった。Next.js の本番サーバで /api/hello の応答が {"length":10} となり、about ページには1.0.0が含まれ、秘密文字列が含まれないことを確認した。
