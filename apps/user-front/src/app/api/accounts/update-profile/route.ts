import { NextRequest, NextResponse } from 'next/server'

import { authenticatedClient, errorResponse } from '@/utils/backend-client'
import { checkCsrfToken } from '@/utils/csrf-token'

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    checkCsrfToken(request)

    const body = await request.json()
    const response = await authenticatedClient(
      'PUT',
      `/api/v1/accounts/update-profile/`,
      null,
      body
    )

    const data = await response.json()
    return NextResponse.json(data, {
      status: response.status,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return errorResponse(errorMessage as string, 500)
  }
}
