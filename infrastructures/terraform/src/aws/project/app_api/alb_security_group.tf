# ---------------------------------------------
# alb sg
# ---------------------------------------------

resource "aws_security_group" "alb_sg" {
  name        = "api-alb-sg"
  description = "alb front security group"
  vpc_id      = module.vpc.id

  tags = {
    Name = "api-alb-sg"
  }
}

resource "aws_security_group_rule" "alb_sg_in_http_8000" {
  security_group_id = aws_security_group.alb_sg.id
  type              = "ingress"
  protocol          = "tcp"
  from_port         = 8000
  to_port           = 8000
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "alb_sg_in_http_8001" {
  security_group_id = aws_security_group.alb_sg.id
  type              = "ingress"
  protocol          = "tcp"
  from_port         = 8001
  to_port           = 8001
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "alb_out_all" {
  security_group_id = aws_security_group.alb_sg.id
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
}
