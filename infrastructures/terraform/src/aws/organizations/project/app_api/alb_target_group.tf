# ---------------------------------------------
# admin
# ---------------------------------------------
resource "aws_lb_listener" "alb_app_listener_http_admin" {
  load_balancer_arn = module.alb.alb_arn
  port              = "8000"
  protocol          = "HTTP"

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

resource "aws_lb_target_group" "alb_app_target_group_admin" {
  name                 = "admin-api-alb-tg"
  target_type          = "ip"
  vpc_id               = module.vpc.id
  port                 = 8000
  protocol             = "HTTP"
  deregistration_delay = 10 # 登録解除の遅延時間

  tags = {
    Name = "admin-api-alb-tg"
  }

  health_check {
    path                = "/api/hc/"     # ヘルスチェックで使用するパス
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
  listener_arn = aws_lb_listener.alb_app_listener_http_admin.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.alb_app_target_group_admin.arn
  }

  condition {
    path_pattern {
      values = ["/*"]
    }
  }
}

# ---------------------------------------------
# user
# ---------------------------------------------
resource "aws_lb_listener" "alb_app_listener_http_user" {
  load_balancer_arn = module.alb.alb_arn
  port              = "8001" # 8001番ポートで受けとる
  protocol          = "HTTP"

  # デフォルトアクションとしてターゲットグループにトラフィックを転送
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.alb_app_target_group_user.arn
  }
}
resource "aws_lb_target_group" "alb_app_target_group_user" {
  name                 = "user-api-alb-tg"
  target_type          = "ip"
  vpc_id               = module.vpc.id
  port                 = 8000 # 8000番ポートに転送
  protocol             = "HTTP"
  deregistration_delay = 10 # 登録解除の遅延時間

  tags = {
    Name = "user-api-alb-tg"
  }

  health_check {
    path                = "/api/hc/"     # ヘルスチェックで使用するパス
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
  listener_arn = aws_lb_listener.alb_app_listener_http_user.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.alb_app_target_group_user.arn
  }

  condition {
    path_pattern {
      values = ["/*"]
    }
  }
}
