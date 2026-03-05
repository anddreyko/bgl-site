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

describe('server/api/mates/index', () => {
  beforeEach(() => {
    mockFetch.mockReset()
    mockUnwrap.mockReset()
    mockUnwrap.mockImplementation((r: unknown) => r)
    mockReadBody.mockReset()
  })

  it('GET proxies to /v1/mates with query params', async () => {
    const fakeResponse = { code: 0, data: { items: [], total: 0 } }
    mockFetch.mockResolvedValue(fakeResponse)

    const { default: handler } = await import('~/server/api/mates/index')

    const event = {
      method: 'GET',
      node: { req: { method: 'GET' } },
    } as never

    await handler(event)

    expect(mockFetch).toHaveBeenCalledWith('/v1/mates', expect.objectContaining({ query: expect.anything() }))
    expect(mockUnwrap).toHaveBeenCalledWith(fakeResponse)
  })

  it('POST proxies to /v1/mates with body', async () => {
    const fakeResponse = { code: 0, data: { id: '1', name: 'Bob' } }
    mockFetch.mockResolvedValue(fakeResponse)
    mockReadBody.mockResolvedValue({ name: 'Bob' })

    const { default: handler } = await import('~/server/api/mates/index')

    const event = {
      method: 'POST',
      node: { req: { method: 'POST' } },
    } as never

    await handler(event)

    expect(mockFetch).toHaveBeenCalledWith('/v1/mates', expect.objectContaining({
      method: 'POST',
      body: { name: 'Bob' },
    }))
    expect(mockUnwrap).toHaveBeenCalledWith(fakeResponse)
  })

  it('re-throws H3Error as-is', async () => {
    const h3Err = new H3Error('Not found')
    h3Err.statusCode = 404
    mockFetch.mockRejectedValue(h3Err)

    const { default: handler } = await import('~/server/api/mates/index')

    const event = { method: 'GET', node: { req: { method: 'GET' } } } as never
    await expect(handler(event)).rejects.toThrow(h3Err)
  })

  it('wraps non-H3 errors as 502', async () => {
    mockFetch.mockRejectedValue(new Error('network'))

    const { default: handler } = await import('~/server/api/mates/index')

    const event = { method: 'GET', node: { req: { method: 'GET' } } } as never
    try {
      await handler(event)
      expect.unreachable('should have thrown')
    }
    catch (err: unknown) {
      expect((err as { statusCode: number }).statusCode).toBe(502)
    }
  })
})
