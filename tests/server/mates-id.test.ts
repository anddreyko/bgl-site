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

const mockReadBody = vi.fn()
vi.mock('h3', async (importOriginal) => {
  const actual = await importOriginal<typeof import('h3')>()
  return {
    ...actual,
    readBody: (...args: unknown[]) => mockReadBody(...args),
  }
})

describe('server/api/mates/[id]', () => {
  beforeEach(() => {
    mockFetch.mockReset()
    mockUnwrap.mockReset()
    mockUnwrap.mockImplementation((r: unknown) => r)
    mockReadBody.mockReset()
  })

  it('GET proxies to /v1/mates/{id}', async () => {
    const fakeResponse = { code: 0, data: { id: 'abc', name: 'Alice' } }
    mockFetch.mockResolvedValue(fakeResponse)

    const { default: handler } = await import('~/server/api/mates/[id]')

    const event = {
      method: 'GET',
      node: { req: { method: 'GET' } },
      context: { params: { id: 'abc' } },
    } as never

    await handler(event)

    expect(mockFetch).toHaveBeenCalledWith('/v1/mates/abc')
    expect(mockUnwrap).toHaveBeenCalledWith(fakeResponse)
  })

  it('PUT proxies to /v1/mates/{id} with body', async () => {
    const fakeResponse = { code: 0, data: { id: 'abc', name: 'Alice Updated' } }
    mockFetch.mockResolvedValue(fakeResponse)
    mockReadBody.mockResolvedValue({ name: 'Alice Updated' })

    const { default: handler } = await import('~/server/api/mates/[id]')

    const event = {
      method: 'PUT',
      node: { req: { method: 'PUT' } },
      context: { params: { id: 'abc' } },
    } as never

    await handler(event)

    expect(mockFetch).toHaveBeenCalledWith('/v1/mates/abc', expect.objectContaining({
      method: 'PUT',
      body: { name: 'Alice Updated' },
    }))
  })

  it('DELETE proxies to /v1/mates/{id}', async () => {
    const fakeResponse = { code: 0, data: null }
    mockFetch.mockResolvedValue(fakeResponse)

    const { default: handler } = await import('~/server/api/mates/[id]')

    const event = {
      method: 'DELETE',
      node: { req: { method: 'DELETE' } },
      context: { params: { id: 'abc' } },
    } as never

    await handler(event)

    expect(mockFetch).toHaveBeenCalledWith('/v1/mates/abc', expect.objectContaining({
      method: 'DELETE',
    }))
  })

  it('re-throws H3Error', async () => {
    const h3Err = new H3Error('Forbidden')
    h3Err.statusCode = 403
    mockFetch.mockRejectedValue(h3Err)

    const { default: handler } = await import('~/server/api/mates/[id]')
    const event = { method: 'GET', node: { req: { method: 'GET' } }, context: { params: { id: 'x' } } } as never

    await expect(handler(event)).rejects.toThrow(h3Err)
  })

  it('wraps unknown errors as 502', async () => {
    mockFetch.mockRejectedValue(new TypeError('fail'))

    const { default: handler } = await import('~/server/api/mates/[id]')
    const event = { method: 'GET', node: { req: { method: 'GET' } }, context: { params: { id: 'x' } } } as never

    try {
      await handler(event)
      expect.unreachable('should have thrown')
    }
    catch (err: unknown) {
      expect((err as { statusCode: number }).statusCode).toBe(502)
    }
  })
})
