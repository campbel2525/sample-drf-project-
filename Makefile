include docker/local/.env
pf := $(COMPOSE_FILE)
pn := $(PROJECT_NAME)

help: ## ヘルプを表示
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' Makefile | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

cp-env: ## envのコピー
	cp apps/admin-api/.env.example apps/admin-api/.env
	cp apps/user-api/.env.example apps/user-api/.env
	cp apps/admin-front/.env.example apps/admin-front/.env
	cp apps/user-front/.env.example apps/user-front/.env

init: ## 開発環境構築(ビルド)
# 開発環境の削除
	make destroy
# キャッシュ、ログ、ライブラリの削除
	make c
# ビルド
	docker compose -f $(pf) -p $(pn) build --no-cache
	docker compose -f $(pf) -p $(pn) down --volumes
	docker compose -f $(pf) -p $(pn) up -d
	./docker/local/wait-for-db.sh
	docker compose -f $(pf) -p $(pn) exec -T db mysql -psecret < docker/local/setup.dev.sql
# ライブラリのインストール
	make install
# DBリセット
	make reset

up: ## 開発環境up
	docker compose -f $(pf) -p $(pn) up -d

down: ## 開発環境down
	docker compose -f $(pf) -p $(pn) down

destroy: ## 開発環境削除
	make down
	if [ -n "$(docker network ls -qf name=$(pn))" ]; then \
		docker network ls -qf name=$(pn) | xargs docker network rm; \
	fi
	if [ -n "$(docker container ls -a -qf name=$(pn))" ]; then \
		docker container ls -a -qf name=$(pn) | xargs docker container rm; \
	fi
	if [ -n "$(docker volume ls -qf name=$(pn))" ]; then \
		docker volume ls -qf name=$(pn) | xargs docker volume rm; \
	fi

reset: ## DBのリセット
	docker compose -f $(pf) -p $(pn) exec -it admin-api pipenv run python manage.py drop_all_tables
	docker compose -f $(pf) -p $(pn) exec -it admin-api pipenv run python manage.py migrate
	docker compose -f $(pf) -p $(pn) exec -it admin-api pipenv run python manage.py seeds

reset-migration: ## マイグレーションのリセット
# 開発中のコマンドになる
# 運用が始まったら使用しないこと
	docker compose -f $(pf) -p $(pn) exec -it admin-api pipenv run python manage.py drop_all_tables
	docker compose -f $(pf) -p $(pn) exec -it admin-api bash -c 'find . -type d -name ".venv" -prune -o -type d -name "migrations" -exec bash -c '\''find "$$0" -type f ! -name "__init__.py" -delete'\'' {} \;'
	make migrate
	docker compose -f $(pf) -p $(pn) exec -it admin-api pipenv run python manage.py seeds

migrate: ## マイグレート
	docker compose -f $(pf) -p $(pn) exec -it admin-api pipenv run python manage.py makemigrations
	docker compose -f $(pf) -p $(pn) exec -it admin-api pipenv run python manage.py migrate

install: ## インストール
# ライブラリの削除
	make lib-c
# ライブラリのインストール
	docker compose -f $(pf) -p $(pn) exec -it admin-api pipenv install --dev
	docker compose -f $(pf) -p $(pn) exec -it user-api pipenv install --dev
	docker compose -f $(pf) -p $(pn) exec -it admin-front npm install --save-dev
	docker compose -f $(pf) -p $(pn) exec -it user-front npm install --save-dev

admin-api-shell: ## shellに入る
	docker compose -f $(pf) -p $(pn) exec -it admin-api bash

user-api-shell: ## shellに入る
	docker compose -f $(pf) -p $(pn) exec -it user-api bash

admin-front-shell: ## shellに入る
	docker compose -f $(pf) -p $(pn) exec -it admin-front bash

user-front-shell: ## shellに入る
	docker compose -f $(pf) -p $(pn) exec -it user-front bash

db-shell: ## shellに入る
	docker compose -f $(pf) -p $(pn) exec -it db bash

check: ## コードフォーマット
# admin-api
	docker compose -f $(pf) -p $(pn) exec -it admin-api pipenv run isort .
	docker compose -f $(pf) -p $(pn) exec -it admin-api pipenv run black .
	docker compose -f $(pf) -p $(pn) exec -it admin-api pipenv run flake8 .
	docker compose -f $(pf) -p $(pn) exec -it admin-api pipenv run mypy .
# user-api
	docker compose -f $(pf) -p $(pn) exec -it user-api pipenv run isort .
	docker compose -f $(pf) -p $(pn) exec -it user-api pipenv run black .
	docker compose -f $(pf) -p $(pn) exec -it user-api pipenv run flake8 .
	docker compose -f $(pf) -p $(pn) exec -it user-api pipenv run mypy .
# admin-front
	docker compose -f $(pf) -p $(pn) exec -it admin-front npx prettier . --write
	docker compose -f $(pf) -p $(pn) exec -it admin-front npx eslint . --fix
	docker compose -f $(pf) -p $(pn) exec -it admin-front npx tsc --noEmit
