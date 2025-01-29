# ---------------------------------------------
# Lambda関数のIAMロールとポリシー
# ---------------------------------------------
resource "aws_iam_role" "lambda_role" {
  name = "${aws_lb.alb.name}-log-to-cloudwatch-lambda-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy" "lambda_policy" {
  name = "${aws_lb.alb.name}-log-to-cloudwatch-lambda-role-policy"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Resource = [
          "arn:aws:logs:${var.aws_region}:${var.account_id}:log-group:/aws/alb/*"
        ]
      },
      {
        Effect = "Allow",
        Action = [
          "s3:GetObject"
        ],
        Resource = [
          "${aws_s3_bucket.alb_log.arn}/*"
        ]
      }
    ]
  })
}

# ---------------------------------------------
# Lambda関数の作成
# ---------------------------------------------
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_file = "${path.module}/lambda_function.py"
  output_path = "${path.module}/lambda_function.zip"
}

resource "aws_lambda_function" "alb_log_to_cloudwatch" {
  function_name = "${aws_lb.alb.name}-to-cloudwatch"
  runtime       = "python3.12"
  handler       = "lambda_function.lambda_handler"
  role          = aws_iam_role.lambda_role.arn

  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = filebase64sha256(data.archive_file.lambda_zip.output_path)

  environment {
    variables = {
      LOG_GROUP_NAME = "/aws/alb/${aws_lb.alb.name}"
    }
  }

  depends_on = [aws_iam_role_policy.lambda_policy]
}

# ---------------------------------------------
# Lambda関数への権限設定
# ---------------------------------------------
resource "aws_lambda_permission" "allow_s3_invocation" {
  statement_id  = "AllowS3Invocation"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.alb_log_to_cloudwatch.function_name
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.alb_log.arn
}

# ---------------------------------------------
# S3バケット通知の設定
# ---------------------------------------------
resource "aws_s3_bucket_notification" "alb_log_notification" {
  bucket = aws_s3_bucket.alb_log.id

  lambda_function {
    lambda_function_arn = aws_lambda_function.alb_log_to_cloudwatch.arn
    events              = ["s3:ObjectCreated:*"]
    filter_suffix       = ".log.gz"
  }

  depends_on = [aws_lambda_permission.allow_s3_invocation]
}

# ---------------------------------------------
# CloudWatch Logsグループの設定
# ---------------------------------------------
resource "aws_cloudwatch_log_group" "alb_access_logs" {
  name              = "/aws/alb/${aws_lb.alb.name}"
  retention_in_days = 90
}
