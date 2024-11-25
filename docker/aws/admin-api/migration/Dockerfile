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
COPY ./apps/core/api/database/ /project/core/database/
COPY ./apps/core/api/migrations/ /project/migrations/

# ライブラリのインストール
RUN pipenv install

# マイグレーション実行
CMD ["pipenv", "run", "python", "manage.py", "migrate"]
