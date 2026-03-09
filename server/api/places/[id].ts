import { defineEventHandler, getRouterParam, getMethod, readBody, createError } from 'h3'
import type { ApiResponse, Place, PlacePayload } from '~/types'
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
      const response = await api<ApiResponse<null>>(`/v1/locations/${id}`, {
        method: 'DELETE',
      })
      return unwrap(response)
    }

    if (method === 'PUT') {
      const body = await readBody<PlacePayload>(event)
      const response = await api<ApiResponse<Place>>(`/v1/locations/${id}`, {
        method: 'PUT',
        body,
      })
      return unwrap(response)
    }

    const response = await api<ApiResponse<Place>>(`/v1/locations/${id}`)
    return unwrap(response)
  }
  catch (err) {
    handleBackendError(err)
  }
})
