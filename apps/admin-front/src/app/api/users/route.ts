import { NextRequest, NextResponse } from 'next/server'

import { authenticatedClient, errorResponse } from '@/utils/backend-client'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries())
    const response = await authenticatedClient('GET', '/api/v1/users/', searchParams)
    const data = await response.json()
    return NextResponse.json(data, {
      status: response.status,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return errorResponse(errorMessage as string, 500)
  }
}
