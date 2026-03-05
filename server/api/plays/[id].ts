import { H3Error, defineEventHandler, getRouterParam, getMethod, readBody, createError } from 'h3'
import type { ApiResponse, Play, PlayUpdatePayload } from '~/types'
import { createApiClient, unwrap } from '~/server/utils/api-client'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id || !/^[\w-]+$/.test(id)) {
    throw createError({ statusCode: 400, message: 'Invalid ID' })
  }

  const method = getMethod(event)
  const api = createApiClient(event)

  try {
    if (method === 'PUT') {
      const body = await readBody<PlayUpdatePayload>(event)
      const response = await api<ApiResponse<Play>>(`/v1/plays/sessions/${id}`, {
        method: 'PUT',
        body,
      })
      return unwrap(response)
    }

    const response = await api<ApiResponse<Play>>(`/v1/plays/sessions/${id}`)
    return unwrap(response)
  }
  catch (err) {
    if (err instanceof H3Error) throw err
    throw createError({ statusCode: 502, message: 'Backend unavailable' })
  }
})
