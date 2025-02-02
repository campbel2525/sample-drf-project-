import Cookies from 'js-cookie'
import { CSRF_TOKEN_COOKIE_NAME } from '@/config/settings'

// APIリクエスト
export const client = async (
  method: string,
  path: string,
  queryParams: null | Record<string, string> = null,
  body: null | Record<string, string | number | boolean | null> = null
  // accessToken: string = ''
): Promise<Response> => {
  // クエリパラメータをURLに追加
  let url = path
  if (queryParams && Object.keys(queryParams).length > 0) {
    url += `?${new URLSearchParams(queryParams).toString()}`
  }

  // ヘッダーを設定
  const headers: Record<string, string> = {}
  // if (accessToken) {
  //   headers.Cookie = `access_token=${accessToken}`
  // }

  // CSRFトークンをセット
  const csrfToken = await getCsrfToken()
  headers['X-CSRF-TOKEN'] = csrfToken

  if (body && Object.keys(body).length > 0) {
    headers['Content-Type'] = 'application/json' as string
  }

  // リクエスト
  const response = await fetch(url, {
    method: method,
    headers: headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
    credentials: 'include',
  })

  return response
}

// クッキーのcsrfトークンを取得
// 存在しない場合はcsrfトークンを取得する
export const getCsrfToken = async (): Promise<string> => {
  const csrfToken = Cookies.get(CSRF_TOKEN_COOKIE_NAME)
  if (csrfToken) {
    return csrfToken
  }

  // csrfトークンクッキーにセット
  const result = await fetch('/api/csrf-token')
  if (!result.ok) {
    throw new Error('Failed to get CSRF token')
  }

  const data = await result.json()
  return data.csrf_token
}
