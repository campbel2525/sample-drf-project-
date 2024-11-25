# ---------------------------------------------
# alb sg
# ---------------------------------------------

resource "aws_security_group" "alb_sg" {
  name        = "front-alb-sg"
  description = "alb front security group"
  vpc_id      = module.vpc.id

  tags = {
    Name = "front-alb-sg"
  }
}

# resource "aws_security_group_rule" "alb_sg_in_http" {
#   security_group_id = aws_security_group.alb_sg.id
#   type              = "ingress"
#   protocol          = "tcp"
#   from_port         = 80
#   to_port           = 80
#   cidr_blocks       = ["0.0.0.0/0"]
# }

resource "aws_security_group_rule" "alb_sg_in_https" {
  security_group_id = aws_security_group.alb_sg.id
  type              = "ingress"
  protocol          = "tcp"
  from_port         = 443
  to_port           = 443
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
