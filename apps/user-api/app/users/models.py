from django.utils import timezone
from rest_framework.exceptions import ValidationError

from app.core.base_models.base_user_models import (
    BaseUserModel,
    BaseUserOneTimePasswordModel,
    BaseUserResetPasswordModel,
)
from app.core.utils.utils import (
    generate_random_integer_by_digits,
    generate_random_string,
)


class User(BaseUserModel):

    class Meta:
        db_table = "users"
        managed = False

    def check_password(self, raw_password: str) -> bool:
        return self.password == User.password_to_hash(raw_password)

    def create_one_time_password(
        self,
        type: str,
        new_email: str | None = None,
    ) -> "UserOneTimePassword":
        user_one_time_password = self.user_one_time_passwords.create(
            one_time_password=generate_random_integer_by_digits(8),
            type=type,
            new_email=new_email,
            expires_at=timezone.now() + timezone.timedelta(minutes=10),  # type: ignore
        )

        return user_one_time_password

    def create_reset_password(
        self,
    ) -> "UserResetPassword":
        user_reset_password = self.user_reset_passwords.create(
            token=generate_random_string(50),
            expires_at=timezone.now() + timezone.timedelta(minutes=10),  # type: ignore
        )

        return user_reset_password


class UserOneTimePassword(BaseUserOneTimePasswordModel):

    class Meta:
        db_table = "user_one_time_passwords"
        managed = False

    @classmethod
    def one_time_password_is_valid(
        cls,
        type: str,
        uuid: str,
        one_time_password: str,
    ) -> "UserOneTimePassword":
        user_one_time_password = cls.objects.filter(
            uuid=uuid,
            type=type,
            one_time_password=one_time_password,
            expires_at__gte=timezone.now(),
        ).last()

        if user_one_time_password is None:
            raise ValidationError(
                {"one_time_password": ["正しくないワンタイムパスワードです"]}
            )

        if user_one_time_password.is_used:
            raise ValidationError(
                {"one_time_password": ["正しくないワンタイムパスワードです"]}
            )

        user_one_time_password.is_used = True
        user_one_time_password.save()

        return user_one_time_password


class UserResetPassword(BaseUserResetPasswordModel):

    class Meta:
        db_table = "user_reset_passwords"
        managed = False
