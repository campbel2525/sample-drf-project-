import logging

from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.response import Response

from .models import User
from .requests import UserUpdateRequest
from .responses import UserResponse

logger = logging.getLogger(__name__)


class UserView(viewsets.ViewSet):
    def list(self, request):
        user = User.objects.all()
        serializer = UserResponse(user, many=True)

        return Response({"data": serializer.data}, status=status.HTTP_200_OK)

    def retrieve(self, request, pk):
        user = get_object_or_404(User, id=pk)
        serializer = UserResponse(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, pk):
        serializer = UserUpdateRequest(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = get_object_or_404(User, id=pk)
        user.email = request.data.get("email")
        if request.data.get("password"):
            user.password = User.password_to_hash(request.data.get("password"))
        user.name = request.data.get("name")
        user.is_active = request.data.get("is_active")
        user.save()

        serializer = UserResponse(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, pk):
        user = get_object_or_404(User, id=pk)
        user.user_message_count.delete()
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
