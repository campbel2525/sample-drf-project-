from django.conf import settings
from django.core.mail import EmailMessage
from django.template.loader import render_to_string

from app.users.models import UserOneTimePassword, UserResetPassword


def send_one_time_password_email(user_one_time_password: UserOneTimePassword):
    user = user_one_time_password.user
    one_time_password = user_one_time_password.one_time_password

    content = render_to_string(
        "emails/one_time_password.html",
        {"one_time_password": one_time_password},
    )

    email = EmailMessage(
        subject="ワンタイムパスワード",
        body=content,
        from_email=settings.EMAIL_HOST_USER,
        to=[user.email],
    )
    email.content_subtype = "html"
    email.send()


def send_reset_password_email(user_reset_password: UserResetPassword):
    user = user_reset_password.user
    token = user_reset_password.token

    url = f"{settings.FRONTEND_API_URL}/accounts/reset-password/confirm?token={token}"

    content = render_to_string(
        "emails/reset_password.html",
        {
            "url": url,
        },
    )

    email = EmailMessage(
        subject="パスワードリセット",
        body=content,
        from_email=settings.EMAIL_HOST_USER,
        to=[user.email],
    )
    email.content_subtype = "html"
    email.send()
