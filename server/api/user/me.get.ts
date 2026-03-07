import { defineEventHandler, getCookie, createError } from 'h3'
import { decodeJwtPayload } from '~/server/utils/jwt'
import { snakeToCamel } from '~/server/utils/case-convert'

export default defineEventHandler((event) => {
  const accessToken = getCookie(event, 'access_token')
  if (!accessToken) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  const payload = decodeJwtPayload(accessToken)
  if (!payload.sub) {
    throw createError({ statusCode: 401, message: 'Invalid token: missing sub' })
  }

  return snakeToCamel({
    id: payload.sub,
    ...payload,
  })
})
