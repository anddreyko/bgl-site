import type { H3Event } from 'h3'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockFetch = vi.fn()

vi.mock('h3', () => ({
  defineEventHandler: (fn: (event: H3Event) => unknown) => fn,
  createError: (opts: { statusCode: number, message: string }) => {
    const err = new Error(opts.message) as Error & { statusCode: number }
    err.statusCode = opts.statusCode
    return err
  },
}))

vi.mock('~/server/utils/api-client', () => ({
  createApiClient: () => mockFetch,
  handleBackendError: (err: unknown) => { throw err },
}))

describe('GET /api/ping', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns backend status, environment and version', async () => {
    mockFetch.mockResolvedValue({
      data: {
        environment: 'dev',
        version: '2.0.0',
        datetime: { timestamp: '123', datetime: '2026-01-01T00:00:00Z' },
      },
    })

    const handler = (await import('~/server/api/ping.get')).default
    const result = await handler({} as H3Event)

    expect(result).toEqual({
      status: 'ok',
      environment: 'dev',
      version: '2.0.0',
    })
    expect(mockFetch).toHaveBeenCalledWith('/ping')
  })
})
