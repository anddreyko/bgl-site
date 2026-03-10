import type { H3Event } from 'h3'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock modules before imports
const mockSetAuthCookies = vi.fn()
vi.mock('~/server/utils/cookie-utils', () => ({
  setAuthCookies: mockSetAuthCookies,
}))

const mockApi = vi.fn()
vi.mock('~/server/utils/api-client', async (importOriginal) => {
  const h3 = await import('h3')
  globalThis.H3Error = h3.H3Error
  globalThis.createError = h3.createError
  const actual = await importOriginal<typeof import('~/server/utils/api-client')>()
  return {
    ...actual,
    createApiClient: () => mockApi,
    unwrap: (response: { code: number, data: unknown }) => {
      if (response.code !== 0) throw new Error('API error')
      return response.data
    },
  }
})

const mockReadBody = vi.fn()
vi.stubGlobal('readBody', mockReadBody)
vi.stubGlobal('defineEventHandler', (handler: (...args: unknown[]) => unknown) => handler)
vi.stubGlobal('createError', (opts: { statusCode: number, message: string }) => {
  const err = new Error(opts.message) as Error & { statusCode: number }
  err.statusCode = opts.statusCode
  return err
})

describe('POST /api/auth/sign-in', () => {
  const fakeEvent = {} as H3Event

  beforeEach(() => {
    vi.clearAllMocks()
    mockReadBody.mockResolvedValue({ email: 'test@example.com', password: 'pass123' })
  })

  it('calls backend, sets cookies and returns { ok: true }', async () => {
    mockApi.mockResolvedValue({
      code: 0,
      data: {
        accessToken: 'at_abc',
        refreshToken: 'rt_def',
        expiresIn: 3600,
      },
    })

    const { default: handler } = await import('~/server/api/auth/sign-in.post')
    const result = await handler(fakeEvent)

    expect(mockApi).toHaveBeenCalledWith('/v1/auth/sign-in', {
      method: 'POST',
      body: { email: 'test@example.com', password: 'pass123' },
    })
    expect(mockSetAuthCookies).toHaveBeenCalledWith(fakeEvent, {
      accessToken: 'at_abc',
      refreshToken: 'rt_def',
      expiresIn: 3600,
    })
    expect(result).toEqual({ ok: true })
  })

  it('throws 502 on unknown error', async () => {
    mockApi.mockRejectedValue(new Error('network'))

    const { default: handler } = await import('~/server/api/auth/sign-in.post')

    await expect(handler(fakeEvent)).rejects.toThrow('Service temporarily unavailable')
  })
})
