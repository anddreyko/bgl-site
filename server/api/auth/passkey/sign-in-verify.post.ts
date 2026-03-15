import { handleBackendError } from '~/server/utils/api-client'
import { setAuthCookies } from '~/server/utils/cookie-utils'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { apiHost } = useRuntimeConfig(event)

  try {
    // Send raw WebAuthn response — do NOT run camelToSnake
    // Response contains tokens which are simple strings, safe to read directly
    const raw = await $fetch<{ code: number, data: { access_token: string, refresh_token: string } }>(`${apiHost}/v1/auth/passkey/sign-in/verify`, {
      method: 'POST',
      body,
    })

    setAuthCookies(event, {
      accessToken: raw.data.access_token,
      refreshToken: raw.data.refresh_token,
    })

    return { ok: true }
  }
  catch (err) {
    handleBackendError(err)
  }
})
