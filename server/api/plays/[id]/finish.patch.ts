import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import type { ApiResponse, Play } from '~/types'
import { createApiClient, handleBackendError, unwrap } from '~/server/utils/api-client'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id || !/^[\w-]+$/.test(id)) {
    throw createError({ statusCode: 400, message: 'Invalid ID' })
  }

  const api = createApiClient(event)

  try {
    const body = await readBody<{ finishedAt?: string }>(event)
    const response = await api<ApiResponse<Play>>(`/v1/plays/sessions/${id}`, {
      method: 'PATCH',
      body,
    })
    return unwrap(response)
  }
  catch (err) {
    handleBackendError(err)
  }
})
