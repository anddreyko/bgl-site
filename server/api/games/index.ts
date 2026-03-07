import type { ApiResponse, PaginatedResponse, Game } from '~/types'
import { createApiClient, unwrap, handleBackendError } from '~/server/utils/api-client'

export default defineEventHandler(async (event) => {
  const raw = getQuery(event)
  const query = { q: '', ...raw }
  const api = createApiClient(event)

  try {
    const response = await api<ApiResponse<PaginatedResponse<Game>>>('/v1/games/search', { query })
    return unwrap(response)
  }
  catch (err) {
    handleBackendError(err)
  }
})
