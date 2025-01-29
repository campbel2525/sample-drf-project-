from django.utils import timezone
from rest_framework.exceptions import ValidationError

from app.core.base_models.base_admin_user_models import (
    BaseAdminUserModel,
    BaseAdminUserOneTimePasswordModel,
)
from app.core.utils.utils import generate_random_integer_by_digits


class AdminUser(BaseAdminUserModel):

    class Meta:
        db_table = "admin_users"
        db_table_comment = "管理者ユーザー"

    def check_password(self, raw_password: str) -> bool:
        return self.password == AdminUser.password_to_hash(raw_password)

    def create_one_time_password(
        self,
        type: str,
        new_email: str | None = None,
    ) -> "AdminUserOneTimePassword":
        admin_user_one_time_password = self.admin_user_one_time_passwords.create(
            one_time_password=generate_random_integer_by_digits(8),
            type=type,
            new_email=new_email,
            expires_at=timezone.now() + timezone.timedelta(minutes=10),  # type: ignore
        )

        return admin_user_one_time_password


class AdminUserOneTimePassword(BaseAdminUserOneTimePasswordModel):

    class Meta:
        db_table = "admin_user_one_time_passwords"
        db_table_comment = "管理者ユーザー"

    @classmethod
    def one_time_password_is_valid(
        cls,
        type: str,
        uuid: str,
        one_time_password: str,
    ) -> "AdminUserOneTimePassword":
        admin_user_one_time_password = cls.objects.filter(
            uuid=uuid,
            type=type,
            one_time_password=one_time_password,
            expires_at__gte=timezone.now(),
        ).last()

        if admin_user_one_time_password is None:
            raise ValidationError(
                {"one_time_password": ["正しくないワンタイムパスワードです"]}
            )

        if admin_user_one_time_password.is_used:
            raise ValidationError(
                {"one_time_password": ["正しくないワンタイムパスワードです"]}
            )

        admin_user_one_time_password.is_used = True
        admin_user_one_time_password.save()

        return admin_user_one_time_password
