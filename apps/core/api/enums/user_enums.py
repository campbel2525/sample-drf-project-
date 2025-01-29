from enum import Enum


class UserOneTimePasswordType(Enum):
    LOGIN = "login"
    SIGNUP = "signup"
    UPDATE_EMAIL = "update_email"
