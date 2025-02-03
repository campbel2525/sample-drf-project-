import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

import { CSRF_TOKEN_COOKIE_NAME, CSRF_TOKEN_HEADER_NAME } from '@/config/settings'

// CSRFトークン生成関数
export const generateCsrfToken = () => {
  const secretKey = process.env.SECRET_KEY
  if (!secretKey) {
    throw new Error('SECRET_KEY is not defined')
  }

  const now = Math.floor(new Date().getTime() / 1000) // 現在のUNIXタイムスタンプ
  return jwt.sign(
    { iat: now }, // 明示的に `iat` を指定する
    secretKey,
    { expiresIn: '15m' } // 15分後に有効期限が切れる
  )
}

// CSRFトークンの保存
export const checkCsrfToken = (request: NextRequest) => {
  const csrfTokenFromHeader = request.headers.get(CSRF_TOKEN_HEADER_NAME) // ヘッダーから取得
  const csrfTokenFromCookie = request.cookies.get(CSRF_TOKEN_COOKIE_NAME)?.value // クッキーから取得

  // トークンが提供されていない場合はエラー
  if (!csrfTokenFromHeader || !csrfTokenFromCookie) {
    throw new Error('CSRF token Nothing')
  }

  // クッキーとヘッダーのトークンが一致しているか確認
  if (csrfTokenFromHeader !== csrfTokenFromCookie) {
    throw new Error('CSRF token mismatch')
  }

  const secretKey = process.env.SECRET_KEY
  if (!secretKey) {
    throw new Error('SECRET_KEY is not defined')
  }

  jwt.verify(csrfTokenFromCookie, secretKey) // トークンの署名を検証
}
