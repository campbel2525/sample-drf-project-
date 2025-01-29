from rest_framework import serializers


class UserUpdateRequest(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(allow_null=True)
    name = serializers.CharField()
    is_active = serializers.BooleanField()
