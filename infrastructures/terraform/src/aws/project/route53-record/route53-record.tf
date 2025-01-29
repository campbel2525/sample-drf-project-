# ---------------------------------------------
# Route53
# ---------------------------------------------
# module "admin_api_alb" {
#   source   = "../../../modules/alb"
#   alb_name = "admin-api-alb"

#   providers = {
#     aws = aws.aws_prod
#   }
# }
# resource "aws_route53_record" "route53_record_admin_api" {
#   zone_id = module.route53.zone_id # すでにreoute53にレコードが存在するので、idはすでに決まっている
#   name    = var.admin_api_domain   # レコード名
#   type    = "A"                    # レコードタイプ

#   alias {
#     name                   = module.admin_api_alb.dns_name
#     zone_id                = module.admin_api_alb.zone_id
#     evaluate_target_health = true
#   }
# }


# module "user_api_alb" {
#   source   = "../../../modules/alb"
#   alb_name = "user-api-alb"

#   providers = {
#     aws = aws.aws_prod
#   }
# }
# resource "aws_route53_record" "route53_record_user_api" {
#   zone_id = module.route53.zone_id # すでにreoute53にレコードが存在するので、idはすでに決まっている
#   name    = var.user_api_domain    # レコード名
#   type    = "A"                    # レコードタイプ

#   alias {
#     name                   = module.user_api_alb.dns_name
#     zone_id                = module.user_api_alb.zone_id
#     evaluate_target_health = true
#   }
# }

module "front_alb" {
  source   = "../../../modules/alb"
  alb_name = "front-alb"

  providers = {
    aws = aws.aws_prod
  }
}
resource "aws_route53_record" "route53_record_admin_front" {
  zone_id = module.route53.zone_id # すでにreoute53にレコードが存在するので、idはすでに決まっている
  name    = var.admin_front_domain # レコード名
  type    = "A"                    # レコードタイプ

  alias {
    name                   = module.front_alb.dns_name
    zone_id                = module.front_alb.zone_id
    evaluate_target_health = true
  }
}
resource "aws_route53_record" "route53_record_user_front" {
  zone_id = module.route53.zone_id # すでにreoute53にレコードが存在するので、idはすでに決まっている
  name    = var.user_front_domain  # レコード名
  type    = "A"                    # レコードタイプ

  alias {
    name                   = module.front_alb.dns_name
    zone_id                = module.front_alb.zone_id
    evaluate_target_health = true
  }
}
