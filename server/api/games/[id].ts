import type { ApiResponse, Game } from '~/types'
import { createApiClient, handleBackendError, unwrap } from '~/server/utils/api-client'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id || !/^[\w-]+$/.test(id)) {
    throw createError({ statusCode: 400, message: 'Invalid ID' })
  }

  const api = createApiClient(event)

  try {
    const response = await api<ApiResponse<Game>>(`/v1/games/${encodeURIComponent(id)}`)
    return unwrap(response)
  }
  catch (err) {
    handleBackendError(err)
  }
})
