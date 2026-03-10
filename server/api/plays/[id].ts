import { defineEventHandler, getRouterParam, getMethod, readBody, createError } from 'h3'
import type { ApiResponse, Play, PlayUpdatePayload } from '~/types'
import { createApiClient, handleBackendError, unwrap } from '~/server/utils/api-client'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id || !/^[\w-]+$/.test(id)) {
    throw createError({ statusCode: 400, message: 'Invalid ID' })
  }

  const method = getMethod(event)
  const api = createApiClient(event)

  try {
    if (method === 'DELETE') {
      await api(`/v1/plays/${id}`, {
        method: 'DELETE',
      })
      return null
    }

    if (method === 'PUT') {
      const body = await readBody<PlayUpdatePayload>(event)
      const response = await api<ApiResponse<Play>>(`/v1/plays/${id}`, {
        method: 'PUT',
        body,
      })
      return unwrap(response)
    }

    if (method === 'PATCH') {
      const body = await readBody(event)
      const response = await api<ApiResponse<Play>>(`/v1/plays/${id}`, {
        method: 'PATCH',
        body,
      })
      return unwrap(response)
    }

    const response = await api<ApiResponse<Play>>(`/v1/plays/${id}`)
    return unwrap(response)
  }
  catch (err) {
    handleBackendError(err)
  }
})
