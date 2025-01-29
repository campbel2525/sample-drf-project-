from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from app.core.authentications.authentications import auth_model


class LoginRequest(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class RefreshRequest(serializers.Serializer):
    refresh_token = serializers.CharField()


class SignupRequest(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8)
    name = serializers.CharField()

    def validate(self, attrs):
        if auth_model().objects.filter(email=attrs.get("email")).exists():
            raise ValidationError({"email": "すでに登録済みのメールアドレスです。"})
        return attrs


class UpdateProfileRequest(serializers.Serializer):
    name = serializers.CharField()


class UpdatePasswordRequest(serializers.Serializer):
    current_password = serializers.CharField(min_length=8)
    new_password = serializers.CharField(min_length=8)

    def validate(self, attrs):
        # 新しいパスワードが古いパスワードと同じかどうかを確認
        if attrs.get("new_password") == attrs.get("current_password"):
            raise ValidationError(
                {"current_password": ["新しいパスワードが古いパスワードと同じです。"]}
            )

        # 現在のユーザーのパスワードを検証
        user = self.context["request"].user
        if not user.check_password(attrs.get("current_password")):
            raise ValidationError(
                {"current_password": ["現在のパスワードが正しくありません。"]}
            )

        return attrs


class UpdateEmailRequest(serializers.Serializer):
    new_email = serializers.EmailField()
    password = serializers.EmailField()


class OneTimePasswordRequest(serializers.Serializer):
    uuid = serializers.UUIDField()
    one_time_password = serializers.CharField()


class ResetPasswordRequest(serializers.Serializer):
    email = serializers.EmailField()


class ResetPasswordConfirmRequest(serializers.Serializer):
    token = serializers.CharField()
    new_password = serializers.CharField()
