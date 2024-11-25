import { NextRequest, NextResponse } from 'next/server'

import { ONE_TIME_PASSWORD_UPDATE_EMAIL_COOKIE_NAME } from '@/config/settings'
import { authenticatedClient, errorResponse } from '@/utils/backend-client'
import { getCookie, removeCookie } from '@/utils/cookie'
import { checkCsrfToken } from '@/utils/csrf-token'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    checkCsrfToken(request)

    const uuid = getCookie(ONE_TIME_PASSWORD_UPDATE_EMAIL_COOKIE_NAME)
    if (!uuid) {
      return errorResponse('Forbidden', 403)
    }

    const body = await request.json()
    body.uuid = uuid
    const response = await authenticatedClient(
      'POST',
      `/api/v1/accounts/update-email/confirm/`,
      null,
      body
    )

    const data = await response.json()

    if (response.status === 200) {
      // クッキーのuuidを削除
      removeCookie(ONE_TIME_PASSWORD_UPDATE_EMAIL_COOKIE_NAME)
    }

    return NextResponse.json(data, {
      status: response.status,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return errorResponse(errorMessage as string, 500)
  }
}
