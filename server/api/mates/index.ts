import { defineEventHandler, getMethod, getQuery, readBody } from 'h3'
import type { ApiResponse, PaginatedResponse, Mate, MatePayload } from '~/types'
import { createApiClient, unwrap, handleBackendError } from '~/server/utils/api-client'

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

    const raw = getQuery(event)
    const query = {
      ...raw,
      ...(raw.page ? { page: Number(raw.page) } : {}),
      ...(raw.size ? { size: Number(raw.size) } : {}),
    }
    const response = await api<ApiResponse<PaginatedResponse<Mate>>>('/v1/mates', { query })
    return unwrap(response)
  }
  catch (err) {
    handleBackendError(err)
  }
})
