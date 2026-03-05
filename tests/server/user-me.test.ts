import { describe, it, expect, vi, beforeEach } from 'vitest'
import { H3Error } from 'h3'

const mockFetch = vi.fn()
const mockUnwrap = vi.fn((r: unknown) => r)

vi.mock('~/server/utils/api-client', () => ({
  createApiClient: () => mockFetch,
  unwrap: (r: unknown) => mockUnwrap(r),
}))

const mockGetCookie = vi.fn()
vi.mock('h3', async (importOriginal) => {
  const actual = await importOriginal<typeof import('h3')>()
  return {
    ...actual,
    getCookie: (...args: unknown[]) => mockGetCookie(...args),
  }
})

function makeToken(payload: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256' })).toString('base64url')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${header}.${body}.fake`
}

describe('server/api/user/me.get', () => {
  beforeEach(() => {
    mockFetch.mockReset()
    mockUnwrap.mockReset()
    mockUnwrap.mockImplementation((r: unknown) => r)
    mockGetCookie.mockReset()
  })

  it('decodes JWT and proxies to /v1/user/{sub}', async () => {
    const token = makeToken({ sub: 'user-42' })
    mockGetCookie.mockReturnValue(token)
    const fakeResponse = { code: 0, data: { id: 'user-42', name: 'Test' } }
    mockFetch.mockResolvedValue(fakeResponse)

    const { default: handler } = await import('~/server/api/user/me.get')
    const event = { method: 'GET', node: { req: { method: 'GET', headers: {} } } } as never

    await handler(event)

    expect(mockFetch).toHaveBeenCalledWith('/v1/user/user-42')
    expect(mockUnwrap).toHaveBeenCalledWith(fakeResponse)
  })

  it('throws 401 when no access_token cookie', async () => {
    mockGetCookie.mockReturnValue(undefined)

    const { default: handler } = await import('~/server/api/user/me.get')
    const event = { method: 'GET', node: { req: { method: 'GET', headers: {} } } } as never

    try {
      await handler(event)
      expect.unreachable('should throw')
    }
    catch (err: unknown) {
      expect((err as { statusCode: number }).statusCode).toBe(401)
    }
  })

  it('re-throws H3Error from backend', async () => {
    const token = makeToken({ sub: 'user-1' })
    mockGetCookie.mockReturnValue(token)

    const h3Err = new H3Error('gone')
    h3Err.statusCode = 410
    mockFetch.mockRejectedValue(h3Err)

    const { default: handler } = await import('~/server/api/user/me.get')
    const event = { method: 'GET', node: { req: { method: 'GET', headers: {} } } } as never
    await expect(handler(event)).rejects.toThrow(h3Err)
  })
})
