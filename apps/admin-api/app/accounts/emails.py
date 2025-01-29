from django.conf import settings
from django.core.mail import EmailMessage
from django.template.loader import render_to_string

from app.admin_users.models import AdminUserOneTimePassword


def send_one_time_password_email(
    admin_user_one_time_password: AdminUserOneTimePassword,
):
    admin_user = admin_user_one_time_password.admin_user
    one_time_password = admin_user_one_time_password.one_time_password

    content = render_to_string(
        "emails/one_time_password.html",
        {"one_time_password": one_time_password},
    )

    email = EmailMessage(
        subject="ワンタイムパスワード",
        body=content,
        from_email=settings.EMAIL_HOST_USER,
        to=[admin_user.email],
    )
    email.content_subtype = "html"
    email.send()
