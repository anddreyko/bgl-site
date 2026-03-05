import type { H3Event } from 'h3'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGetAccessToken = vi.fn()
const mockGetRefreshToken = vi.fn()
const mockSetAuthCookies = vi.fn()
const mockClearAuthCookies = vi.fn()

vi.mock('~/server/utils/cookie-utils', () => ({
  getAccessToken: mockGetAccessToken,
  getRefreshToken: mockGetRefreshToken,
  setAuthCookies: mockSetAuthCookies,
  clearAuthCookies: mockClearAuthCookies,
}))

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)
vi.stubGlobal('defineEventHandler', (handler: (...args: unknown[]) => unknown) => handler)
vi.stubGlobal('useRuntimeConfig', () => ({ apiHost: 'http://api.test' }))
vi.stubGlobal('createError', (opts: { statusCode: number, message: string }) => {
  const err = new Error(opts.message) as Error & { statusCode: number }
  err.statusCode = opts.statusCode
  return err
})

function createFakeEvent(pathname: string) {
  return {
    _requestURL: new URL(`http://localhost${pathname}`),
  }
}

vi.stubGlobal('getRequestURL', (event: { _requestURL: URL }) => event._requestURL)

describe('server/middleware/auth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('skips non-API routes', async () => {
    const event = createFakeEvent('/about')
    const { default: handler } = await import('~/server/middleware/auth')
    const result = await handler(event as unknown as H3Event)
    expect(result).toBeUndefined()
  })

  it('skips public API routes', async () => {
    const publicPaths = ['/api/auth/sign-in', '/api/auth/sign-up', '/api/games', '/api/ping']

    const { default: handler } = await import('~/server/middleware/auth')

    for (const path of publicPaths) {
      const event = createFakeEvent(path)
      const result = await handler(event as unknown as H3Event)
      expect(result).toBeUndefined()
    }
  })

  it('passes through when access token exists', async () => {
    mockGetAccessToken.mockReturnValue('valid_token')
    const event = createFakeEvent('/api/user/me')

    const { default: handler } = await import('~/server/middleware/auth')
    const result = await handler(event as unknown as H3Event)
    expect(result).toBeUndefined()
  })

  it('throws 401 when no tokens exist', async () => {
    mockGetAccessToken.mockReturnValue(undefined)
    mockGetRefreshToken.mockReturnValue(undefined)
    const event = createFakeEvent('/api/user/me')

    const { default: handler } = await import('~/server/middleware/auth')

    await expect(handler(event as unknown as H3Event)).rejects.toThrow('Unauthorized')
  })

  it('refreshes token when access token missing but refresh token exists', async () => {
    mockGetAccessToken.mockReturnValue(undefined)
    mockGetRefreshToken.mockReturnValue('refresh123')
    mockFetch.mockResolvedValue({
      data: {
        access_token: 'new_at',
        refresh_token: 'new_rt',
        expires_in: 3600,
      },
    })
    const event = createFakeEvent('/api/user/me')

    const { default: handler } = await import('~/server/middleware/auth')
    await handler(event as unknown as H3Event)

    expect(mockSetAuthCookies).toHaveBeenCalledWith(event, {
      accessToken: 'new_at',
      refreshToken: 'new_rt',
      expiresIn: 3600,
    })
  })

  it('clears cookies and throws 401 when refresh fails', async () => {
    mockGetAccessToken.mockReturnValue(undefined)
    mockGetRefreshToken.mockReturnValue('bad_refresh')
    mockFetch.mockRejectedValue(new Error('network'))
    const event = createFakeEvent('/api/user/me')

    const { default: handler } = await import('~/server/middleware/auth')

    await expect(handler(event as unknown as H3Event)).rejects.toThrow('Unauthorized')
    expect(mockClearAuthCookies).toHaveBeenCalledWith(event)
  })
})
