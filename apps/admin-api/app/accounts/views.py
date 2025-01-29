from django.db import transaction
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from app.core.authentications.authentications import (
    auth_model,
    create_token,
    get_user_by_token,
)
from app.core.authentications.custom_jwt_authentications import CustomJWTAuthentication
from app.core.enums.admin_user_enums import AdminUserOneTimePasswordType

from ..admin_users.models import AdminUserOneTimePassword
from .emails import send_one_time_password_email
from .requests import LoginRequest, OneTimePasswordRequest, RefreshRequest
from .responses import MeResponse, OneTimePasswordResponse, TokenResponse


class AccountView(viewsets.ViewSet):
    @action(
        detail=False,
        methods=["post"],
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
            admin_user_one_time_password = auth_user.create_one_time_password(
                AdminUserOneTimePasswordType.LOGIN.value
            )

            # email送信
            send_one_time_password_email(admin_user_one_time_password)

        serializer = OneTimePasswordResponse(admin_user_one_time_password)
        return Response(serializer.data, status=status.HTTP_200_OK)

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

        admin_user_one_time_password = (
            AdminUserOneTimePassword.one_time_password_is_valid(
                AdminUserOneTimePasswordType.LOGIN.value,
                uuid=request.data.get("uuid"),
                one_time_password=request.data.get("one_time_password"),
            )
        )

        auth_user = admin_user_one_time_password.admin_user
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
        serializer = MeResponse(request.user, context={"request": request})

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
