import { H3Error, defineEventHandler, getMethod, getQuery, readBody, createError } from 'h3'
import type { ApiResponse, PaginatedResponse, Play, PlayCreatePayload } from '~/types'
import { createApiClient, unwrap } from '~/server/utils/api-client'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const api = createApiClient(event)

  try {
    if (method === 'POST') {
      const body = await readBody<PlayCreatePayload>(event)
      const response = await api<ApiResponse<{ session_id: string }>>('/v1/plays/sessions', {
        method: 'POST',
        body,
      })
      return unwrap(response)
    }

    const query = getQuery(event)
    const response = await api<ApiResponse<PaginatedResponse<Play>>>('/v1/plays/sessions', { query })
    return unwrap(response)
  }
  catch (err) {
    if (err instanceof H3Error) throw err
    throw createError({ statusCode: 502, message: 'Backend unavailable' })
  }
})
