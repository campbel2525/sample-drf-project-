variable "target_name" {
  type = string
}
variable "vpc_id" {
  type = string
}
variable "alb_security_group_id" {
  type = string
}
variable "port" {
  description = "ecsのコンテナポート、aws_security_group_ruleのto_port、alb_app_target_groupのport"
  type        = number
}
variable "rds_security_group_id" {
  type = string
}
