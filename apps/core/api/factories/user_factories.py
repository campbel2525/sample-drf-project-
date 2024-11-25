import random

import factory
from django.apps import apps
from factory.django import DjangoModelFactory


class UserFactory(DjangoModelFactory):

    class Meta:
        model = apps.get_model("users.User")
        skip_postgeneration_save = True

    email = factory.Sequence(lambda n: f"user{n}{random.randint(1, 1000)}@example.com")
    password = factory.Faker("password", length=12, special_chars=True)
    is_active = factory.Faker("boolean")
    name = factory.Faker("name")
    post_code = factory.Faker("postcode")
    country_code = factory.Faker("country_code")
    prefecture = factory.Faker("state")
    address1 = factory.Faker("street_address")
    address2 = factory.Faker("secondary_address")
    tel1 = factory.Faker("numerify", text="080-####-####")
    tel2 = factory.Faker("numerify", text="080-####-####")
