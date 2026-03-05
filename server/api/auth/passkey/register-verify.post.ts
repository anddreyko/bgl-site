import { H3Error } from 'h3'
import type { ApiResponse } from '~/types'
import { createApiClient, unwrap } from '~/server/utils/api-client'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ response: string, label?: string }>(event)
  const api = createApiClient(event)

  try {
    const response = await api<ApiResponse<unknown>>('/v1/auth/passkey/register/verify', {
      method: 'POST',
      body,
    })
    unwrap(response)
    return { ok: true }
  }
  catch (err) {
    if (err instanceof H3Error) throw err
    throw createError({ statusCode: 502, message: 'Backend unavailable' })
  }
})
