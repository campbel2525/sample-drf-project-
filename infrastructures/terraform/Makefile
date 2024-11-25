pn = 'sample-drf-project-terraform'

init: ## 環境構築(ビルド)
	make destroy
	docker compose -p $(pn) build --no-cache
	docker compose -p $(pn) down --volumes
	docker compose -p $(pn) up -d

up: ## 環境up
	docker compose -p $(pn) up -d

down: ## 環境down
	docker compose -p $(pn) down

destroy: ## 環境削除
	make down
	docker network ls -qf name=$(pn) | xargs docker network rm
	docker container ls -a -qf name=$(pn) | xargs docker container rm
	docker volume ls -qf name=$(pn) | xargs docker volume rm

shell: ## shellに入る
	docker compose -p $(pn) exec -it terraform bash

tree:
	tree -a -I .git -I .DS_Store -I registry.terraform.io
