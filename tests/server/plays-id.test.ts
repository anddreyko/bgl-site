import { describe, it, expect, vi, beforeEach } from 'vitest'
import { H3Error } from 'h3'

const mockFetch = vi.fn()
const mockUnwrap = vi.fn((r: unknown) => r)

vi.mock('~/server/utils/api-client', () => ({
  createApiClient: () => mockFetch,
  unwrap: (r: unknown) => mockUnwrap(r),
}))

const mockReadBody = vi.fn()
vi.mock('h3', async (importOriginal) => {
  const actual = await importOriginal<typeof import('h3')>()
  return {
    ...actual,
    readBody: (...args: unknown[]) => mockReadBody(...args),
  }
})

describe('server/api/plays/[id]', () => {
  beforeEach(() => {
    mockFetch.mockReset()
    mockUnwrap.mockReset()
    mockUnwrap.mockImplementation((r: unknown) => r)
    mockReadBody.mockReset()
  })

  it('GET proxies to /v1/plays/sessions/{id}', async () => {
    const fakeResponse = { code: 0, data: { id: 'p1' } }
    mockFetch.mockResolvedValue(fakeResponse)

    const { default: handler } = await import('~/server/api/plays/[id]')
    const event = {
      method: 'GET',
      node: { req: { method: 'GET' } },
      context: { params: { id: 'p1' } },
    } as never

    await handler(event)

    expect(mockFetch).toHaveBeenCalledWith('/v1/plays/sessions/p1')
    expect(mockUnwrap).toHaveBeenCalledWith(fakeResponse)
  })

  it('PUT proxies to /v1/plays/sessions/{id} with body', async () => {
    const fakeResponse = { code: 0, data: { id: 'p1' } }
    mockFetch.mockResolvedValue(fakeResponse)
    mockReadBody.mockResolvedValue({ visibility: 'public' })

    const { default: handler } = await import('~/server/api/plays/[id]')
    const event = {
      method: 'PUT',
      node: { req: { method: 'PUT' } },
      context: { params: { id: 'p1' } },
    } as never

    await handler(event)

    expect(mockFetch).toHaveBeenCalledWith('/v1/plays/sessions/p1', expect.objectContaining({
      method: 'PUT',
      body: { visibility: 'public' },
    }))
  })

  it('re-throws H3Error', async () => {
    const h3Err = new H3Error('nope')
    h3Err.statusCode = 404
    mockFetch.mockRejectedValue(h3Err)

    const { default: handler } = await import('~/server/api/plays/[id]')
    const event = { method: 'GET', node: { req: { method: 'GET' } }, context: { params: { id: 'x' } } } as never
    await expect(handler(event)).rejects.toThrow(h3Err)
  })

  it('wraps non-H3 errors as 502', async () => {
    mockFetch.mockRejectedValue(new Error('fail'))

    const { default: handler } = await import('~/server/api/plays/[id]')
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
