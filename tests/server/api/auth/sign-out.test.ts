import type { H3Event } from 'h3'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockClearAuthCookies = vi.fn()
vi.mock('~/server/utils/cookie-utils', () => ({
  clearAuthCookies: mockClearAuthCookies,
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
  }
})

vi.stubGlobal('defineEventHandler', (handler: (...args: unknown[]) => unknown) => handler)

describe('POST /api/auth/sign-out', () => {
  const fakeEvent = {} as H3Event

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('clears cookies and returns { ok: true }', async () => {
    mockApi.mockResolvedValue({})

    const { default: handler } = await import('~/server/api/auth/sign-out.post')
    const result = await handler(fakeEvent)

    expect(mockClearAuthCookies).toHaveBeenCalledWith(fakeEvent)
    expect(result).toEqual({ ok: true })
  })

  it('clears cookies even if backend fails', async () => {
    mockApi.mockRejectedValue(new Error('network'))

    const { default: handler } = await import('~/server/api/auth/sign-out.post')
    const result = await handler(fakeEvent)

    expect(mockClearAuthCookies).toHaveBeenCalledWith(fakeEvent)
    expect(result).toEqual({ ok: true })
  })
})
