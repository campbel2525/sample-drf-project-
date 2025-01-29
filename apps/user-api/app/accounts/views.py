from django.db import transaction
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from app.core.authentications.authentications import (
    auth_model,
    create_token,
    get_user_by_token,
)
from app.core.authentications.custom_jwt_authentications import CustomJWTAuthentication
from app.core.enums.user_enums import UserOneTimePasswordType
from app.users.models import User, UserOneTimePassword, UserResetPassword

from .emails import send_one_time_password_email, send_reset_password_email
from .requests import (
    LoginRequest,
    OneTimePasswordRequest,
    RefreshRequest,
    ResetPasswordConfirmRequest,
    ResetPasswordRequest,
    SignupRequest,
    UpdateEmailRequest,
    UpdatePasswordRequest,
    UpdateProfileRequest,
)
from .responses import MeResponse, OneTimePasswordResponse, TokenResponse


class AccountView(viewsets.ViewSet):

    @action(
        detail=False,
        methods=["post"],
        url_path="login",
        name="accounts_login",
        authentication_classes=[],
        permission_classes=[AllowAny],
    )
    def login(self, request):
        serializer = LoginRequest(data=request.data)
        serializer.is_valid(raise_exception=True)

        auth_user = auth_model().objects.filter(email=request.data.get("email")).first()
        if auth_user is None:
            raise AuthenticationFailed("ユーザー名もしくはパスワードが間違っています。")

        if not auth_user.check_password(request.data.get("password")):
            raise AuthenticationFailed("ユーザー名もしくはパスワードが間違っています。")

        with transaction.atomic():
            # ワンタイムパスワード生成
            user_one_time_password = auth_user.create_one_time_password(
                UserOneTimePasswordType.LOGIN.value
            )

            # email送信
            send_one_time_password_email(user_one_time_password)

        serializer = OneTimePasswordResponse(user_one_time_password)
        return Response(serializer.data, status=status.HTTP_200_OK)

        # data = {
        #     "access_token": create_token(auth_user, "access_token"),
        #     "refresh_token": create_token(auth_user, "refresh_token"),
        # }
        # serializer = TokenResponse(data)
        # return Response(serializer.data, status=status.HTTP_200_OK)

    @action(
        detail=False,
        methods=["post"],
        url_path="login/confirm",
        name="accounts_login_confirm",
        authentication_classes=[],
        permission_classes=[AllowAny],
    )
    def login_confirm(self, request):
        serializer = OneTimePasswordRequest(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_one_time_password = UserOneTimePassword.one_time_password_is_valid(
            UserOneTimePasswordType.LOGIN.value,
            uuid=request.data.get("uuid"),
            one_time_password=request.data.get("one_time_password"),
        )

        auth_user = user_one_time_password.user
        data = {
            "access_token": create_token(auth_user, "access_token"),
            "refresh_token": create_token(auth_user, "refresh_token"),
        }
        serializer = TokenResponse(data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(
        detail=False,
        methods=["get"],
        url_path="me",
        name="accounts_me",
        authentication_classes=[CustomJWTAuthentication],
        permission_classes=[AllowAny],
    )
    def me(self, request):
        # serializer = MeResponse(request.user, context={"request": request})
        serializer = MeResponse(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(
        detail=False,
        methods=["post"],
        url_path="refresh",
        name="accounts_refresh",
        authentication_classes=[],
        permission_classes=[AllowAny],
    )
    def refresh(self, request):
        serializer = RefreshRequest(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"errors": serializer.errors},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

        refresh_token = request.data.get("refresh_token")
        auth_user = get_user_by_token(refresh_token, "refresh_token")

        data = {
            "access_token": create_token(auth_user, "access_token"),
            "refresh_token": create_token(auth_user, "refresh_token"),
        }
        serializer = TokenResponse(data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(
        detail=False,
        methods=["post"],
        url_path="signup",
        name="accounts_signup",
        authentication_classes=[],
        permission_classes=[AllowAny],
    )
    def signup(self, request):
        serializer = SignupRequest(data=request.data)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            # ユーザー登録
            password_hash = auth_model().password_to_hash(request.data.get("password"))
            model = auth_model()
            auth_user = model()
            auth_user.email = request.data.get("email")
            auth_user.name = request.data.get("name")
            auth_user.password = password_hash
            auth_user.save()

            # ワンタイムパスワード生成
            user_one_time_password = auth_user.create_one_time_password(
                UserOneTimePasswordType.SIGNUP.value
            )

            # email送信
            send_one_time_password_email(user_one_time_password)

        serializer = OneTimePasswordResponse(user_one_time_password)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(
        detail=False,
        methods=["post"],
        url_path="signup/confirm",
        name="accounts_signup_confirm",
        authentication_classes=[],
        permission_classes=[AllowAny],
    )
    def signup_confirm(self, request):
        serializer = OneTimePasswordRequest(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_one_time_password = UserOneTimePassword.one_time_password_is_valid(
            UserOneTimePasswordType.SIGNUP.value,
            uuid=request.data.get("uuid"),
            one_time_password=request.data.get("one_time_password"),
        )

        # ユーザー情報更新
        auth_user = user_one_time_password.user
        auth_user.is_active = True
        auth_user.is_email_verified = True
        auth_user.save()

        data = {
            "access_token": create_token(auth_user, "access_token"),
            "refresh_token": create_token(auth_user, "refresh_token"),
        }
        serializer = TokenResponse(data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(
        detail=False,
        methods=["put"],
        url_path="update-profile",
        name="accounts_update_profile",
        authentication_classes=[CustomJWTAuthentication],
        permission_classes=[AllowAny],
    )
    def update_profile(self, request):
        serializer = UpdateProfileRequest(data=request.data)
        serializer.is_valid(raise_exception=True)

        auth_user = request.user
        auth_user.name = request.data.get("name")
        auth_user.save()

        serializer = MeResponse(auth_user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(
        detail=False,
        methods=["put"],
        url_path="update-password",
        name="accounts_update_password",
        authentication_classes=[CustomJWTAuthentication],
        permission_classes=[AllowAny],
    )
    def update_password(self, request):
        serializer = UpdatePasswordRequest(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        auth_user = request.user
        auth_user.password = auth_model().password_to_hash(
            request.data.get("new_password")
        )
        auth_user.save()

        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(
        detail=False,
        methods=["post"],
        url_path="update-email",
        name="accounts_update_email",
        authentication_classes=[CustomJWTAuthentication],
        permission_classes=[AllowAny],
    )
    def update_email(self, request):
        serializer = UpdateEmailRequest(data=request.data)
        serializer.is_valid(raise_exception=True)

        # パスワードチェック
        auth_user = request.user
        if not auth_user.check_password(request.data.get("password")):
            raise AuthenticationFailed(
                {"password": ["パスワードが間違っています。"]},
            )

        with transaction.atomic():
            # ワンタイムパスワード生成
            user_one_time_password = auth_user.create_one_time_password(
                UserOneTimePasswordType.UPDATE_EMAIL.value,
                new_email=request.data.get("new_email"),
            )

            # email送信
            send_one_time_password_email(user_one_time_password)

        serializer = OneTimePasswordResponse(user_one_time_password)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(
        detail=False,
        methods=["post"],
        url_path="update-email/confirm",
        name="accounts_update_email_confirm",
        authentication_classes=[CustomJWTAuthentication],
        permission_classes=[AllowAny],
    )
    def update_email_confirm(self, request):
        serializer = OneTimePasswordRequest(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_one_time_password = UserOneTimePassword.one_time_password_is_valid(
            UserOneTimePasswordType.UPDATE_EMAIL.value,
            uuid=request.data.get("uuid"),
            one_time_password=request.data.get("one_time_password"),
        )

        auth_user = user_one_time_password.user
        auth_user.email = user_one_time_password.new_email
        auth_user.save()

        serializer = MeResponse(auth_user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(
        detail=False,
        methods=["post"],
        url_path="reset-password",
        name="reset_password",
        authentication_classes=[],
        permission_classes=[AllowAny],
    )
    def reset_password(self, request):
        serializer = ResetPasswordRequest(data=request.data)
        serializer.is_valid(raise_exception=True)

        auth_user = (
            auth_model()
            .objects.filter(
                email=request.data.get("email"),
                is_active=True,
            )
            .first()
        )
        if auth_user is None:
            return Response(status=status.HTTP_204_NO_CONTENT)

        with transaction.atomic():
            # リセットパスワード生成
            user_reset_password = auth_user.create_reset_password()

            # email送信
            send_reset_password_email(user_reset_password)

        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(
        detail=False,
        methods=["post"],
        url_path="reset-password/confirm",
        name="reset_password_confirm",
        authentication_classes=[],
        permission_classes=[AllowAny],
    )
    def reset_password_confirm(self, request):
        serializer = ResetPasswordConfirmRequest(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_reset_password = UserResetPassword.objects.filter(
            token=request.data.get("token"),
            is_used=False,
            expires_at__gte=timezone.now(),
        ).first()
        if user_reset_password is None:
            raise ValidationError({"token": ["リンク切れもしくは無効なリンクです。"]})

        user = user_reset_password.user

        password_hash = User.password_to_hash(request.data.get("new_password"))
        with transaction.atomic():
            user.password = password_hash
            user.save()

            user_reset_password.is_used = True
            user_reset_password.save()

        return Response(status=status.HTTP_204_NO_CONTENT)
