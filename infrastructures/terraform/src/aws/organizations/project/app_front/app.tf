# ---------------------------------------------
# Admin Front
# ---------------------------------------------
module "admin_front" {
  source = "../../../modules/create_app"

  account_id                   = module.current_account.account_id
  aws_region                   = var.aws_region
  target_name                  = "admin-front"
  esc_cluster_name             = "admin-front-ecs-cluster"
  ecs_subnets                  = [module.private_subnet_1a.id, module.private_subnet_1c.id]
  security_group_ecs_app_sg_id = module.ecs_app_security_group_admin_front.id
  port                         = 3000 # セキュリティグループのポート(security_group_ecs_app_sg_id)合わせること
  alb_target_group_arn         = aws_lb_target_group.alb_app_target_group_admin.arn
  task_cpu                     = "256"
  task_memory                  = "512"
  ecs_desired_count            = 2
  container_definitions = jsonencode([
    {
      name      = "admin-front-app",
      image     = "public.ecr.aws/docker/library/node:18-bullseye",
      essential = true,
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          awslogs-region        = var.aws_region,
          awslogs-group         = "/aws/ecs/admin-front-app",
          awslogs-stream-prefix = "admin-front-app"
        }
      },
      portMappings = [
        {
          hostPort      = 3000,
          protocol      = "tcp",
          containerPort = 3000
        }
      ],
      environment = [],
      secrets = [
        {
          name      = "APP_ENV_VALUES",
          valueFrom = "arn:aws:ssm:${var.aws_region}:${module.current_account.account_id}:parameter/ecs/app/admin-front/.env"
        }
      ]
    }
  ])
  vpc_id = module.vpc.id

  depends_on = [
    module.ecs_app_security_group_admin_front,
    aws_lb_target_group.alb_app_target_group_admin,
  ]
}

# ---------------------------------------------
# User Front
# ---------------------------------------------
module "user_front" {
  source = "../../../modules/create_app"

  account_id                   = module.current_account.account_id
  aws_region                   = var.aws_region
  target_name                  = "user-front"
  esc_cluster_name             = "user-front-ecs-cluster"
  ecs_subnets                  = [module.private_subnet_1a.id, module.private_subnet_1c.id]
  security_group_ecs_app_sg_id = module.ecs_app_security_group_user_front.id
  port                         = 3000 # セキュリティグループのポート(security_group_ecs_app_sg_id)合わせること
  alb_target_group_arn         = aws_lb_target_group.alb_app_target_group_user.arn
  task_cpu                     = "256"
  task_memory                  = "512"
  ecs_desired_count            = 2
  container_definitions = jsonencode([
    {
      name      = "user-front-app",
      image     = "public.ecr.aws/docker/library/node:18-bullseye",
      essential = true,
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          awslogs-region        = var.aws_region,
          awslogs-group         = "/aws/ecs/user-front-app",
          awslogs-stream-prefix = "user-front-app"
        }
      },
      portMappings = [
        {
          hostPort      = 3000,
          protocol      = "tcp",
          containerPort = 3000
        }
      ],
      environment = [],
      secrets = [
        {
          name      = "APP_ENV_VALUES",
          valueFrom = "arn:aws:ssm:${var.aws_region}:${module.current_account.account_id}:parameter/ecs/app/user-front/.env"
        }
      ]
    }
  ])
  vpc_id = module.vpc.id

  depends_on = [
    module.ecs_app_security_group_user_front,
    aws_lb_target_group.alb_app_target_group_user,
  ]
}
