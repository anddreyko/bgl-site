import { H3Error } from 'h3'
import type { ApiResponse, Game } from '~/types'
import { createApiClient, unwrap } from '~/server/utils/api-client'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const api = createApiClient(event)

  try {
    const response = await api<ApiResponse<Game>>(`/v1/games/${id}`)
    return unwrap(response)
  }
  catch (err) {
    if (err instanceof H3Error) throw err
    throw createError({ statusCode: 502, message: 'Backend unavailable' })
  }
})
