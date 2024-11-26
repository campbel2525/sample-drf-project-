from django.core.management.base import BaseCommand
from django.conf import settings

from app.admin_users.seeders import AdminUserSeeder
from app.users.seeders import UserSeeder


class Command(BaseCommand):
    help = "ユーザー関連のシードデータを作成するコマンドです"

    def handle(self, *args, **kwargs) -> None:
        if not settings.DEBUG:
            print("デバッグ環境ではないため実行できません")
            return

        AdminUserSeeder().handle()
        UserSeeder().handle()
