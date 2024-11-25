import random
import string


def generate_random_string(length=10):
    characters = string.ascii_letters + string.digits  # 英字（大文字・小文字）と数字
    random_string = "".join(random.choices(characters, k=length))
    return random_string


def generate_random_integer_by_digits(digits=10):
    if digits < 1:
        raise ValueError("桁数は1以上である必要があります")
    start = 10 ** (digits - 1)
    end = 10**digits - 1
    return random.randint(start, end)
