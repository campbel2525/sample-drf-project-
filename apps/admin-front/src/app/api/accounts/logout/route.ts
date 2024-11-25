import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from '@/config/settings'
import { errorResponse } from '@/utils/backend-client'
import { checkCsrfToken } from '@/utils/csrf-token'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    checkCsrfToken(request)

    // クッキーからjwtを削除
    cookies().set({
      name: ACCESS_TOKEN_COOKIE_NAME,
      value: '',
      httpOnly: true,
      secure: true,
      maxAge: 0,
    })
    cookies().set({
      name: REFRESH_TOKEN_COOKIE_NAME,
      value: '',
      httpOnly: true,
      secure: true,
      maxAge: 0,
    })

    return new NextResponse(null, { status: 200 })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return errorResponse(errorMessage as string, 500)
  }
}
