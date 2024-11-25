import random


def generate_random_integer_by_digits(digits=10):
    if digits < 1:
        raise ValueError("桁数は1以上である必要があります")
    start = 10 ** (digits - 1)
    end = 10**digits - 1
    return random.randint(start, end)
