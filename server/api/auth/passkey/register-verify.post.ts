import { handleBackendError } from '~/server/utils/api-client'
import { getAccessToken } from '~/server/utils/cookie-utils'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { apiHost } = useRuntimeConfig()
  const accessToken = getAccessToken(event)

  try {
    // Send raw WebAuthn response — do NOT run camelToSnake
    await $fetch(`${apiHost}/v1/auth/passkey/register/verify`, {
      method: 'POST',
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      body,
    })
    return { ok: true }
  }
  catch (err) {
    handleBackendError(err)
  }
})
