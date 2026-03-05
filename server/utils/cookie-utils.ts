import type { H3Event } from 'h3'

const ACCESS_TOKEN = 'access_token'
const REFRESH_TOKEN = 'refresh_token'

export interface TokenData {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export function setAuthCookies(event: H3Event, tokens: TokenData): void {
  const isProduction = process.env.NODE_ENV === 'production'
  setCookie(event, ACCESS_TOKEN, tokens.accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: tokens.expiresIn,
  })
  setCookie(event, REFRESH_TOKEN, tokens.refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/api/auth/',
    maxAge: 30 * 24 * 3600, // 30 days
  })
}

export function clearAuthCookies(event: H3Event): void {
  deleteCookie(event, ACCESS_TOKEN, { path: '/' })
  deleteCookie(event, REFRESH_TOKEN, { path: '/api/auth/' })
}

export function getAccessToken(event: H3Event): string | undefined {
  return getCookie(event, ACCESS_TOKEN)
}

export function getRefreshToken(event: H3Event): string | undefined {
  return getCookie(event, REFRESH_TOKEN)
}
