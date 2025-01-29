variable "account_id" {
  type = string
}
variable "aws_region" {
  type = string
}
variable "target_name" {
  type = string
}
variable "esc_cluster_name" {
  type = string
}
variable "ecs_subnets" {
  type = list(string)
}
variable "security_group_ecs_app_sg_id" {
  type = string
}
variable "port" {
  description = "ecsのコンテナポート、aws_security_group_ruleのto_port、alb_app_target_groupのport"
  type        = number
}
variable "container_definitions" {
  type = string
}

variable "task_cpu" {
  type = string
}
variable "task_memory" {
  type = string
}
variable "ecs_desired_count" {
  type = number
}
variable "alb_target_group_arn" {
  type = string
}
variable "vpc_id" {
  type = string
}
