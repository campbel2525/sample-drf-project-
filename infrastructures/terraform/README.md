# アカウントの概要

マルチアカウントを想定しています

organizations と sso によるマルチアカウントを想定しています

organizations と sso の設定は terraform で管理しないので各自設定してください

アカウントと役割の関係

| アカウント名 | メールアドレス  | 意味               | 主なリソース                   |
| ------------ | --------------- | ------------------ | ------------------------------ |
| aws-admin    | xxx@example.com | 管理アカウント     | route53                        |
| aws-prod     | yyy@example.com | 本番環境アカウント | route53 以外で使用するリソース |

# terraform の環境構築

下記の手順は prod 環境を 1 から作成する手順です

## 1 環境設定

1
下記の設定を行う

- `credentials/aws/config.example`を参考にして`credentials/aws/config`を作成
- `infrastructures/terraform/src/aws/organizations/aws-admin/backend-config.hcl.example`を参考に`infrastructures/terraform/src/aws/organizations/aws-admin/backend-config.hcl`を作成
- `infrastructures/terraform/src/aws/organizations/aws-admin/route53/terraform.tfvars.example`を参考にして`infrastructures/terraform/src/aws/organizations/aws-admin/route53/terraform.tfvars`を作成
- `infrastructures/terraform/src/aws/organizations/aws-admin/route53-record/terraform.tfvars.example`を参考にして`infrastructures/terraform/src/aws/organizations/aws-admin/route53-record/terraform.tfvars`を作成
- `infrastructures/terraform/src/aws/organizations/project/backend-config.hcl.example`を参考に`infrastructures/terraform/src/aws/organizations/project/backend-config.prod.hcl`を作成
- `infrastructures/terraform/src/aws/organizations/project/terraform.tfvars.example`を参考に`infrastructures/terraform/src/aws/organizations/project/terraform.prod.tfvars`を作成

## 2 route53 の設定

### 1

```
make shell
cd /project/aws/organizations/aws-admin/route53
terraform init -backend-config=../backend-config.hcl
terraform apply
```

### 2 DNS の設定

参考 udemy

お名前.com でドメイン(example.com)を取得したと想定します

stg は

- stg-example.com
  prod は
- example.com

のようなドメインを想定しているため、このドメインの設定は stg と prod で共通で 1 回行うことになります

下記は手順です

1 acm や route53 の設定(ネームサーバー)

terraform/common/route53/terraform.tfvars.example

を参考に

terraform/common/route53/terraform.tfvars

を作成する

その後に下記のコマンドを実行する

```
cd terraform/common/route53
terraform init -migrate-state && terraform apply -auto-approve
```

2 お名前.com の dns の設定

aws のマネコンを開き、route53 のリソースにアクセスし、作成されたホストゾーンを開く

作成された タイプが「NS」 の「値/トラフィックのルーティング先」の値を値をお名前.com のネームサーバーに設定を行う(最後の「.」は外す)

3 acm の CNAME をお名前.com に設定

手順 2 の画面と同じ

acm を開く(東京、バージニアリージョンのどっちでも ok)

お名前.com の「DNS 設定/転送設定」のリンク -> DNS レコード設定を利用する

その CNAME をお名前.com の DNS レコードに追加する(最後の「.」は外す)

設定項目

- 「お名前.com のホスト名」には「aws のレコード名」
- 「お名前.com の VALUE」には「aws の値/トラフィックのルーティング先」
- 「お名前.com の TYPE」は CNAME

ネームサーバーの変更確認コマンド

```
nslookup -type=ns example.com
```

ここまで行ったら、一旦コンソールを修了して ok

時間が経つと

保留中の検証 -> 成功

ステータスが変わる(はず)

## 3 本番環境の設定

### 1. 環境ファイルの設定

- `infrastructures/terraform/src/aws/organizations/aws-admin/aws-prod/route53-record/terraform.tfvars.example`を参考に`infrastructures/terraform/src/aws/organizations/aws-admin/aws-prod/route53-record/terraform.tfvars`の作成
- `infrastructures/terraform/src/aws/organizations/project/terraform.tfvars.example`を参考に`infrastructures/terraform/src/aws/organizations/project/backend-config.prod.hcl`を作成
- 「github の ghp の設定方法」を参考にしてキーを作成し`infrastructures/terraform/src/aws/organizations/project/terraform.prod.tfvars`にセットする

### 2

リソースの作成

```
make shell
cd /project/aws/organizations
make prod-apply
```

### 3

下記のことを行う

- コンソールを開いて ssm にプロジェクトの.env を登録する
- coedepipeline -> 編集 -> 編集: Source のステージの編集 -> 保留中の接続を更新 -> 接続を更新 -> 保存
  - 一回ではうまくいかないので何回か繰り返す
  - 「github と連携する」を参考にして連携を行う

## github と連携する

github を organizatoins ではなく直接 codepipeline があるアカウント開く

codepipeline -> 編集 -> 編集: Source のステージの編集 -> Github に接続する -> タブを閉じる -> 保留中の接続を更新 -> 接続を更新 -> 保存

上記に加えてにステージの編集から「GitHub に接続する」を選択から設定する必要ある

## github の ghp の設定方法

Fine-grained token の設定が必要

Fine-grained token の設定場所
profile settings > Developer Settings > Personal access tokens > tokens (classic)

下記の項目を設定する

- 適切な名前と
- 適切なリポジトリと
- 適切な権限
  - Administration: Read and writer
  - Webhooks: Read and writer

## 今後の課題

1.  下記の内容を要調査する

- iam の権限の絞り込み
- role の権限の絞り込み
- github 連携をもっといい感じにできる？

2. vpc エンドポイントの再考察
   現状設定している vpc エンドポイントは ecr.dkr, ecr.api, s3 の 3 つのみです。 他にも logs, secretsmanager, ssm, ssmmessages の vpc エンドポイントもあるようです
   よく要検討すること
   参考 url
   https://dev.classmethod.jp/articles/vpc-endpoints-for-ecs-2022/
   https://qiita.com/ldr/items/7c8bc08baca1945fdb50

3. 現状は prod しかないが stg 環境も作る。マルチ環境は terraform でどう作るか考える
   参考 url
   https://qiita.com/poly_soft/items/c71bb763035b2047d2db

4. app から rds への接続はパスワードではなく iam ベースに変更する

# コマンドメモ

## terraform

```
terraform init -backend-config=../backend-config.hcl
```

https://chatgpt.com/share/66f92abb-2e10-8011-8e31-eff17d13940e

## aws-cli

## ec2 一覧

```
aws --profile aws-prod ec2 describe-instances
```

## rds 一覧

```
aws --profile aws-prod rds describe-db-instances
```

## 踏み台サーバー - shell

```
aws ssm start-session \
--target i-xxx \
--document-name SSM-SessionManagerRunShell \
--profile aws-prod
```

## 踏み台サーバー - ポートホワード

```
aws ssm start-session \
--target i-xxx \
--document-name AWS-StartPortForwardingSessionToRemoteHost \
--parameters '{"host":["<rdsのエンドポイント>"],"portNumber":["3306"],"localPortNumber":["13306"]}' \
--profile aws-prod
```

## ecs に入る

```
aws ecs execute-command \
  --cluster admin-api-ecs-cluster \
  --task 229dad544789425fa98e5ef3de1474c0 \
  --container admin-api-app \
  --command "/bin/sh" \
  --interactive \
  --profile aws-prod
```
