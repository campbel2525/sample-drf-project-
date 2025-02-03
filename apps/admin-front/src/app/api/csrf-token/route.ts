export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

import { CSRF_TOKEN_COOKIE_NAME, CSRF_TOKEN_EXPIRES_SECONDS } from '@/config/settings'
import { errorResponse } from '@/utils/backend-client'
import { generateCsrfToken } from '@/utils/csrf-token'

export async function GET(): Promise<NextResponse> {
  try {
    const csrfToken = generateCsrfToken()

    const data = {
      csrf_token: csrfToken,
    }
    const res = new NextResponse(JSON.stringify(data))
    res.cookies.set(CSRF_TOKEN_COOKIE_NAME, csrfToken, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: CSRF_TOKEN_EXPIRES_SECONDS, // 15分
    })

    return res
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return errorResponse(errorMessage as string, 500)
  }
}
