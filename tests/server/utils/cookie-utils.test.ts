import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setAuthCookies, clearAuthCookies, getAccessToken, getRefreshToken } from '~/server/utils/cookie-utils'
import type { H3Event } from 'h3'

// Mock h3 cookie functions (auto-imported in Nuxt server context)
const mockSetCookie = vi.fn()
const mockDeleteCookie = vi.fn()
const mockGetCookie = vi.fn()

vi.stubGlobal('setCookie', mockSetCookie)
vi.stubGlobal('deleteCookie', mockDeleteCookie)
vi.stubGlobal('getCookie', mockGetCookie)

const fakeEvent = {} as H3Event

function makeJwt(payload: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256' })).toString('base64url')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${header}.${body}.fake`
}

describe('cookie-utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('setAuthCookies', () => {
    it('sets access_token and refresh_token cookies with exp from JWT', () => {
      const refreshExp = Math.floor(Date.now() / 1000) + 7 * 24 * 3600
      const accessToken = makeJwt({ sub: 'user-1', exp: Math.floor(Date.now() / 1000) + 3600 })
      const refreshToken = makeJwt({ sub: 'user-1', exp: refreshExp })

      setAuthCookies(fakeEvent, {
        accessToken,
        refreshToken,
        expiresIn: 3600,
      })

      expect(mockSetCookie).toHaveBeenCalledTimes(2)

      expect(mockSetCookie).toHaveBeenCalledWith(
        fakeEvent,
        'access_token',
        accessToken,
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          maxAge: 3600,
        }),
      )

      const refreshCall = mockSetCookie.mock.calls.find(
        (c: unknown[]) => c[1] === 'refresh_token',
      )
      expect(refreshCall).toBeTruthy()
      const refreshMaxAge = refreshCall![3].maxAge as number
      expect(refreshMaxAge).toBeGreaterThan(6 * 24 * 3600)
      expect(refreshMaxAge).toBeLessThanOrEqual(7 * 24 * 3600)
    })

    it('falls back to 30 days when refresh JWT has no exp', () => {
      const accessToken = makeJwt({ sub: 'user-1' })
      const refreshToken = makeJwt({ sub: 'user-1' })

      setAuthCookies(fakeEvent, {
        accessToken,
        refreshToken,
        expiresIn: 3600,
      })

      const refreshCall = mockSetCookie.mock.calls.find(
        (c: unknown[]) => c[1] === 'refresh_token',
      )
      expect(refreshCall![3].maxAge).toBe(30 * 24 * 3600)
    })

    it('sets secure flag based on NODE_ENV', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      const accessToken = makeJwt({ sub: 'user-1' })
      const refreshToken = makeJwt({ sub: 'user-1' })

      setAuthCookies(fakeEvent, {
        accessToken,
        refreshToken,
        expiresIn: 3600,
      })

      expect(mockSetCookie).toHaveBeenCalledWith(
        fakeEvent,
        'access_token',
        accessToken,
        expect.objectContaining({ secure: true }),
      )

      process.env.NODE_ENV = originalEnv
    })
  })

  describe('clearAuthCookies', () => {
    it('deletes both cookies with correct paths', () => {
      clearAuthCookies(fakeEvent)

      expect(mockDeleteCookie).toHaveBeenCalledTimes(2)
      expect(mockDeleteCookie).toHaveBeenCalledWith(fakeEvent, 'access_token', { path: '/' })
      expect(mockDeleteCookie).toHaveBeenCalledWith(fakeEvent, 'refresh_token', { path: '/api/' })
    })
  })

  describe('getAccessToken', () => {
    it('returns access_token cookie value', () => {
      mockGetCookie.mockReturnValue('token123')

      const result = getAccessToken(fakeEvent)

      expect(result).toBe('token123')
      expect(mockGetCookie).toHaveBeenCalledWith(fakeEvent, 'access_token')
    })

    it('returns undefined when no cookie', () => {
      mockGetCookie.mockReturnValue(undefined)

      const result = getAccessToken(fakeEvent)

      expect(result).toBeUndefined()
    })
  })

  describe('getRefreshToken', () => {
    it('returns refresh_token cookie value', () => {
      mockGetCookie.mockReturnValue('refresh123')

      const result = getRefreshToken(fakeEvent)

      expect(result).toBe('refresh123')
      expect(mockGetCookie).toHaveBeenCalledWith(fakeEvent, 'refresh_token')
    })
  })
})
