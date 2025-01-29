from rest_framework import serializers


class TokenResponse(serializers.Serializer):
    access_token = serializers.CharField()
    refresh_token = serializers.CharField()


class MeResponse(serializers.Serializer):
    email = serializers.CharField()
    name = serializers.CharField()
    created_at = serializers.DateTimeField()
    updated_at = serializers.DateTimeField()


class OneTimePasswordResponse(serializers.Serializer):
    uuid = serializers.UUIDField()
    expires_at = serializers.DateTimeField()
