import { NextRequest, NextResponse } from 'next/server'

import { ONE_TIME_PASSWORD_LOGIN_COOKIE_NAME } from '@/config/settings'
import { calculateSeconds } from '@/helpers/date'
import { unauthenticatedClient, errorResponse } from '@/utils/backend-client'
import { setCookie } from '@/utils/cookie'
import { checkCsrfToken } from '@/utils/csrf-token'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    checkCsrfToken(request)

    const body = await request.json()
    const response = await unauthenticatedClient(
      'POST',
      '/api/v1/accounts/login/',
      null,
      body
    )

    const data = await response.json()

    if (response.status === 200) {
      // クッキーにuuidをセット
      const maxAge = calculateSeconds(data.expires_at)
      setCookie(ONE_TIME_PASSWORD_LOGIN_COOKIE_NAME, data.uuid, true, maxAge)
    }

    return NextResponse.json(data, {
      status: response.status,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return errorResponse(errorMessage as string, 500)
  }
}
