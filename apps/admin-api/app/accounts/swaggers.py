# from drf_spectacular.utils import OpenApiExample, extend_schema
# from rest_framework import status

# from .requests import LoginRequest
# from .responses import TokenResponse, MeResponse

# login_schema = extend_schema(
#     summary="ログイン",
#     description="",
#     request=LoginRequest,
#     responses={
#         status.HTTP_200_OK: TokenResponse,
#         # 400: TokenResponse,
#     },
#     examples=[
#         OpenApiExample(
#             "リクエスト例",
#             value={
#                 "email": "admin1@example.com",
#                 "password": "test1234",
#             },
#             request_only=True,
#         ),
#         OpenApiExample(
#             name="成功時のレスポンス例",
#             value={
#                 "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI4ODE1ODM4LCJpYXQiOjE3MjgyMTEwMzgsImp0aSI6IjJiODgyN2IxNWIyYTQyMThhYzhlODg1OWZkMDQzZGUxIiwidXNlcl9pZCI6MX0.lqLAs0EGp0DELIqHvigrzPCE7xrnx-35ZphbSfi3MFY",  # noqa
#                 "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyOTQyMDYzOCwiaWF0IjoxNzI4MjExMDM4LCJqdGkiOiJmYjBlODM5ZTZmNmI0NjU2OGRiMWUxZDFiYjkxM2M4YiIsInVzZXJfaWQiOjF9.jepds40mcNlXaA3SdlgGcf_WGurc5Hv8yzklYnR0HKs",  # noqa
#             },
#             response_only=True,
#             status_codes=[status.HTTP_200_OK],
#         ),
#     ],
# )

# me_schema = extend_schema(
#     summary="me",
#     description="",
#     responses={
#         status.HTTP_200_OK: MeResponse,
#         # 400: TokenResponse,
#     },
#     examples=[
#         OpenApiExample(
#             name="成功時のレスポンス例",
#             value={
#                 "id": 1,
#                 "name": "test1",
#                 "email": "test1@example.com",
#                 "created_at": "2024-07-10T00:00:00Z",
#                 "updated_at": "2024-07-10T00:00:00Z",
#             },
#             response_only=True,
#             status_codes=[status.HTTP_200_OK],
#         ),
#     ],
# )
