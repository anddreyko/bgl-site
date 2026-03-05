import { H3Error, defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import type { ApiResponse, Play } from '~/types'
import { createApiClient, unwrap } from '~/server/utils/api-client'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const api = createApiClient(event)

  try {
    const body = await readBody<{ finished_at?: string }>(event)
    const response = await api<ApiResponse<Play>>(`/v1/plays/sessions/${id}`, {
      method: 'PATCH',
      body,
    })
    return unwrap(response)
  }
  catch (err) {
    if (err instanceof H3Error) throw err
    throw createError({ statusCode: 502, message: 'Backend unavailable' })
  }
})
