# ---------------------------------------------
# ecs security group
# ---------------------------------------------
module "ecs_app_security_group_admin_front" {
  source = "../../../modules/create_security_group_front"

  target_name           = "admin-front"
  vpc_id                = module.vpc.id
  alb_security_group_id = aws_security_group.alb_sg.id
  port                  = 3000

  # depends_on = [module.create_alb_target_group_admin_front]
}

module "ecs_app_security_group_user_front" {
  source = "../../../modules/create_security_group_front"

  target_name           = "user-front"
  vpc_id                = module.vpc.id
  alb_security_group_id = aws_security_group.alb_sg.id
  port                  = 3000

  # depends_on = [module.create_alb_target_group_user_front]
}
