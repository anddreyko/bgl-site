import type { ApiResponse, SignInPayload } from '~/types'
import { createApiClient, handleBackendError, unwrap } from '~/server/utils/api-client'
import { setAuthCookies } from '~/server/utils/cookie-utils'

export default defineEventHandler(async (event) => {
  const body = await readBody<SignInPayload>(event)
  const api = createApiClient(event)

  try {
    const response = await api<ApiResponse<{
      accessToken: string
      refreshToken: string
    }>>('/v1/auth/sign-in', {
      method: 'POST',
      body,
    })
    const data = unwrap(response)
    setAuthCookies(event, data)
    return { ok: true }
  }
  catch (err) {
    handleBackendError(err)
  }
})
