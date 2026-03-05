import { H3Error, defineEventHandler, getMethod, getQuery, readBody, createError } from 'h3'
import type { ApiResponse, PaginatedResponse, Mate, MatePayload } from '~/types'
import { createApiClient, unwrap } from '~/server/utils/api-client'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const api = createApiClient(event)

  try {
    if (method === 'POST') {
      const body = await readBody<MatePayload>(event)
      const response = await api<ApiResponse<Mate>>('/v1/mates', {
        method: 'POST',
        body,
      })
      return unwrap(response)
    }

    const query = getQuery(event)
    const response = await api<ApiResponse<PaginatedResponse<Mate>>>('/v1/mates', { query })
    return unwrap(response)
  }
  catch (err) {
    if (err instanceof H3Error) throw err
    throw createError({ statusCode: 502, message: 'Backend unavailable' })
  }
})
