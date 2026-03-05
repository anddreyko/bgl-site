import { H3Error, defineEventHandler, getRouterParam, getMethod, readBody, createError } from 'h3'
import type { ApiResponse, Mate, MatePayload } from '~/types'
import { createApiClient, unwrap } from '~/server/utils/api-client'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id || !/^[\w-]+$/.test(id)) {
    throw createError({ statusCode: 400, message: 'Invalid ID' })
  }

  const method = getMethod(event)
  const api = createApiClient(event)

  try {
    if (method === 'DELETE') {
      const response = await api<ApiResponse<null>>(`/v1/mates/${id}`, {
        method: 'DELETE',
      })
      return unwrap(response)
    }

    if (method === 'PUT') {
      const body = await readBody<MatePayload>(event)
      const response = await api<ApiResponse<Mate>>(`/v1/mates/${id}`, {
        method: 'PUT',
        body,
      })
      return unwrap(response)
    }

    const response = await api<ApiResponse<Mate>>(`/v1/mates/${id}`)
    return unwrap(response)
  }
  catch (err) {
    if (err instanceof H3Error) throw err
    throw createError({ statusCode: 502, message: 'Backend unavailable' })
  }
})
