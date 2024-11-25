# terraformのdocker内で実行すること

help: ## ヘルプを表示
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' Makefile | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

fmt: ## 再起的にfmt
	terraform fmt --recursive

prod-init:
	cd aws-admin/route53-record && terraform init -backend-config=../backend-config.prod.hcl -reconfigure
	cd project && ./init-prod.sh

prod-apply: ## apply
	make prod-init
	cd project/acm && terraform apply -auto-approve -var-file=../terraform.prod.tfvars
	cd project/network && terraform apply -auto-approve -var-file=../terraform.prod.tfvars
	cd project/rds1 && terraform apply -auto-approve -var-file=../terraform.prod.tfvars
	cd project/ssm_parameter && terraform apply -auto-approve -var-file=../terraform.prod.tfvars
	cd project/banstion && terraform apply -auto-approve -var-file=../terraform.prod.tfvars
	cd project/app_api && terraform apply -auto-approve -var-file=../terraform.prod.tfvars
	cd project/app_front && terraform apply -auto-approve -var-file=../terraform.prod.tfvars
	cd project/codepipeline && terraform apply -auto-approve -var-file=../terraform.prod.tfvars
	cd aws-admin/route53-record && terraform apply -auto-approve -var-file=terraform.prod.tfvars

prod-destroy: ## all destroy
	make prod-init
	cd aws-admin/route53-record && terraform destroy -auto-approve -var-file=terraform.prod.tfvars
	cd project/codepipeline && terraform destroy -auto-approve -var-file=../terraform.prod.tfvars
	cd project/app_front && terraform destroy -auto-approve -var-file=../terraform.prod.tfvars
	cd project/app_api && terraform destroy -auto-approve -var-file=../terraform.prod.tfvars
	cd project/banstion && terraform destroy -auto-approve -var-file=../terraform.prod.tfvars
	cd project/ssm_parameter && terraform destroy -auto-approve -var-file=../terraform.prod.tfvars
	cd project/rds1 && terraform destroy -auto-approve -var-file=../terraform.prod.tfvars
	cd project/network && terraform destroy -auto-approve -var-file=../terraform.prod.tfvars
	cd project/acm && terraform destroy -auto-approve -var-file=../terraform.prod.tfvars

prod-apply-app: ## app apply
	make prod-init
# apply
	cd project/app_api && terraform apply -auto-approve -var-file=../terraform.prod.tfvars
# cd project/app_front && terraform apply -auto-approve -var-file=../terraform.prod.tfvars
# cd aws-admin/route53-record && terraform apply -auto-approve -var-file=terraform.prod.tfvars

prod-destroy-app: ## app destroy
	make prod-init
# destroy
	cd aws-admin/route53-record && terraform destroy -auto-approve -var-file=terraform.prod.tfvars
	cd project/app_front && terraform destroy -auto-approve -var-file=../terraform.prod.tfvars
	cd project/app_api && terraform destroy -auto-approve -var-file=../terraform.prod.tfvars

	cd project/app_api && terraform apply -auto-approve -var-file=../terraform.prod.tfvars
	cd project/app_front && terraform apply -auto-approve -var-file=../terraform.prod.tfvars
	cd aws-admin/route53-record && terraform apply -auto-approve -var-file=terraform.prod.tfvars

prod-reapply-app: ## app apply
	make prod-init
# destroy
	cd aws-admin/route53-record && terraform destroy -auto-approve -var-file=terraform.prod.tfvars
	cd project/app_front && terraform destroy -auto-approve -var-file=../terraform.prod.tfvars
	cd project/app_api && terraform destroy -auto-approve -var-file=../terraform.prod.tfvars
# apply
	cd project/app_api && terraform apply -auto-approve -var-file=../terraform.prod.tfvars
	cd project/app_front && terraform apply -auto-approve -var-file=../terraform.prod.tfvars
	cd aws-admin/route53-record && terraform apply -auto-approve -var-file=terraform.prod.tfvars


reset:
	find . -type d -name ".terraform" -exec rm -rf {} +
	find . -type f -name ".terraform.lock.hcl" -exec rm -f {} +
