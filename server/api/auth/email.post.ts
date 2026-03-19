import type { ApiResponse, EmailSendPayload } from '~/types'
import { createApiClient, handleBackendError, unwrap } from '~/server/utils/api-client'

export default defineEventHandler(async (event) => {
  const body = await readBody<EmailSendPayload>(event)
  const api = createApiClient(event)

  try {
    const response = await api<ApiResponse<string>>('/v1/auth/email', {
      method: 'POST',
      body,
    })
    const message = unwrap(response)
    return { ok: true, message }
  }
  catch (err) {
    handleBackendError(err)
  }
})
