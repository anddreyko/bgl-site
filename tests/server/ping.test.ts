import { describe, it, expect } from 'vitest'
import handler from '~/server/api/ping.get'

describe('GET /api/ping', () => {
  it('returns status ok', () => {
    const result = handler({} as Parameters<typeof handler>[0])
    expect(result).toEqual({ status: 'ok' })
  })
})
