import { H3Error } from 'h3'
import type { ApiResponse } from '~/types'
import { createApiClient, unwrap } from '~/server/utils/api-client'
import { setAuthCookies } from '~/server/utils/cookie-utils'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ response: string }>(event)
  const api = createApiClient(event)

  try {
    const response = await api<ApiResponse<{
      access_token: string
      refresh_token: string
      expires_in: number
    }>>('/v1/auth/passkey/sign-in/verify', {
      method: 'POST',
      body,
    })

    const data = unwrap(response)

    setAuthCookies(event, {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
    })

    return { ok: true }
  }
  catch (err) {
    if (err instanceof H3Error) throw err
    throw createError({ statusCode: 502, message: 'Backend unavailable' })
  }
})
