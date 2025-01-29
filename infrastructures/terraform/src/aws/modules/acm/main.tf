terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.5"
    }
  }
}

data "aws_acm_certificate" "wildcard" {
  domain   = "*.${var.domain}"
  statuses = ["ISSUED"]
}
