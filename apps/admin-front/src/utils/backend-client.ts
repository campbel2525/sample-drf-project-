'use server'

import { NextResponse } from 'next/server'

import { getAccessToken } from './jwt'
import { ACCESS_TOKEN_COOKIE_NAME } from '@/config/settings'

// エラーレスポンス
export const errorResponse = async (
  message: string,
  status: number
): Promise<NextResponse> => {
  return NextResponse.json(
    {
      message: message,
    },
    {
      status: status,
    }
  )
}

// APIリクエスト
export const client = async (
  method: string,
  path: string,
  queryParams: null | Record<string, string> = null,
  body: null | Record<string, string | number | boolean | null> = null,
  accessToken: string = ''
): Promise<Response> => {
  // クエリパラメータをURLに追加
  let url = `${process.env.BACKEND_API_URL}${path}`
  if (queryParams && Object.keys(queryParams).length > 0) {
    url += `?${new URLSearchParams(queryParams).toString()}`
  }

  // ヘッダーを設定
  const headers: Record<string, string> = {}
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }
  if (body && Object.keys(body).length > 0) {
    headers['Content-Type'] = 'application/json' as string
  }

  // リクエスト
  const response = await fetch(url, {
    method: method,
    headers: headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  })

  return response
}

// 認証が不要なAPIリクエスト
export const unauthenticatedClient = async (
  method: string,
  path: string,
  queryParams: null | Record<string, string> = null,
  body: null | Record<string, string | number | boolean | null> = null
): Promise<Response> => {
  return client(method, path, queryParams, body)
}

// 認証が必要なAPIリクエスト
export const authenticatedClient = async (
  method: string,
  path: string,
  queryParams: null | Record<string, string> = null,
  body: null | Record<string, string> = null
): Promise<Response> => {
  const accessToken = getAccessToken()
  if (!accessToken) {
    return Response.json(
      {
        message: 'Unauthorized',
      },
      {
        status: 401,
      }
    )
  }

  return client(method, path, queryParams, body, accessToken)
}

// APIリクエスト
export const fetchClient = async (
  method: string,
  path: string,
  queryParams: null | Record<string, string> = null,
  body: null | Record<string, string | number | boolean | null> = null
) => {
  // クエリパラメータをURLに追加
  let url = `${process.env.FRONTEND_API_URL}${path}`
  if (queryParams && Object.keys(queryParams).length > 0) {
    url += `?${new URLSearchParams(queryParams).toString()}`
  }

  // ヘッダーを設定
  const headers: Record<string, string> = {}

  const accessToken = getAccessToken()
  if (accessToken) {
    headers['Cookie'] = `${ACCESS_TOKEN_COOKIE_NAME}=${accessToken}`
  }
  if (body && Object.keys(body).length > 0) {
    headers['Content-Type'] = 'application/json' as string
  }

  // リクエスト
  const response = await fetch(url, {
    method: method,
    headers: headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
    credentials: 'include', // クッキーを自動で送信
  })

  return response
}
