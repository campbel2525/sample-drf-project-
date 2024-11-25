#!/bin/bash
set -e

echo "$APP_ENV_VALUES" > .env

# サーバー起動
pipenv run gunicorn config.wsgi:application --workers 3 --bind 0.0.0.0:8000 --timeout 240
