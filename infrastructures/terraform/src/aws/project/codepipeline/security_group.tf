# ---------------------------------------------
# codebuild_sg
# ---------------------------------------------
resource "aws_security_group" "codebuild_sg" {
  name        = "codebuild-sg"
  description = "database role security group"
  vpc_id      = module.vpc.id

  tags = {
    Name = "codebuild-sg"
  }
}

resource "aws_security_group_rule" "ecodebuild_sg_out_all" {
  security_group_id = aws_security_group.codebuild_sg.id
  type              = "egress"
  protocol          = "-1"
  from_port         = 0
  to_port           = 0
  cidr_blocks       = ["0.0.0.0/0"]
}

# ---------------------------------------------
# codebuildとrdsの紐付け
# ---------------------------------------------
# codebuild->db
resource "aws_security_group_rule" "db_in_tcp3306_from_codebuild_sgr" {
  security_group_id        = module.rds_security_group.id
  type                     = "ingress"
  protocol                 = "tcp"
  from_port                = 3306
  to_port                  = 3306
  source_security_group_id = aws_security_group.codebuild_sg.id
}
