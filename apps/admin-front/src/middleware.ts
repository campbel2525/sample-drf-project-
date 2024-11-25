import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { authNotRequiredPaths } from '@/config/settings'
import { frontPaths } from '@/config/settings'
import { checkToken } from '@/utils/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const fileExtensionPattern = /\.(ico|css|js|png|jpg|jpeg|gif|svg|woff|woff2|map)$/
  if (fileExtensionPattern.test(pathname)) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // 認証が必要なパスはトークンのチェック
  if (!authNotRequiredPaths.includes(pathname)) {
    const success = await checkToken()
    if (!success) {
      return NextResponse.redirect(new URL(frontPaths.login, request.url))
    }
  }

  return NextResponse.next()
}
