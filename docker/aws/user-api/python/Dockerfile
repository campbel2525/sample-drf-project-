FROM public.ecr.aws/docker/library/python:3.12-bullseye

# アップデート
RUN apt-get update && apt-get upgrade -y

RUN apt-get install -y \
    libnss3 \
    libnspr4 \
    libdbus-1-3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libatspi2.0-0 \
    libx11-xcb1 \
    libxcursor1 \
    libgtk-3-0 \
    build-essential \
    libwoff1 \
    libopus0 \
    libharfbuzz-icu0 \
    libenchant-2-2 \
    libsecret-1-0 \
    libhyphen0 \
    libmanette-0.2-0 \
    libflite1 \
    libunwind8 \
    libdw1 \
    libegl1 \
    libglx0 \
    libgudev-1.0-0 \
    libgles2 \
    libx264-160

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
COPY ./apps/user-api/ /project/
COPY ./apps/core/api/base_models/ /project/app/core/base_models/
COPY ./apps/core/api/factories/ /project/app/core/factories/
COPY ./apps/core/api/authentications/ /project/app/core/authentications/

# ライブラリのインストール
RUN pipenv install

# サーバーの起動
COPY ./docker/aws/user-api/python/cmd.sh /usr/local/bin/cmd.sh
RUN chmod 777 /usr/local/bin/cmd.sh
CMD ["/usr/local/bin/cmd.sh"]
