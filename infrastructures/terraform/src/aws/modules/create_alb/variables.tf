variable "account_id" {
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
variable "prefix" {
  description = "ALB name(front or api)"
  type        = string
}
variable "aws_tokyo_elb_account_id" {
  type = string
}
variable "alb_security_groups" {
  type = list(string)
}
variable "alb_subnets" {
  type = list(string)
}
variable "alb_internal" {
  type = bool
}
variable "alb_enable_deletion_protection" {
  description = "本番ではtrueにする"
  type        = bool
}
