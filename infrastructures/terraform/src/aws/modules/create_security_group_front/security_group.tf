
# ---------------------------------------------
# ecs_sg front
# ---------------------------------------------
resource "aws_security_group" "ecs_app_sg" {
  name        = "ecs-app-sg-${var.target_name}"
  description = "ecs front security group"
  vpc_id      = var.vpc_id

  tags = {
    Name = "ecs-app-sg-${var.target_name}"
  }
}

resource "aws_security_group_rule" "ecs_app_in_http" {
  security_group_id        = aws_security_group.ecs_app_sg.id
  type                     = "ingress"
  protocol                 = "tcp"
  from_port                = var.port
  to_port                  = var.port
  source_security_group_id = var.alb_security_group_id
}

resource "aws_security_group_rule" "ecs_app_out_all" {
  security_group_id = aws_security_group.ecs_app_sg.id
  type              = "egress"
  protocol          = "-1"
  from_port         = 0
  to_port           = 0
  cidr_blocks       = ["0.0.0.0/0"]
}
