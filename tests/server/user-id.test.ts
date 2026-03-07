import { describe, it, expect, vi, beforeEach } from 'vitest'
import { H3Error } from 'h3'

const mockFetch = vi.fn()
const mockUnwrap = vi.fn((r: unknown) => r)

vi.mock('~/server/utils/api-client', async (importOriginal) => {
  const h3 = await import('h3')
  globalThis.H3Error = h3.H3Error
  globalThis.createError = h3.createError
  const actual = await importOriginal<typeof import('~/server/utils/api-client')>()
  return {
    ...actual,
    createApiClient: () => mockFetch,
    unwrap: (r: unknown) => mockUnwrap(r),
  }
})

describe('server/api/user/[id]', () => {
  beforeEach(() => {
    mockFetch.mockReset()
    mockUnwrap.mockReset()
    mockUnwrap.mockImplementation((r: unknown) => r)
  })

  it('GET proxies to /v1/user/{id}', async () => {
    const fakeResponse = { code: 0, data: { id: 'u1', name: 'Alice' } }
    mockFetch.mockResolvedValue(fakeResponse)

    const { default: handler } = await import('~/server/api/user/[id]')
    const event = {
      method: 'GET',
      node: { req: { method: 'GET' } },
      context: { params: { id: 'u1' } },
    } as never

    await handler(event)

    expect(mockFetch).toHaveBeenCalledWith('/v1/user/u1')
    expect(mockUnwrap).toHaveBeenCalledWith(fakeResponse)
  })

  it('re-throws H3Error', async () => {
    const h3Err = new H3Error('nope')
    h3Err.statusCode = 404
    mockFetch.mockRejectedValue(h3Err)

    const { default: handler } = await import('~/server/api/user/[id]')
    const event = { method: 'GET', node: { req: { method: 'GET' } }, context: { params: { id: 'x' } } } as never
    await expect(handler(event)).rejects.toThrow(h3Err)
  })

  it('wraps non-H3 errors as 502', async () => {
    mockFetch.mockRejectedValue(new Error('fail'))

    const { default: handler } = await import('~/server/api/user/[id]')
    const event = { method: 'GET', node: { req: { method: 'GET' } }, context: { params: { id: 'x' } } } as never

    try {
      await handler(event)
      expect.unreachable('should throw')
    }
    catch (err: unknown) {
      expect((err as { statusCode: number }).statusCode).toBe(502)
    }
  })
})
