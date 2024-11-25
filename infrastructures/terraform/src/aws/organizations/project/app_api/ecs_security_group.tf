# ---------------------------------------------
# ecs security group
# ---------------------------------------------
module "ecs_app_security_group_admin_api" {
  source = "../../../modules/create_security_group_api"

  target_name           = "admin-api"
  vpc_id                = module.vpc.id
  alb_security_group_id = aws_security_group.alb_sg.id
  port                  = 8000
  rds_security_group_id = module.rds_security_group.id

  # depends_on = [module.create_alb_target_group_admin_api]
}

module "ecs_app_security_group_user_api" {
  source = "../../../modules/create_security_group_api"

  target_name           = "user-api"
  vpc_id                = module.vpc.id
  alb_security_group_id = aws_security_group.alb_sg.id
  port                  = 8001
  rds_security_group_id = module.rds_security_group.id

  # depends_on = [module.create_alb_target_group_user_api]
}
