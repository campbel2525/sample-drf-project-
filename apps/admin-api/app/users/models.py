from app.core.base_models.base_user_models import (
    BaseUserModel,
    BaseUserOneTimePasswordModel,
    BaseUserResetPasswordModel,
)


class User(BaseUserModel):

    class Meta:
        db_table = "users"
        db_table_comment = "ユーザー"


class UserOneTimePassword(BaseUserOneTimePasswordModel):

    class Meta:
        db_table = "user_one_time_passwords"
        db_table_comment = "ユーザー確認(ログイン認証、新規登録認証などで使用)"


class UserResetPassword(BaseUserResetPasswordModel):

    class Meta:
        db_table = "user_reset_passwords"
        db_table_comment = "ユーザーリセットパスワード"
