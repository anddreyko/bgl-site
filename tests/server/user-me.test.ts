import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGetCookie = vi.fn()
vi.mock('h3', async (importOriginal) => {
  const actual = await importOriginal<typeof import('h3')>()
  return {
    ...actual,
    getCookie: (...args: unknown[]) => mockGetCookie(...args),
  }
})

const mockApiFetch = vi.fn()
vi.mock('~/server/utils/api-client', () => ({
  createApiClient: () => mockApiFetch,
  unwrap: (res: { data: unknown }) => res.data,
  handleBackendError: (err: unknown) => { throw err },
}))

function makeToken(payload: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256' })).toString('base64url')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${header}.${body}.fake`
}

describe('server/api/user/me.get', () => {
  beforeEach(() => {
    mockGetCookie.mockReset()
    mockApiFetch.mockReset()
  })

  it('returns full user profile from backend', async () => {
    const token = makeToken({ sub: 'user-42', email: 'test@example.com', name: 'Test' })
    mockGetCookie.mockReturnValue(token)
    mockApiFetch.mockResolvedValue({ data: { id: 'user-42', email: 'test@example.com', name: 'Test' } })

    const { default: handler } = await import('~/server/api/user/me.get')
    const event = { method: 'GET', node: { req: { method: 'GET', headers: {} } } } as never

    const result = await handler(event)

    expect(result).toEqual({ id: 'user-42', email: 'test@example.com', name: 'Test' })
    expect(mockApiFetch).toHaveBeenCalledWith('/v1/user/user-42')
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

  it('throws 401 when JWT has no sub', async () => {
    const token = makeToken({ email: 'test@example.com' })
    mockGetCookie.mockReturnValue(token)

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
})
