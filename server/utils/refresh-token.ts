import type { H3Event } from 'h3'
import { getRefreshToken, setAuthCookies, clearAuthCookies } from '~/server/utils/cookie-utils'
import { snakeToCamel } from '~/server/utils/case-convert'

export async function tryRefreshToken(event: H3Event): Promise<boolean> {
  const refreshToken = getRefreshToken(event)
  if (!refreshToken) return false

  try {
    const { apiHost } = useRuntimeConfig()
    const response = await $fetch<{ data: Record<string, unknown> }>('/v1/auth/refresh', {
      baseURL: apiHost,
      method: 'POST',
      body: { refresh_token: refreshToken },
    })

    if (!response.data) return false

    const data = snakeToCamel<{ accessToken: string, refreshToken: string, expiresIn: number }>(response.data)
    setAuthCookies(event, data)
    event.context.accessToken = data.accessToken
    return true
  }
  catch {
    clearAuthCookies(event)
    return false
  }
}
