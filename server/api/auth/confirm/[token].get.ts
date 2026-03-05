import { H3Error } from 'h3'
import type { ApiResponse } from '~/types'
import { createApiClient, unwrap } from '~/server/utils/api-client'

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')

  if (!token || !/^[\w-]+$/.test(token)) {
    throw createError({ statusCode: 400, message: 'Invalid token format' })
  }

  const api = createApiClient(event)

  try {
    const response = await api<ApiResponse<string>>(`/v1/auth/confirm/${encodeURIComponent(token)}`, {
      method: 'GET',
    })
    const message = unwrap(response)
    return { ok: true, message }
  }
  catch (err) {
    if (err instanceof H3Error) throw err
    throw createError({ statusCode: 502, message: 'Backend unavailable' })
  }
})
