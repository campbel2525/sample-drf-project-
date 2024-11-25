import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

import { CSRF_TOKEN_COOKIE_NAME, CSRF_TOKEN_HEADER_NAME } from '@/config/settings'

// CSRFトークン生成関数
export const generateCsrfToken = () => {
  if (!process.env.SECRET_KEY) {
    throw new Error('SECRET_KEY is not defined')
  }
  return jwt.sign({}, process.env.SECRET_KEY, { expiresIn: '15m' }) // 15分有効なトークン
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

  // トークンの署名を検証
  try {
    if (!process.env.SECRET_KEY) {
      throw new Error('SECRET_KEY is not defined')
    }
    jwt.verify(csrfTokenFromCookie, process.env.SECRET_KEY) // トークンの署名を検証
  } catch (err) {
    throw new Error('Invalid CSRF token')
  }
}
