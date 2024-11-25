# ---------------------------------------------
# Listener
# ---------------------------------------------
resource "aws_lb_listener" "alb_app_listener_https" {
  load_balancer_arn = module.alb.alb_arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = module.acm.arn

  # デフォルトアクションとしてターゲットグループにトラフィックを転送
  # adminとuserのどちらか一方を必ず指定する
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.alb_app_target_group_admin.arn
  }

  depends_on = [
    module.alb,
    aws_lb_target_group.alb_app_target_group_admin,
    aws_lb_target_group.alb_app_target_group_user,
  ]
}

# ---------------------------------------------
# admin
# ---------------------------------------------
resource "aws_lb_target_group" "alb_app_target_group_admin" {
  name                 = "app-front-alb-tg-admin"
  target_type          = "ip"
  vpc_id               = module.vpc.id
  port                 = 3000
  protocol             = "HTTP"
  deregistration_delay = 10 # 登録解除の遅延時間

  tags = {
    Name = "app-front-alb-tg"
  }

  health_check {
    path                = "/api/hc"      # ヘルスチェックで使用するパス
    healthy_threshold   = 2              # 正常判定を行うまでのヘルスチェック実行回数
    unhealthy_threshold = 2              # 異常判定を行うまでのヘルスチェック実行回数
    timeout             = 2              # ヘルスチェックのタイムアウト時間（秒）
    interval            = 5              # ヘルスチェックの実行間隔（秒）
    matcher             = "200"          # 正常判定を行うために使用するHTTPステータスコード
    port                = "traffic-port" # ヘルスチェックで使用するポート
    protocol            = "HTTP"         #  ヘルスチェック時に使用するプロトコル
  }
}

resource "aws_lb_listener_rule" "for_ecs_app_admin" {
  listener_arn = aws_lb_listener.alb_app_listener_https.arn
  priority     = 102

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.alb_app_target_group_admin.arn
  }

  condition {
    host_header {
      values = [var.admin_front_domain]
    }
  }
}

# ---------------------------------------------
# user
# ---------------------------------------------
resource "aws_lb_target_group" "alb_app_target_group_user" {
  name                 = "app-front-alb-tg-user"
  target_type          = "ip"
  vpc_id               = module.vpc.id
  port                 = 3000
  protocol             = "HTTP"
  deregistration_delay = 10 # 登録解除の遅延時間

  tags = {
    Name = "app-front-alb-tg"
  }

  health_check {
    path                = "/api/hc"      # ヘルスチェックで使用するパス
    healthy_threshold   = 2              # 正常判定を行うまでのヘルスチェック実行回数
    unhealthy_threshold = 2              # 異常判定を行うまでのヘルスチェック実行回数
    timeout             = 2              # ヘルスチェックのタイムアウト時間（秒）
    interval            = 5              # ヘルスチェックの実行間隔（秒）
    matcher             = "200"          # 正常判定を行うために使用するHTTPステータスコード
    port                = "traffic-port" # ヘルスチェックで使用するポート
    protocol            = "HTTP"         #  ヘルスチェック時に使用するプロトコル
  }
}

resource "aws_lb_listener_rule" "for_ecs_app_user" {
  listener_arn = aws_lb_listener.alb_app_listener_https.arn
  priority     = 101

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.alb_app_target_group_user.arn
  }

  condition {
    host_header {
      values = [var.user_front_domain]
    }
  }
}
