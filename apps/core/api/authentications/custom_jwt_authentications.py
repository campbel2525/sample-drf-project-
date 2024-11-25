import jwt
from rest_framework import exceptions
from rest_framework.authentication import BaseAuthentication

from .authentications import get_user_by_token


class CustomJWTAuthentication(BaseAuthentication):
    """
    独自のJWT認証クラス
    """

    def authenticate(self, request):
        # Authorizationヘッダーからトークンを取得
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            raise exceptions.AuthenticationFailed()

        try:
            # Authorizationヘッダーからトークンを取得
            authorization = request.headers.get("Authorization")
            if authorization is None or not authorization.startswith("Bearer "):
                raise exceptions.AuthenticationFailed()

            # トークン検証〜ユーザー取得
            access_token = authorization.split(" ")[1]
            auth_user = get_user_by_token(access_token, "access_token")

            return (auth_user, access_token)

        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("Token has expired")
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed("Invalid token")

    def authenticate_header(self, request):
        # 401 Unauthorizedの場合に返すWWW-Authenticateヘッダー
        return "Bearer"
