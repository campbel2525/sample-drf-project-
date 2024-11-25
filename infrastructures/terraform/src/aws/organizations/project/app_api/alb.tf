module "alb" {
  source = "../../../modules/create_alb"

  account_id                     = module.current_account.account_id
  app_name                       = var.app_name
  env                            = var.env
  aws_region                     = var.aws_region
  prefix                         = "api"
  aws_tokyo_elb_account_id       = var.aws_tokyo_elb_account_id
  alb_security_groups            = [aws_security_group.alb_sg.id]
  alb_subnets                    = [module.private_subnet_1a.id, module.private_subnet_1c.id]
  alb_internal                   = true
  alb_enable_deletion_protection = false

  depends_on = [aws_security_group.alb_sg]
}
