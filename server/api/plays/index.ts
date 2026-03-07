import { defineEventHandler, getMethod, getQuery, readBody } from 'h3'
import type { ApiResponse, PaginatedResponse, Play, PlayCreatePayload } from '~/types'
import { createApiClient, unwrap, handleBackendError } from '~/server/utils/api-client'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const api = createApiClient(event)

  try {
    if (method === 'POST') {
      const body = await readBody<PlayCreatePayload>(event)
      const response = await api<ApiResponse<Play>>('/v1/plays/sessions', {
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
      ...(raw.gameId ? { game_id: raw.gameId, gameId: undefined } : {}),
      ...(raw.authorId ? { author_id: raw.authorId, authorId: undefined } : {}),
    }
    const response = await api<ApiResponse<PaginatedResponse<Play>>>('/v1/plays/sessions', { query })
    return unwrap(response)
  }
  catch (err) {
    handleBackendError(err)
  }
})
