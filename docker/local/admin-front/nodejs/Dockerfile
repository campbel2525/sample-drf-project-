# 使用するNode.jsのバージョンを指定
FROM public.ecr.aws/docker/library/node:18-bullseye

# アップデート
RUN apt-get update && apt-get upgrade -y

# 環境変数
ENV NODE_ENV=development

# アプリケーションのディレクトリを設定
WORKDIR /project

# プロジェクトのファイルをコピー
COPY . /project/

# npmを最新バージョンにアップグレード
RUN npm install -g npm@10

# # ライブラリのインストール
# RUN npm install --save-dev

# # プロジェクトのファイルをコピー
# COPY . /project/
