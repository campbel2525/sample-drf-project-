from app.core.factories.user_factories import UserFactory

from .models import User


class UserSeeder:
    default_password = "test1234"

    def handle(self) -> None:
        password = User.password_to_hash(self.default_password)

        UserFactory.create(
            email="user1@example.com",
            password=password,
            is_active=True,
            name="user1",
        )
        UserFactory.create()
        UserFactory.create()
        UserFactory.create()
        UserFactory.create()
