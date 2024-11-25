import factory
from django.apps import apps
from factory.django import DjangoModelFactory


class AdminUserFactory(DjangoModelFactory):
    class Meta:
        model = apps.get_model("admin_users.AdminUser")
        skip_postgeneration_save = True

    email = factory.Sequence(lambda n: f"test{n}@example.com")
    password = factory.Faker("pystr", min_chars=10, max_chars=20)
    is_active = factory.Faker("boolean")
    name = factory.Faker("name")
