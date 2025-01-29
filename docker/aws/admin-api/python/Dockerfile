FROM public.ecr.aws/docker/library/python:3.12-bullseye

# アップデート
RUN apt-get update && apt-get upgrade -y

# デフォルトのディレクトリを設定
# イメージにディレクトリがないので作成される
WORKDIR /project

# project配下に.venvを作成する
ENV PIPENV_VENV_IN_PROJECT=1

# log出力をリアルタイムにする
ENV PYTHONUNBUFFERED=1

# パスを通す
ENV PYTHONPATH="/project"

# pipのアップデート
RUN pip install --upgrade pip

# pipenvのインストール
RUN pip install --upgrade setuptools pipenv

# プロジェクトのファイルをコピー
COPY ./apps/admin-api/ /project/
COPY ./apps/core/api/base_models/ /project/app/core/base_models/
COPY ./apps/core/api/factories/ /project/app/core/factories/
COPY ./apps/core/api/authentications/ /project/app/core/authentications/

# ライブラリのインストール
RUN pipenv install

# サーバーの起動
COPY ./docker/aws/admin-api/python/cmd.sh /usr/local/bin/cmd.sh
RUN chmod 777 /usr/local/bin/cmd.sh
CMD ["/usr/local/bin/cmd.sh"]
