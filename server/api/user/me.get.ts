import { H3Error, defineEventHandler, getCookie, createError } from 'h3'
import type { ApiResponse, User } from '~/types'
import { createApiClient, unwrap } from '~/server/utils/api-client'
import { decodeJwtPayload } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const accessToken = getCookie(event, 'access_token')
  if (!accessToken) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  const payload = decodeJwtPayload(accessToken)
  const userId = payload.sub
  if (!userId) {
    throw createError({ statusCode: 401, message: 'Invalid token: missing sub' })
  }

  const api = createApiClient(event)

  try {
    const response = await api<ApiResponse<User>>(`/v1/user/${userId}`)
    return unwrap(response)
  }
  catch (err) {
    if (err instanceof H3Error) throw err
    throw createError({ statusCode: 502, message: 'Backend unavailable' })
  }
})
