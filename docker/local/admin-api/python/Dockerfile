FROM public.ecr.aws/docker/library/python:3.12-bullseye

# apt-getのアップデート
RUN apt-get update && apt-get upgrade -y

# デフォルトのディレクトリを設定
# イメージにディレクトリがないので作成される
WORKDIR /project

# project配下に.venvを作成する
ENV PIPENV_VENV_IN_PROJECT=1

# log出力をリアルタイムにする
ENV PYTHONUNBUFFERED=1

# キャッシュを作成しない
ENV PYTHONDONTWRITEBYTECODE=1

# パスを通す
ENV PYTHONPATH="/project"

# pipのアップデート
RUN pip install --upgrade pip

# pipenvのインストール
RUN pip install --upgrade setuptools pipenv

# # ライブラリのインストール
# COPY Pipfile /project/
# COPY Pipfile.lock /project/
# RUN pipenv install --dev

# # プロジェクトのファイルをコピー
# COPY . /project/
