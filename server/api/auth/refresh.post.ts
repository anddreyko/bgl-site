import { H3Error } from 'h3'
import type { ApiResponse } from '~/types'
import { getRefreshToken, setAuthCookies, clearAuthCookies } from '~/server/utils/cookie-utils'

export default defineEventHandler(async (event) => {
  const refreshToken = getRefreshToken(event)

  if (!refreshToken) {
    throw createError({ statusCode: 401, message: 'No refresh token' })
  }

  try {
    const { apiHost } = useRuntimeConfig()
    const response = await $fetch<ApiResponse<{
      access_token: string
      refresh_token: string
      expires_in: number
    }>>('/v1/auth/refresh', {
      baseURL: apiHost,
      method: 'POST',
      body: { refreshToken },
    })

    if (response.code !== 0) {
      clearAuthCookies(event)
      throw createError({ statusCode: 401, message: 'Refresh failed' })
    }

    const data = response.data
    setAuthCookies(event, {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
    })

    return { ok: true }
  }
  catch (err) {
    clearAuthCookies(event)
    if (err instanceof H3Error) throw err
    throw createError({ statusCode: 401, message: 'Refresh failed' })
  }
})
