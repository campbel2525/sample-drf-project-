from app.admin_users.models import AdminUser
from app.core.factories.admin_user_factories import AdminUserFactory


class AdminUserSeeder:
    default_password = "test1234"

    def handle(self) -> None:
        password = AdminUser.password_to_hash(self.default_password)

        AdminUserFactory.create(
            email="admin1@example.com",
            password=password,
            is_active=True,
            name="admin1",
        )
        AdminUserFactory.create(
            email="admin2@example.com",
            password=password,
            is_active=True,
            name="admin2",
        )
