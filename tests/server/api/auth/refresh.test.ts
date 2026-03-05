import type { H3Event } from 'h3'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGetRefreshToken = vi.fn()
const mockSetAuthCookies = vi.fn()
const mockClearAuthCookies = vi.fn()

vi.mock('~/server/utils/cookie-utils', () => ({
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

describe('POST /api/auth/refresh', () => {
  const fakeEvent = {} as H3Event

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('refreshes tokens and sets cookies', async () => {
    mockGetRefreshToken.mockReturnValue('old_refresh')
    mockFetch.mockResolvedValue({
      data: {
        access_token: 'new_at',
        refresh_token: 'new_rt',
        expires_in: 7200,
      },
    })

    const { default: handler } = await import('~/server/api/auth/refresh.post')
    const result = await handler(fakeEvent)

    expect(mockFetch).toHaveBeenCalledWith('/v1/auth/refresh', expect.objectContaining({
      method: 'POST',
      body: { refreshToken: 'old_refresh' },
    }))
    expect(mockSetAuthCookies).toHaveBeenCalledWith(fakeEvent, {
      accessToken: 'new_at',
      refreshToken: 'new_rt',
      expiresIn: 7200,
    })
    expect(result).toEqual({ ok: true })
  })

  it('throws 401 when no refresh token', async () => {
    mockGetRefreshToken.mockReturnValue(undefined)

    const { default: handler } = await import('~/server/api/auth/refresh.post')

    await expect(handler(fakeEvent)).rejects.toThrow('No refresh token')
  })

  it('clears cookies and throws on refresh failure', async () => {
    mockGetRefreshToken.mockReturnValue('old_refresh')
    mockFetch.mockRejectedValue(new Error('network'))

    const { default: handler } = await import('~/server/api/auth/refresh.post')

    await expect(handler(fakeEvent)).rejects.toThrow('Refresh failed')
    expect(mockClearAuthCookies).toHaveBeenCalledWith(fakeEvent)
  })
})
