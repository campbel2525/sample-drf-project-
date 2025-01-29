import { NextRequest, NextResponse } from 'next/server'

import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  ONE_TIME_PASSWORD_LOGIN_COOKIE_NAME,
} from '@/config/settings'
import { unauthenticatedClient, errorResponse } from '@/utils/backend-client'
import { getCookie, removeCookie } from '@/utils/cookie'
import { checkCsrfToken } from '@/utils/csrf-token'
import { setTokenCookie } from '@/utils/jwt'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    checkCsrfToken(request)

    const uuid = getCookie(ONE_TIME_PASSWORD_LOGIN_COOKIE_NAME)
    if (!uuid) {
      return errorResponse('Forbidden', 403)
    }

    const body = await request.json()
    body.uuid = uuid
    const response = await unauthenticatedClient(
      'POST',
      '/api/v1/accounts/login/confirm/',
      null,
      body
    )

    const data = await response.json()

    if (response.status === 200) {
      // クッキーのuuidを削除
      removeCookie(ONE_TIME_PASSWORD_LOGIN_COOKIE_NAME)

      // トークンのセット
      setTokenCookie(ACCESS_TOKEN_COOKIE_NAME, data.access_token)
      setTokenCookie(REFRESH_TOKEN_COOKIE_NAME, data.refresh_token)
    }

    return NextResponse.json(data, {
      status: response.status,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return errorResponse(errorMessage as string, 500)
  }
}
