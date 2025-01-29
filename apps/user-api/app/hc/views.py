from rest_framework import status
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(["GET"])
@permission_classes([AllowAny])
@authentication_classes([])
def hc(request):
    return Response(
        "user-api Healthy.", content_type="text/html", status=status.HTTP_200_OK
    )
