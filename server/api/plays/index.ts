import { defineEventHandler, getMethod, getQuery, readBody } from 'h3'
import type { ApiResponse, PaginatedResponse, Play, PlayCreatePayload } from '~/types'
import { createApiClient, unwrap, handleBackendError } from '~/server/utils/api-client'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const api = createApiClient(event)

  try {
    if (method === 'POST') {
      const body = await readBody<PlayCreatePayload>(event)
      const response = await api<ApiResponse<Play>>('/v1/plays', {
        method: 'POST',
        body,
      })
      return unwrap(response)
    }

    const raw = getQuery(event)
    const query: Record<string, unknown> = {}
    if (raw.page) query.page = Number(raw.page)
    if (raw.size) query.size = Number(raw.size)
    if (raw.gameId) query.game_id = raw.gameId
    if (raw.authorId) query.author_id = raw.authorId
    if (raw.status) query.status = raw.status
    if (raw.from) query.from = raw.from
    if (raw.to) query.to = raw.to
    const response = await api<ApiResponse<PaginatedResponse<Play>>>('/v1/plays', { query })
    return unwrap(response)
  }
  catch (err) {
    handleBackendError(err)
  }
})
