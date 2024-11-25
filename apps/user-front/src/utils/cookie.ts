import { cookies } from 'next/headers'

export function setCookie(
  name: string,
  value: string,
  httpOnly: boolean, // trueだとjsからアクセスできない
  maxAge: number
) {
  cookies().set({
    name: name,
    value: value,
    httpOnly: httpOnly,
    secure: true,
    maxAge: maxAge,
    sameSite: 'lax',
  })
}

export function getCookie(name: string) {
  const cookieStore = cookies()
  return cookieStore.get(name)?.value || null
}

export function removeCookie(name: string) {
  const cookie = getCookie(name)
  if (!cookie) {
    return
  }
  setCookie(name, '', true, 0)
}
