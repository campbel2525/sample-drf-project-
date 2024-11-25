#!/bin/bash

# 対象ディレクトリの配列を定義
directories=(
    # "acm"
    "app_front"
    "app_api"
    # "banstion"
    # "codepipeline"
    # "network"
    # "ssm_parameter"
    # "rds1"
)

# 各ディレクトリに対してファイルをコピーとterraform initを実行
for dir in "${directories[@]}"; do
    # terraform.tfvarsとvariables.tfをコピー
    # cp terraform.prod.tfvars "$dir/terraform.tfvars"
    cp variables.tf "$dir/variables.tf"

    # terraform initを実行
    (cd "$dir" && terraform init -backend-config=../backend-config.prod.hcl -var-file=../terraform.prod.tfvars -reconfigure)
done
