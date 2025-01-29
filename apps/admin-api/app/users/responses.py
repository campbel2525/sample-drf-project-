from rest_framework import serializers


class UserResponse(serializers.Serializer):
    id = serializers.IntegerField()
    email = serializers.CharField()
    name = serializers.CharField()
    is_active = serializers.BooleanField()
    created_at = serializers.DateTimeField()
    updated_at = serializers.DateTimeField()
