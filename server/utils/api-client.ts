import type { H3Event } from 'h3'
import type { ApiResponse } from '~/types/api'

export function createApiClient(event: H3Event) {
  const { apiHost } = useRuntimeConfig()
  const accessToken = getCookie(event, 'access_token')

  return $fetch.create({
    baseURL: apiHost,
    retry: 3,
    retryDelay: 500,
    headers: accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {},
  })
}

export function unwrap<T>(response: ApiResponse<T>): T {
  if (response.code !== 0) {
    throw createError({
      statusCode: 502,
      message: response.message ?? `API error: code ${response.code}`,
    })
  }
  return response.data
}
