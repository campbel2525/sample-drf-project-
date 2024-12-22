// クッキーのプレフィックス
const COOKIE_PREFIX = 'user_front'

// アクセストークンのクッキー名
export const ACCESS_TOKEN_COOKIE_NAME = `${COOKIE_PREFIX}_access_token`

// リフレッシュトークンのクッキー名
export const REFRESH_TOKEN_COOKIE_NAME = `${COOKIE_PREFIX}_refresh_token`

// login用のワンタイムパスワードのクッキー名
export const ONE_TIME_PASSWORD_LOGIN_COOKIE_NAME = `${COOKIE_PREFIX}_one_time_password_login_uuid`

// 登録用のワンタイムパスワードのクッキー名
export const ONE_TIME_PASSWORD_SIGNUP_COOKIE_NAME = `${COOKIE_PREFIX}_one_time_password_signup_uuid`

// email更新用のワンタイムパスワードのクッキー名
export const ONE_TIME_PASSWORD_UPDATE_EMAIL_COOKIE_NAME =
  `${COOKIE_PREFIX}_one_time_password_update_email_uuid`

// アクセストークンの更新の必要性をチェックするためのバッファ
export const ACCESS_TOKEN_UPDATE_BUFFER = 60 * 2 // 2分

// CSRFトークン
export const CSRF_TOKEN_COOKIE_NAME = `${COOKIE_PREFIX}_csrf_token`
export const CSRF_TOKEN_HEADER_NAME = 'X-CSRF-TOKEN'
export const CSRF_TOKEN_EXPIRES_SECONDS = 900 // 15分

// フロントエンドのパス
export const frontPaths = {
  home: '/',

  // accounts
  login: '/accounts/login',
  loginConfirm: '/accounts/login/confirm',
  signup: '/accounts/signup',
  signupConfirm: '/accounts/signup/confirm',
  updateProfile: '/accounts/update-profile',
  updateEmail: '/accounts/update-email',
  updateEmailConfirm: '/accounts/update-email/confirm',
  updatePassword: '/accounts/update-password',
  resetPassword: '/accounts/reset-password',
  resetPasswordConfirm: '/accounts/reset-password/confirm',
}

// ログインページのパス
export const loginPagePath = frontPaths.login

// 認証が必要ないパス
export const authNotRequiredPaths = [
  frontPaths.home,
  frontPaths.login,
  frontPaths.loginConfirm,
  frontPaths.signup,
  frontPaths.signupConfirm,
  frontPaths.resetPassword,
  frontPaths.resetPasswordConfirm,
]
