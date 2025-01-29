from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import connection


class Command(BaseCommand):
    help = "データベースの全てのテーブルを削除するコマンドです"

    def handle(self, *args, **kwargs) -> None:
        if not settings.DEBUG:
            print("デバッグ環境ではないため実行できません")
            return

        # リレーション関係を無視する設定
        with connection.cursor() as cursor:
            cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")

        # テーブルを削除
        table_names = connection.introspection.table_names()
        for table_name in table_names:
            with connection.cursor() as cursor:
                cursor.execute(f"DROP TABLE {table_name} CASCADE")

        # リレーション関係を無視する設定を元に戻す
        with connection.cursor() as cursor:
            cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")