# docker compose -f $(pf) -p $(pn) exec -it admin-front npm run check
# user-front
	docker compose -f $(pf) -p $(pn) exec -it user-front npx prettier . --write
	docker compose -f $(pf) -p $(pn) exec -it user-front npx eslint . --fix
	docker compose -f $(pf) -p $(pn) exec -it user-front npx tsc --noEmit
# docker compose -f $(pf) -p $(pn) exec -it user-front npm run check

# テスト
# mak test

admin-api-run: ## サーバー起動
	docker compose -f $(pf) -p $(pn) exec -it admin-api pipenv run python manage.py runserver 0.0.0.0:8000

user-api-run: ## サーバー起動
	docker compose -f $(pf) -p $(pn) exec -it user-api pipenv run python manage.py runserver 0.0.0.0:8001

admin-front-run: ## サーバー起動
	docker compose -f $(pf) -p $(pn) exec -it admin-front npx next dev -p 3000

admin-front-build-run: ## サーバー起動
	docker compose -f $(pf) -p $(pn) exec -it admin-front npm run build
	docker compose -f $(pf) -p $(pn) exec -it admin-front sh -c "HOST=0.0.0.0 PORT=3000 node build"

user-front-run: ## サーバー起動
	docker compose -f $(pf) -p $(pn) exec -it user-front npx next dev -p 3001

user-front-build-run: ## サーバー起動
	docker compose -f $(pf) -p $(pn) exec -it user-front npm run build
	docker compose -f $(pf) -p $(pn) exec -it user-front sh -c "HOST=0.0.0.0 PORT=3001 node build"

# test: ## テスト
# 	make admin-api-test
# 	make user-api-test
# 	make admin-front-test
# 	make user-front-test

# admin-api-test: ## テスト
# 	docker compose -f $(pf) -p $(pn) exec -it admin-api pipenv run pytest

# user-api-test: ## テスト
# 	docker compose -f $(pf) -p $(pn) exec -it user-api pipenv run pytest

# admin-front-test: ## テスト
# 	docker compose -f $(pf) -p $(pn) exec -it admin-front

# user-front-test: ## テスト
# 	docker compose -f $(pf) -p $(pn) exec -it user-front

c: ## キャッシュ、ログ、ライブラリの削除
# キャッシュの削除
	find . -type d -name ".mypy_cache" -exec rm -rf {} +
	find . -type d -name ".next" -exec rm -rf {} +
	find . -type f -name "next-env.d.ts" -exec rm -f {} +

# ログの削除
	find . -type f -name "fastapi.log" -exec rm -f {} +
	find . -type f -name "django.log" -exec rm -f {} +

# ライブラリの削除
	make lib-c

lib-c: ## ライブラリの削除
	find . -type d -name ".venv" -exec rm -rf {} +
	find . -type d -name "node_modules" -exec rm -rf {} +

push: ## push
# make format
# git switch main
# git pull origin main
	git add .
	git commit -m "Commit at $$(date +'%Y-%m-%d %H:%M:%S')"
	git push origin main
	git push origin main:prod

github-init:
# ビルド
	docker compose -f $(pf) -p $(pn) build --no-cache
	docker compose -f $(pf) -p $(pn) down --volumes
	docker compose -f $(pf) -p $(pn) up -d
	./docker/local/wait-for-db.sh
	docker compose -f $(pf) -p $(pn) exec -T db mysql -psecret < docker/local/setup.dev.sql
# ライブラリのインストール
	make install
# DBリセット
	make reset

github-check:
# admin-api
	docker compose -f $(pf) -p $(pn) exec -it admin-api bash -c "pipenv run isort . --check-only"
	docker compose -f $(pf) -p $(pn) exec -it admin-api bash -c "pipenv run black . --check"
	docker compose -f $(pf) -p $(pn) exec -it admin-api bash -c "pipenv run flake8 ."
	docker compose -f $(pf) -p $(pn) exec -it admin-api bash -c "pipenv run mypy ."
# user-api
	docker compose -f $(pf) -p $(pn) exec -it user-api bash -c "pipenv run isort . --check-only"
	docker compose -f $(pf) -p $(pn) exec -it user-api bash -c "pipenv run black . --check"
	docker compose -f $(pf) -p $(pn) exec -it user-api bash -c "pipenv run flake8 ."
	docker compose -f $(pf) -p $(pn) exec -it user-api bash -c "pipenv run mypy ."
# admin-front
	docker compose -f $(pf) -p $(pn) exec -it admin-front bash -c "npx prettier . --check"
	docker compose -f $(pf) -p $(pn) exec -it admin-front bash -c "npx eslint ."
	docker compose -f $(pf) -p $(pn) exec -it admin-front npx tsc --noEmit
# user-front
	docker compose -f $(pf) -p $(pn) exec -it user-front bash -c "npx prettier . --check"
	docker compose -f $(pf) -p $(pn) exec -it user-front bash -c "npx eslint ."
	docker compose -f $(pf) -p $(pn) exec -it user-front npx tsc --noEmit

reset-commit: ## mainブランチのコミット履歴を1つにする 使用は控える
	git checkout --orphan new-branch-name
	git add .
	git branch -D main
	git branch -m main
	git commit -m "first commit"
	git push origin -f main
