import { H3Error } from 'h3'
import type { ApiResponse } from '~/types'
import { createApiClient, unwrap } from '~/server/utils/api-client'

export default defineEventHandler(async (event) => {
  const api = createApiClient(event)

  try {
    const response = await api<ApiResponse<{ options: Record<string, unknown> }>>('/v1/auth/passkey/sign-in', {
      method: 'POST',
    })
    return unwrap(response)
  }
  catch (err) {
    if (err instanceof H3Error) throw err
    throw createError({ statusCode: 502, message: 'Backend unavailable' })
  }
})
