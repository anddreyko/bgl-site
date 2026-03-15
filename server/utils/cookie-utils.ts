import type { H3Event } from 'h3'
import { decodeJwtPayload } from '~/server/utils/jwt'

const ACCESS_TOKEN = 'access_token'
const REFRESH_TOKEN = 'refresh_token'

export interface TokenData {
  accessToken: string
  refreshToken: string
}

function maxAgeFromJwt(token: string, fallback: number): number {
  const payload = decodeJwtPayload(token)
  return payload.exp
    ? payload.exp - Math.floor(Date.now() / 1000)
    : fallback
}

export function setAuthCookies(event: H3Event, tokens: TokenData): void {
  const secure = getRequestURL(event).protocol === 'https:'

  setCookie(event, ACCESS_TOKEN, tokens.accessToken, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: maxAgeFromJwt(tokens.accessToken, 15 * 60),
  })

  // Clean up legacy cookie with old path
  deleteCookie(event, REFRESH_TOKEN, { path: '/api/' })

  const refreshMaxAge = maxAgeFromJwt(tokens.refreshToken, 30 * 24 * 3600)

  setCookie(event, REFRESH_TOKEN, tokens.refreshToken, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: refreshMaxAge,
  })
}

export function clearAuthCookies(event: H3Event): void {
  deleteCookie(event, ACCESS_TOKEN, { path: '/' })
  deleteCookie(event, REFRESH_TOKEN, { path: '/' })
  // Clean up legacy cookies with old path
  deleteCookie(event, REFRESH_TOKEN, { path: '/api/' })
}

export function getAccessToken(event: H3Event): string | undefined {
  return getCookie(event, ACCESS_TOKEN) ?? event.context?.accessToken
}

export function getRefreshToken(event: H3Event): string | undefined {
  return getCookie(event, REFRESH_TOKEN)
}
