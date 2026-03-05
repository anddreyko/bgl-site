import { H3Error } from 'h3'
import { setAuthCookies } from '~/server/utils/cookie-utils'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ response: string }>(event)

  try {
    const { apiHost } = useRuntimeConfig()
    const response = await $fetch<{
      access_token: string
      refresh_token: string
      expires_in: number
    }>('/v1/auth/passkey/sign-in/verify', {
      baseURL: apiHost,
      method: 'POST',
      body,
    })

    setAuthCookies(event, {
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      expiresIn: response.expires_in,
    })

    return { ok: true }
  }
  catch (err) {
    if (err instanceof H3Error) throw err
    throw createError({ statusCode: 502, message: 'Backend unavailable' })
  }
})
