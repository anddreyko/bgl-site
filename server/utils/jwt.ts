import { createError } from 'h3'

export interface JwtPayload {
  sub?: string
  exp?: number
  iat?: number
  [key: string]: unknown
}

export function decodeJwtPayload(token: string): JwtPayload {
  const parts = token.split('.')
  if (parts.length !== 3) {
    throw createError({ statusCode: 401, message: 'Invalid token format' })
  }
  try {
    const raw = Buffer.from(parts[1], 'base64url').toString('utf8')
    return JSON.parse(raw) as JwtPayload
  }
  catch {
    throw createError({ statusCode: 401, message: 'Token payload decode failed' })
  }
}
