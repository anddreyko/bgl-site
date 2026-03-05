import type { H3Event } from 'h3'
import { getRefreshToken, setAuthCookies, clearAuthCookies } from '~/server/utils/cookie-utils'

export async function tryRefreshToken(event: H3Event): Promise<boolean> {
  const refreshToken = getRefreshToken(event)
  if (!refreshToken) return false

  try {
    const { apiHost } = useRuntimeConfig()
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
