import { H3Error } from 'h3'
import type { ApiResponse, ConfirmPayload } from '~/types'
import { createApiClient, unwrap } from '~/server/utils/api-client'

export default defineEventHandler(async (event) => {
  const body = await readBody<ConfirmPayload>(event)

  if (!body.token || !/^[\w-]+$/.test(body.token)) {
    throw createError({ statusCode: 400, message: 'Invalid token format' })
  }

  const api = createApiClient(event)

  try {
    const response = await api<ApiResponse<string>>(`/v1/auth/confirm/${encodeURIComponent(body.token)}`, {
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
