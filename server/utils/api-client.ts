import type { H3Event } from 'h3'
import type { ApiResponse } from '~/types/api'
import { getAccessToken, getRefreshToken, setAuthCookies, clearAuthCookies } from '~/server/utils/cookie-utils'

export function createApiClient(event: H3Event) {
  const { apiHost } = useRuntimeConfig()
  const accessToken = getAccessToken(event)

  return $fetch.create({
    baseURL: apiHost,
    retry: 3,
    retryDelay: 500,
    retryStatusCodes: [408, 409, 425, 429, 500, 502, 503, 504],
    headers: accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {},
    onResponseError: async ({ response }) => {
      if (response.status === 401) {
        const refreshed = await tryRefreshToken(event, apiHost)
        if (!refreshed) {
          throw createError({ statusCode: 401, message: 'Unauthorized' })
        }
      }
    },
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

async function tryRefreshToken(event: H3Event, apiHost: string): Promise<boolean> {
  const refreshToken = getRefreshToken(event)
  if (!refreshToken) return false

  try {
    const response = await $fetch<{ data: { access_token: string, refresh_token: string, expires_in: number } }>('/v1/auth/refresh', {
      baseURL: apiHost,
      method: 'POST',
      body: { refreshToken },
    })

    if (!response.data) return false

    setAuthCookies(event, {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in,
    })
    return true
  }
  catch {
    clearAuthCookies(event)
    return false
  }
}
