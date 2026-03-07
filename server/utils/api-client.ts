import type { H3Event } from 'h3'
import { FetchError } from 'ofetch'
import type { ApiResponse } from '~/types/api'
import { getAccessToken } from '~/server/utils/cookie-utils'
import { snakeToCamel, camelToSnake } from '~/server/utils/case-convert'

export function createApiClient(event: H3Event) {
  const { apiHost } = useRuntimeConfig()
  const accessToken = getAccessToken(event)

  return $fetch.create({
    baseURL: apiHost,
    retry: 3,
    retryDelay: 500,
    retryStatusCodes: [408, 409, 425, 429, 502, 503, 504],
    headers: accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {},
    onRequest({ options }) {
      if (options.body && typeof options.body === 'object') {
        options.body = camelToSnake(options.body)
      }
    },
    onResponse({ response }) {
      if (response._data && typeof response._data === 'object') {
        response._data = snakeToCamel(response._data)
      }
    },
  })
}

export function unwrap<T>(response: ApiResponse<T>): T {
  return response.data
}

export function handleBackendError(err: unknown): never {
  if (err instanceof H3Error) throw err
  if (err instanceof FetchError) {
    const status = err.statusCode ?? 502
    const data = err.data as { message?: string } | undefined
    throw createError({
      statusCode: status >= 500 ? 502 : status,
      message: data?.message ?? err.message ?? 'Backend unavailable',
    })
  }
  throw createError({ statusCode: 502, message: 'Backend unavailable' })
}
