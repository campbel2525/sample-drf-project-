import logging
import time

import jwt
from django.apps import apps
from rest_framework import exceptions

from config import settings

logger = logging.getLogger(__name__)


def auth_model():
    return apps.get_model(settings.AUTH_APP_NAME, settings.AUTH_MODEL_NAME)


def __typ_check(typ: str):
    if typ not in ["access_token", "refresh_token"]:
        raise exceptions.AuthenticationFailed()


def get_user_by_token(
    token: str,
    typ: str,
):
    """
    tokenの検証を行い認証ユーザーを取得する
    token: access_token or refresh_token
    typ: access_token or refresh_token
    """
    __typ_check(typ)

    payload = __decode_jwt_token(token, typ)

    auth_user = (
        auth_model().objects.filter(id=payload["id"]).filter(is_active=True).get()
    )
    if not auth_user:
        raise exceptions.AuthenticationFailed()

    return auth_user


def create_token(auth_user, typ: str) -> str:
    """
    tokenを生成する
    token: access_token or refresh_token
    typ: access_token or refresh_token
    """
    __typ_check(typ)

    if typ == "access_token":
        return __create_jwt_token(
            auth_user,
            "access_token",
            int(time.time()) + settings.JWT_ACCESS_TOKEN_EXPIRES_SECONDS,
        )

    return __create_jwt_token(
        auth_user,
        "refresh_token",
        int(time.time()) + settings.JWT_REFRESH_TOKEN_EXPIRES_SECONDS,
    )


def __create_jwt_token(
    auth_user,
    typ: str,
    exp: int,
) -> str:
    """
    jwtを生成する
    """
    payload = {
        "id": auth_user.id,
        "exp": exp,
        "typ": typ,
    }

    encoded_jwt = jwt.encode(
        payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM
    )

    return encoded_jwt


def __decode_jwt_token(token: str, typ: str) -> dict:
    """
    jwtをデコードして検証する
    """
    __typ_check(typ)

    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
        )

    # 期限(exp)を過ぎている場合
    except jwt.ExpiredSignatureError:
        raise exceptions.AuthenticationFailed()

    # jwtが不正な場合
    except jwt.InvalidTokenError:
        raise exceptions.AuthenticationFailed()

    if "id" not in payload:
        raise exceptions.AuthenticationFailed()

    if "exp" not in payload:
        raise exceptions.AuthenticationFailed()

    if "typ" not in payload:
        raise exceptions.AuthenticationFailed()

    if payload["typ"] != typ:
        raise exceptions.AuthenticationFailed()

    return payload
