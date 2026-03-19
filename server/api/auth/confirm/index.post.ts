import type { ApiResponse, ConfirmPayload } from '~/types'
import { createApiClient, handleBackendError, unwrap } from '~/server/utils/api-client'
import { setAuthCookies } from '~/server/utils/cookie-utils'

export default defineEventHandler(async (event) => {
  const body = await readBody<ConfirmPayload>(event)

  if (!body.credential) {
    throw createError({ statusCode: 400, message: 'Missing credential' })
  }

  const api = createApiClient(event)

  try {
    const response = await api<ApiResponse<{
      accessToken: string
      refreshToken: string
    }>>('/v1/auth/email/verify', {
      method: 'POST',
      body: {
        credential: body.credential,
        type: body.type || 'token',
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
