import { jwtDecode } from 'jwt-decode'

import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_UPDATE_BUFFER,
} from '@/config/settings'
import { setCookie, getCookie } from '@/utils/cookie'

interface DecodedToken {
  exp: number
}

export const getAccessToken = () => {
  return getCookie(ACCESS_TOKEN_COOKIE_NAME)
}

export const getRefreshToken = () => {
  return getCookie(REFRESH_TOKEN_COOKIE_NAME)
}

// 有効期限の取得
// UNIXタイムスタンプ（秒単位）を返す
function getTokenExpiration(token: string): number {
  const decoded: DecodedToken = jwtDecode(token)
  return decoded.exp
}

// トークンの有効期限が切れているかどうかをチェック
function isTokenExpired(token: string): boolean {
  const expiration = getTokenExpiration(token)
  const currentTime = Math.floor(Date.now() / 1000) // 現在の時間を秒で取得
  return expiration < currentTime // 有効期限と現在の時間を比較
}

// トークンの更新が必要かどうかチェック
function isUpdateTokenNeeded(token: string): boolean {
  const expiration = getTokenExpiration(token)
  const currentTime = Math.floor(Date.now() / 1000) // 現在の時間を秒で取得
  return expiration < currentTime + ACCESS_TOKEN_UPDATE_BUFFER // 有効期限と現在の時間を比較
}

export function setTokenCookie(name: string, token: string) {
  setCookie(
    name,
    token,
    false,
    getTokenExpiration(token) - Math.floor(Date.now() / 1000)
  )
}

// アクセストークンの更新の必要性をチェックし、更新を行う
export async function checkToken() {
  const accessToken = getAccessToken()
  if (accessToken && !isUpdateTokenNeeded(accessToken)) {
    return true
  }

  const refreshToken = getRefreshToken()
  if (!refreshToken || !isTokenExpired(refreshToken)) {
    return false
  }

  const response = await fetch('/api/accounts/refresh-token', {
    method: 'POST',
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  })

  if (!response.ok) {
    return false
  }

  const data = await response.json()

  // トークンセット
  setTokenCookie(ACCESS_TOKEN_COOKIE_NAME, data.accessToken)
  setTokenCookie(REFRESH_TOKEN_COOKIE_NAME, data.refreshToken)

  return true
}
