import { H3Error, defineEventHandler, getRouterParam, createError } from 'h3'
import type { ApiResponse, User } from '~/types'
import { createApiClient, unwrap } from '~/server/utils/api-client'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const api = createApiClient(event)

  try {
    const response = await api<ApiResponse<User>>(`/v1/user/${id}`)
    return unwrap(response)
  }
  catch (err) {
    if (err instanceof H3Error) throw err
    throw createError({ statusCode: 502, message: 'Backend unavailable' })
  }
})
