import { getAccessToken, getRefreshToken, setAuthCookies, clearAuthCookies } from '~/server/utils/cookie-utils'

const PUBLIC_PATHS = [
  '/api/auth/sign-in',
  '/api/auth/sign-up',
  '/api/auth/refresh',
  '/api/auth/confirm',
  '/api/auth/passkey/sign-in',
  '/api/auth/passkey/sign-in-verify',
  '/api/games',
  '/api/ping',
]

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  if (!path.startsWith('/api/')) return
  if (PUBLIC_PATHS.some(p => path.startsWith(p))) return

  const token = getAccessToken(event)
  if (token) return

  // No access token — try refresh
  const refreshToken = getRefreshToken(event)
  if (!refreshToken) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  try {
    const { apiHost } = useRuntimeConfig()
    const response = await $fetch<{ data: { access_token: string, refresh_token: string, expires_in: number } }>('/v1/auth/refresh', {
      baseURL: apiHost,
      method: 'POST',
      body: { refreshToken },
    })
    if (response.data === null || response.data === undefined) {
      throw new Error('Invalid refresh response')
    }

    const data = response.data
    setAuthCookies(event, {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
    })
  }
  catch {
    clearAuthCookies(event)
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
})
