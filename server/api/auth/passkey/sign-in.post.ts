import { handleBackendError } from '~/server/utils/api-client'

export default defineEventHandler(async () => {
  const { apiHost } = useRuntimeConfig()

  try {
    // Fetch raw JSON — do NOT run snakeToCamel on WebAuthn options
    const raw = await $fetch<{ code: number, data: { options: Record<string, unknown> } }>(`${apiHost}/v1/auth/passkey/sign-in`, {
      method: 'POST',
    })
    return raw.data
  }
  catch (err) {
    handleBackendError(err)
  }
})
