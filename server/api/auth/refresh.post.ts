import { H3Error } from 'h3'
import type { ApiResponse } from '~/types'
import { getRefreshToken, setAuthCookies, clearAuthCookies } from '~/server/utils/cookie-utils'
import { snakeToCamel } from '~/server/utils/case-convert'

export default defineEventHandler(async (event) => {
  const refreshToken = getRefreshToken(event)

  if (!refreshToken) {
    throw createError({ statusCode: 401, message: 'No refresh token' })
  }

  try {
    const { apiHost } = useRuntimeConfig()
    const response = await $fetch<ApiResponse<Record<string, unknown>>>('/v1/auth/refresh', {
      baseURL: apiHost,
      method: 'POST',
      body: { refresh_token: refreshToken },
    })

    const data = snakeToCamel<{ accessToken: string, refreshToken: string }>(response.data)
    setAuthCookies(event, data)

    return { ok: true }
  }
  catch (err) {
    clearAuthCookies(event)
    if (err instanceof H3Error) throw err
    throw createError({ statusCode: 401, message: 'Refresh failed' })
  }
})
