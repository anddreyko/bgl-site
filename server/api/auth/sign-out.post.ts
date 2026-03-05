import { createApiClient } from '~/server/utils/api-client'
import { clearAuthCookies } from '~/server/utils/cookie-utils'

export default defineEventHandler(async (event) => {
  const api = createApiClient(event)

  try {
    await api('/v1/auth/sign-out', { method: 'POST' })
  }
  catch {
    // Best effort — clear cookies regardless
  }

  clearAuthCookies(event)
  return { ok: true }
})
