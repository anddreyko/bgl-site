import { describe, it, expect } from 'vitest'
import { decodeJwtPayload } from '~/server/utils/jwt'

describe('decodeJwtPayload', () => {
  function makeToken(payload: Record<string, unknown>): string {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256' })).toString('base64url')
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
    return `${header}.${body}.fake-signature`
  }

  it('decodes a valid JWT payload', () => {
    const token = makeToken({ sub: 'user-1', exp: 9999999999 })
    const result = decodeJwtPayload(token)
    expect(result.sub).toBe('user-1')
    expect(result.exp).toBe(9999999999)
  })

  it('throws 401 for invalid format (not 3 parts)', () => {
    expect(() => decodeJwtPayload('only.two')).toThrow()
    try {
      decodeJwtPayload('only.two')
    }
    catch (err: unknown) {
      expect((err as { statusCode: number }).statusCode).toBe(401)
    }
  })

  it('throws 401 for invalid base64 payload', () => {
    expect(() => decodeJwtPayload('a.!!!.c')).toThrow()
    try {
      decodeJwtPayload('a.!!!.c')
    }
    catch (err: unknown) {
      expect((err as { statusCode: number }).statusCode).toBe(401)
    }
  })
})
