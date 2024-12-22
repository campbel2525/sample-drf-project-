// クッキーのプレフィックス
const COOKIE_PREFIX = 'admin_front'

// アクセストークンのクッキー名
export const ACCESS_TOKEN_COOKIE_NAME = `${COOKIE_PREFIX}_access_token`

// リフレッシュトークンのクッキー名
export const REFRESH_TOKEN_COOKIE_NAME = `${COOKIE_PREFIX}_refresh_token`

// login用のワンタイムパスワードのクッキー名
export const ONE_TIME_PASSWORD_LOGIN_COOKIE_NAME = `${COOKIE_PREFIX}_one_time_password_login_uuid`

// アクセストークンの更新の必要性をチェックするためのバッファ
export const ACCESS_TOKEN_UPDATE_BUFFER = 60 * 2 // 2分

// CSRFトークン
export const CSRF_TOKEN_COOKIE_NAME = `${COOKIE_PREFIX}_csrf_token`
export const CSRF_TOKEN_HEADER_NAME = 'X-CSRF-TOKEN'
export const CSRF_TOKEN_EXPIRES_SECONDS = 900 // 15分

// フロントエンドのパス
export const frontPaths = {
  home: '/',
  login: '/accounts/login',
  loginConfirm: '/accounts/login/confirm',
  users: '/users',
}

// ログインページのパス
export const loginPagePath = frontPaths.login

// 認証が必要ないパス
export const authNotRequiredPaths = [
  frontPaths.home,
  frontPaths.login,
  frontPaths.loginConfirm,
]
