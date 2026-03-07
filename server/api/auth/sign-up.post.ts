import type { ApiResponse, SignUpPayload } from '~/types'
import { createApiClient, handleBackendError, unwrap } from '~/server/utils/api-client'

export default defineEventHandler(async (event) => {
  const body = await readBody<SignUpPayload>(event)
  const api = createApiClient(event)

  try {
    const response = await api<ApiResponse<{ message: string } | string>>('/v1/auth/sign-up', {
      method: 'POST',
      body,
    })
    const data = unwrap(response)
    const message = typeof data === 'string' ? data : data.message
    return { ok: true, message }
  }
  catch (err) {
    handleBackendError(err)
  }
})
