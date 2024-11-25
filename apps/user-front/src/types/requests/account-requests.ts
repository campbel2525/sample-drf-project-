export type LoginRequest = {
  email: string
  password: string
}

export type SignupRequest = {
  email: string
  password: string
  name: string
}

export type UpdateProfileRequest = {
  name: string
}

export type OneTimePasswordRequest = {
  one_time_password: string
}

export type UpdateEmailRequest = {
  new_email: string
  password: string
}

export type ResetPasswordRequest = {
  email: string
}

export type ResetPasswordConfirmRequest = {
  token: string
  new_password: string
}

export type UpdatePasswordRequest = {
  current_password: string
  new_password: string
}
