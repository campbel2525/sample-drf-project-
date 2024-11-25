from django.core.management.base import BaseCommand

from app.admin_users.seeders import AdminUserSeeder
from app.users.seeders import UserSeeder


class Command(BaseCommand):
    help = "ユーザー関連のシードデータを作成します"

    def handle(self, *args, **kwargs) -> None:
        AdminUserSeeder().handle()
        UserSeeder().handle()
