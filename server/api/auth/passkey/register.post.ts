import { handleBackendError } from '~/server/utils/api-client'
import { getAccessToken } from '~/server/utils/cookie-utils'

export default defineEventHandler(async (event) => {
  const { apiHost } = useRuntimeConfig()
  const accessToken = getAccessToken(event)

  try {
    // Fetch raw JSON — do NOT run snakeToCamel on WebAuthn options
    const raw = await $fetch<{ code: number, data: { options: Record<string, unknown> } }>(`${apiHost}/v1/auth/passkey/register`, {
      method: 'POST',
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    })
    return raw.data
  }
  catch (err) {
    handleBackendError(err)
  }
})
