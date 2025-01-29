#!/bin/bash

# 対象ディレクトリの配列を定義
directories=($(ls -d */ | sed 's/\/$//'))

for dir in "${directories[@]}"; do
    cp variables.tf "$dir/variables.tf"
    (cd "$dir" && terraform init -backend-config=../backend-config.prod.hcl -var-file=../terraform.prod.tfvars -reconfigure)
done
