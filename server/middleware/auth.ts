import { getAccessToken } from '~/server/utils/cookie-utils'
import { tryRefreshToken } from '~/server/utils/refresh-token'

const PUBLIC_PATHS = [
  '/api/auth/sign-in',
  '/api/auth/sign-up',
  '/api/auth/refresh',
  '/api/auth/confirm',
  '/api/auth/email',
  '/api/auth/passkey/sign-in',
  '/api/auth/passkey/sign-in-verify',
  '/api/games',
  '/api/plays',
  '/api/user/',
  '/api/ping',
]

const AUTH_REQUIRED_PATHS = [
  '/api/user/me',
]

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  if (!path.startsWith('/api/')) return
  if (!AUTH_REQUIRED_PATHS.includes(path) && PUBLIC_PATHS.some(p => path.startsWith(p))) return

  const token = getAccessToken(event)
  if (token) return

  const refreshed = await tryRefreshToken(event)
  if (!refreshed) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
})
