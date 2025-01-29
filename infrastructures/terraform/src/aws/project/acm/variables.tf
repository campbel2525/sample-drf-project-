variable "domain" {
  type = string
}

variable "app_name" {
  type = string
}

variable "env" {
  type = string
}

variable "aws_region" {
  type = string
}

variable "aws_default_profile" {
  type = string
}

#東京リージョンのelbのアカウントIDのため固定
variable "aws_tokyo_elb_account_id" {
  type = string
}

variable "db_name" {
  type = string
}

# github
variable "github_owner" {
  type = string
}

variable "github_token" {
  type = string
}

variable "github_target_repository" {
  type = string
}

variable "github_target_branch" {
  type = string
}

variable "github_repository_webhook_secret" {
  type = string
}

variable "aws_codepipeline_webhook_secret" {
  type = string
}

# acm arn
# variable "tokyo_cert_arn" {
#   type = string
# }

# db_password
variable "db_password" {
  type = string
}

# domain
variable "admin_front_domain" {
  type = string
}
variable "user_front_domain" {
  type = string
}
