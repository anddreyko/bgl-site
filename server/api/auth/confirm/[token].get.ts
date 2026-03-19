import type { ApiResponse } from '~/types'
import { createApiClient, handleBackendError, unwrap } from '~/server/utils/api-client'
import { setAuthCookies } from '~/server/utils/cookie-utils'

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')

  if (!token || !/^[\w-]+$/.test(token)) {
    throw createError({ statusCode: 400, message: 'Invalid token format' })
  }

  const api = createApiClient(event)

  try {
    const response = await api<ApiResponse<{
      accessToken: string
      refreshToken: string
    }>>('/v1/auth/email/verify', {
      method: 'POST',
      body: {
        credential: token,
        type: 'token',
      },
    })
    const data = unwrap(response)
    setAuthCookies(event, data)

    return { ok: true }
  }
  catch (err) {
    handleBackendError(err)
  }
})
