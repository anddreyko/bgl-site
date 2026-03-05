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

describe('cookie-utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('setAuthCookies', () => {
    it('sets access_token and refresh_token cookies', () => {
      setAuthCookies(fakeEvent, {
        accessToken: 'abc123',
        refreshToken: 'ref456',
        expiresIn: 3600,
      })

      expect(mockSetCookie).toHaveBeenCalledTimes(2)

      expect(mockSetCookie).toHaveBeenCalledWith(
        fakeEvent,
        'access_token',
        'abc123',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          maxAge: 3600,
        }),
      )

      expect(mockSetCookie).toHaveBeenCalledWith(
        fakeEvent,
        'refresh_token',
        'ref456',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
          path: '/api/auth/',
          maxAge: 30 * 24 * 3600,
        }),
      )
    })

    it('sets secure flag based on NODE_ENV', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      setAuthCookies(fakeEvent, {
        accessToken: 'abc',
        refreshToken: 'ref',
        expiresIn: 3600,
      })

      expect(mockSetCookie).toHaveBeenCalledWith(
        fakeEvent,
        'access_token',
        'abc',
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
      expect(mockDeleteCookie).toHaveBeenCalledWith(fakeEvent, 'refresh_token', { path: '/api/auth/' })
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
