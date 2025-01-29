# ecs execution
data "aws_iam_policy" "ecs_execution_role_policy" {
  arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

data "aws_iam_policy_document" "ecs_task_execution" {
  source_policy_documents = [data.aws_iam_policy.ecs_execution_role_policy.policy]

  statement {
    effect = "Allow"
    actions = [
      "ssm:GetParameters",
      "kms:Decrypt"
    ]
    resources = ["*"]
  }
}

module "ecs_execution_role" {
  source      = "../../modules/iam_role"
  role_type   = "Service"
  base_name   = "${var.target_name}-ecs-task-execution-role"
  identifier  = "ecs-tasks.amazonaws.com"
  policy_json = data.aws_iam_policy_document.ecs_task_execution.json
}


# ecs role
data "aws_iam_policy_document" "ecs_task" {
  statement {
    effect = "Allow"
    actions = [
      "ssmmessages:CreateControlChannel",
      "ssmmessages:CreateDataChannel",
      "ssmmessages:OpenControlChannel",
      "ssmmessages:OpenDataChannel",
      # "rds:*"
    ]
    resources = ["*"]
  }
}

module "ecs_task_role" {
  source      = "../../modules/iam_role"
  role_type   = "Service"
  base_name   = "${var.target_name}-ecs-task-role"
  identifier  = "ecs-tasks.amazonaws.com"
  policy_json = data.aws_iam_policy_document.ecs_task.json
}
