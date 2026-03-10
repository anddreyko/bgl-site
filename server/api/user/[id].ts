import { defineEventHandler, getRouterParam, getMethod, readBody, createError } from 'h3'
import type { ApiResponse, User } from '~/types'
import { createApiClient, handleBackendError, unwrap } from '~/server/utils/api-client'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id || !/^[\w-]+$/.test(id)) {
    throw createError({ statusCode: 400, message: 'Invalid ID' })
  }

  const method = getMethod(event)
  const api = createApiClient(event)
  const url = `/v1/user/${encodeURIComponent(id)}`

  try {
    const response = await api<ApiResponse<User>>(url, {
      method,
      body: method !== 'GET' && method !== 'HEAD' ? await readBody(event) : undefined,
    })
    return unwrap(response)
  }
  catch (err) {
    handleBackendError(err)
  }
})
