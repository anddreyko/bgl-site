import { defineEventHandler, getCookie, createError } from 'h3'
import type { ApiResponse, User } from '~/types'
import { decodeJwtPayload } from '~/server/utils/jwt'
import { createApiClient, handleBackendError, unwrap } from '~/server/utils/api-client'

export default defineEventHandler(async (event) => {
  const accessToken = getCookie(event, 'access_token')
  if (!accessToken) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  const payload = decodeJwtPayload(accessToken)
  if (!payload.sub) {
    throw createError({ statusCode: 401, message: 'Invalid token: missing sub' })
  }

  const api = createApiClient(event)

  try {
    const response = await api<ApiResponse<User>>(`/v1/user/${encodeURIComponent(payload.sub)}`)
    return unwrap(response)
  }
  catch (err) {
    handleBackendError(err)
  }
})
