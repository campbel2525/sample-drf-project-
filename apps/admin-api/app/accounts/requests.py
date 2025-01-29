from rest_framework import serializers


class LoginRequest(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class RefreshRequest(serializers.Serializer):
    refresh_token = serializers.CharField()


class OneTimePasswordRequest(serializers.Serializer):
    uuid = serializers.UUIDField()
    one_time_password = serializers.CharField()
