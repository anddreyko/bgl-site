import { H3Error } from 'h3'
import type { ApiResponse, ConfirmPayload } from '~/types'
import { createApiClient, unwrap } from '~/server/utils/api-client'

export default defineEventHandler(async (event) => {
  const body = await readBody<ConfirmPayload>(event)
  const api = createApiClient(event)

  try {
    const response = await api<ApiResponse<string>>(`/v1/auth/confirm/${body.token}`, {
      method: 'GET',
    })
    unwrap(response)
    return { ok: true }
  }
  catch (err) {
    if (err instanceof H3Error) throw err
    throw createError({ statusCode: 502, message: 'Backend unavailable' })
  }
})
