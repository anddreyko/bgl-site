import type { ApiResponse, ConfirmPayload } from '~/types'
import { createApiClient, handleBackendError, unwrap } from '~/server/utils/api-client'
import { setAuthCookies } from '~/server/utils/cookie-utils'

export default defineEventHandler(async (event) => {
  const body = await readBody<ConfirmPayload>(event)

  if (!body.token || !/^[\w-]+$/.test(body.token)) {
    throw createError({ statusCode: 400, message: 'Invalid token format' })
  }

  const api = createApiClient(event)

  try {
    const response = await api<ApiResponse<{
      accessToken: string
      refreshToken: string
    }>>(`/v1/auth/confirm/${encodeURIComponent(body.token)}`, {
      method: 'GET',
    })
    const data = unwrap(response)
    setAuthCookies(event, data)

    return { ok: true }
  }
  catch (err) {
    handleBackendError(err)
  }
})
