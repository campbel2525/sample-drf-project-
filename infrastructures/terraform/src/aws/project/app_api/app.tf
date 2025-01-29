# ---------------------------------------------
# Admin API
# ---------------------------------------------
module "admin_api" {
  source = "../../../modules/create_app"

  account_id                   = module.current_account.account_id
  aws_region                   = var.aws_region
  target_name                  = "admin-api"
  esc_cluster_name             = "admin-api-ecs-cluster"
  ecs_subnets                  = [module.private_subnet_1a.id, module.private_subnet_1c.id]
  security_group_ecs_app_sg_id = module.ecs_app_security_group_admin_api.id
  port                         = 8000 # セキュリティグループのポート(security_group_ecs_app_sg_id)合わせること
  alb_target_group_arn         = aws_lb_target_group.alb_app_target_group_admin.arn
  task_cpu                     = "256"
  task_memory                  = "512"
  ecs_desired_count            = 2
  container_definitions = jsonencode([
    {
      name      = "admin-api-app",
      image     = "public.ecr.aws/docker/library/python:3.12-bullseye",
      essential = true,
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          awslogs-region        = var.aws_region,
          awslogs-group         = "/aws/ecs/admin-api-app",
          awslogs-stream-prefix = "admin-api-app"
        }
      },
      portMappings = [
        {
          hostPort      = 8000,
          protocol      = "tcp",
          containerPort = 8000
        }
      ],
      environment = [],
      secrets = [
        {
          name      = "APP_ENV_VALUES",
          valueFrom = "arn:aws:ssm:${var.aws_region}:${module.current_account.account_id}:parameter/ecs/app/admin-api/.env"
        }
      ]
    }
  ])
  vpc_id = module.vpc.id

  depends_on = [
    module.ecs_app_security_group_admin_api,
    aws_lb_target_group.alb_app_target_group_admin
  ]
}

# ---------------------------------------------
# User API
# ---------------------------------------------
module "user_api" {
  source = "../../../modules/create_app"

  account_id                   = module.current_account.account_id
  aws_region                   = var.aws_region
  target_name                  = "user-api"
  esc_cluster_name             = "user-api-ecs-cluster"
  ecs_subnets                  = [module.private_subnet_1a.id, module.private_subnet_1c.id]
  security_group_ecs_app_sg_id = module.ecs_app_security_group_admin_api.id
  port                         = 8000 # セキュリティグループのポート(security_group_ecs_app_sg_id)合わせること
  alb_target_group_arn         = aws_lb_target_group.alb_app_target_group_user.arn
  task_cpu                     = "256"
  task_memory                  = "512"
  ecs_desired_count            = 2
  container_definitions = jsonencode([
    {
      name      = "user-api-app",
      image     = "public.ecr.aws/docker/library/python:3.12-bullseye",
      essential = true,
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          awslogs-region        = var.aws_region,
          awslogs-group         = "/aws/ecs/user-api-app",
          awslogs-stream-prefix = "user-api-app"
        }
      },
      portMappings = [
        {
          hostPort      = 8000,
          protocol      = "tcp",
          containerPort = 8000
        }
      ],
      environment = [],
      secrets = [
        {
          name      = "APP_ENV_VALUES",
          valueFrom = "arn:aws:ssm:${var.aws_region}:${module.current_account.account_id}:parameter/ecs/app/user-api/.env"
        }
      ]
    }
  ])
  vpc_id = module.vpc.id

  depends_on = [
    module.ecs_app_security_group_admin_api,
    aws_lb_target_group.alb_app_target_group_user,
  ]
}
