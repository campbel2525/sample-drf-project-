import hashlib
import uuid

from django.contrib.auth.models import AbstractBaseUser
from django.db import models

from app.core.base_models.base_auth_user import CustomUserManager


class BaseAdminUserModel(AbstractBaseUser):

    objects = CustomUserManager()
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    class Meta:
        abstract = True

    def __str__(self):
        return str(self.id)

    id = models.BigAutoField(
        primary_key=True,
    )
    email = models.CharField(
        max_length=255,
        unique=True,
        db_comment="メールアドレス",
    )
    password = models.CharField(
        max_length=255,
        db_comment="パスワード",
    )
    is_active = models.BooleanField(
        default=True,
        db_comment="アクティブかどうか",
    )
    name = models.CharField(
        max_length=255,
        db_comment="名前",
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        db_comment="作成日時",
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        db_comment="更新日時",
    )

    @classmethod
    def password_to_hash(cls, password: str) -> str:
        return hashlib.sha512(password.encode("utf-8")).hexdigest()


class BaseAdminUserOneTimePasswordModel(models.Model):

    class Meta:
        abstract = True

    def __str__(self):
        return str(self.id)

    id = models.BigAutoField(
        primary_key=True,
    )
    uuid = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True,
        db_comment="ワンタイムパスワードUUID",
    )
    admin_user = models.ForeignKey(
        "admin_users.AdminUser",
        on_delete=models.RESTRICT,
        related_name="admin_user_one_time_passwords",
    )
    is_used = models.BooleanField(
        default=False,
        db_comment="使用済みかどうか",
    )
    type = models.CharField(
        max_length=255,
        db_comment="種類 login",
    )
    one_time_password = models.CharField(
        max_length=255,
        db_comment="1回限りのトークン",
    )
    new_email = models.CharField(
        max_length=255,
        null=True,
        default=None,
        db_comment="新しいメールアドレス",
    )
    expires_at = models.DateTimeField(
        db_comment="有効期限",
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        db_comment="作成日時",
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        db_comment="更新日時",
    )
