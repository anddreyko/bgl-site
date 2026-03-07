import { describe, it, expect, vi, beforeEach } from 'vitest'

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
    mockGetCookie.mockReset()
  })

  it('returns user data from JWT payload', async () => {
    const token = makeToken({ sub: 'user-42', email: 'test@example.com', name: 'Test' })
    mockGetCookie.mockReturnValue(token)

    const { default: handler } = await import('~/server/api/user/me.get')
    const event = { method: 'GET', node: { req: { method: 'GET', headers: {} } } } as never

    const result = await handler(event)

    expect(result).toEqual({
      id: 'user-42',
      sub: 'user-42',
      email: 'test@example.com',
      name: 'Test',
    })
  })

  it('converts snake_case JWT claims to camelCase', async () => {
    const token = makeToken({ sub: 'user-42', email: 'a@b.com', is_active: true, created_at: '2024-01-01' })
    mockGetCookie.mockReturnValue(token)

    const { default: handler } = await import('~/server/api/user/me.get')
    const event = { method: 'GET', node: { req: { method: 'GET', headers: {} } } } as never

    const result = await handler(event)

    expect(result).toEqual({
      id: 'user-42',
      sub: 'user-42',
      email: 'a@b.com',
      isActive: true,
      createdAt: '2024-01-01',
    })
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
