import { NextRequest, NextResponse } from 'next/server'

import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '@/config/settings'
import { client, errorResponse } from '@/utils/backend-client'
import { checkCsrfToken } from '@/utils/csrf-token'
import { setTokenCookie } from '@/utils/jwt'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    checkCsrfToken(request)

    const body = await request.json()
    const response = await client('POST', '/api/v1/accounts/refresh/', null, body)
    const data = await response.json()
    if (response.status !== 200) {
      return NextResponse.json(data, {
        status: response.status,
      })
    }

    const apiResponse = NextResponse.json(data, {
      status: response.status,
    })
    setTokenCookie(ACCESS_TOKEN_COOKIE_NAME, data.access_token)
    setTokenCookie(REFRESH_TOKEN_COOKIE_NAME, data.refresh_token)
    return apiResponse
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return errorResponse(errorMessage as string, 500)
  }
}
