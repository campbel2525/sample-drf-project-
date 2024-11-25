# ---------------------------------------------
# ALB
# ---------------------------------------------
resource "aws_lb" "alb" {
  name                       = "${var.prefix}-alb"
  internal                   = var.alb_internal
  load_balancer_type         = "application"
  idle_timeout               = 60
  enable_deletion_protection = var.alb_enable_deletion_protection # 削除保護 - 本番ではtrueにする
  security_groups            = var.alb_security_groups
  subnets                    = var.alb_subnets

  access_logs {
    bucket  = aws_s3_bucket.alb_log.id
    enabled = true
  }

  depends_on = [aws_s3_bucket.alb_log]
}


# ---------------------------------------------
# albのlogを保存するバケット
# ---------------------------------------------
# alb log
resource "aws_s3_bucket" "alb_log" {
  bucket        = "${var.app_name}-${var.env}-${var.prefix}-alb-log"
  force_destroy = true
}

# 設定
resource "aws_s3_bucket_lifecycle_configuration" "alb_log" {
  bucket = aws_s3_bucket.alb_log.id

  rule {
    id = "${var.prefix}-alb-log-config"
    expiration {
      days = 90 # 削除する日程
    }
    status = "Enabled" # この設定を有効にするか
  }
}

# バージョニングしない
resource "aws_s3_bucket_versioning" "alb_log" {
  bucket = aws_s3_bucket.alb_log.id
  versioning_configuration {
    status = "Disabled"
  }
}

resource "aws_s3_bucket_public_access_block" "alb_log" {
  bucket = aws_s3_bucket.alb_log.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ---------------------------------------------
# elbのlog
# ---------------------------------------------

resource "aws_s3_bucket_policy" "alb_log" {
  bucket = aws_s3_bucket.alb_log.id
  policy = data.aws_iam_policy_document.alb_log.json
}

data "aws_iam_policy_document" "alb_log" {
  statement {
    effect    = "Allow"
    actions   = ["s3:PutObject"]
    resources = ["arn:aws:s3:::${aws_s3_bucket.alb_log.id}/*"]

    principals {
      type        = "AWS"
      identifiers = [var.aws_tokyo_elb_account_id]
    }
  }

  depends_on = [aws_s3_bucket.alb_log]
}
