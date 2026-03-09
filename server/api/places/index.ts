import { defineEventHandler, getMethod, getQuery, readBody } from 'h3'
import type { ApiResponse, PaginatedResponse, Place, PlacePayload } from '~/types'
import { createApiClient, unwrap, handleBackendError } from '~/server/utils/api-client'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const api = createApiClient(event)

  try {
    if (method === 'POST') {
      const body = await readBody<PlacePayload>(event)
      const response = await api<ApiResponse<Place>>('/v1/locations', {
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
    const response = await api<ApiResponse<PaginatedResponse<Place>>>('/v1/locations', { query })
    return unwrap(response)
  }
  catch (err: unknown) {
    console.error('[BFF places/index]', err)
    handleBackendError(err)
  }
})
