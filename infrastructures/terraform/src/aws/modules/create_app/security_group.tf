# # ---------------------------------------------
# # ecs_sg api
# # ---------------------------------------------
# resource "aws_security_group" "ecs_app_sg_api" {
#   name        = "ecs-app-sg-${var.target_name}"
#   description = "ecs api security group"
#   vpc_id      = var.vpc_id

#   tags = {
#     Name = "ecs-app-sg-${var.target_name}"
#   }
# }

# resource "aws_security_group_rule" "ecs_app_in_http" {
#   security_group_id        = aws_security_group.ecs_app_sg_api.id
#   type                     = "ingress"
#   protocol                 = "tcp"
#   from_port                = var.port
#   to_port                  = var.port
#   source_security_group_id = var.alb_security_group_id
# }

# resource "aws_security_group_rule" "ecs_app_out_all" {
#   security_group_id = aws_security_group.ecs_app_sg_api.id
#   type              = "egress"
#   protocol          = "-1"
#   from_port         = 0
#   to_port           = 0
#   cidr_blocks       = ["0.0.0.0/0"]
# }

# # ---------------------------------------------
# # ecsとrdsの紐付け
# # ---------------------------------------------
# # ecs->db
# resource "aws_security_group_rule" "db_in_tcp3306_from_ecs_api_sgr" {
#   security_group_id        = module.rds_security_group.id
#   type                     = "ingress"
#   protocol                 = "tcp"
#   from_port                = 3306
#   to_port                  = 3306
#   source_security_group_id = aws_security_group.ecs_app_sg_api.id

#   depends_on = [
#     aws_security_group.ecs_app_sg_api
#   ]
# }
