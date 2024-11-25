# ---------------------------------------------
# Provider
# ---------------------------------------------
provider "aws" {
  profile = "aws-admin"
}

provider "aws" {
  profile = "aws-prod"
  alias   = "aws_prod"
}

# ---------------------------------------------
# Terraform configuration
# ---------------------------------------------
terraform {
  required_version = ">=1.4.6"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.5"
    }
  }

  backend "s3" {
    key = "route53/campbel.love/terraform.tfstate"
  }
}

# ---------------------------------------------
# Modules
# ---------------------------------------------
module "route53" {
  source = "../../../modules/route53"
  domain = var.domain
}
