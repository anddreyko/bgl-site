export default defineNuxtPlugin(async (nuxtApp) => {
  const { user } = useAuth()
  let token = useCookie('access_token').value

  if (!token) {
    const refreshToken = useCookie('refresh_token').value
    if (!refreshToken) return

    try {
      const event = nuxtApp.ssrContext?.event
      if (event) {
        const { tryRefreshToken } = await import('~/server/utils/refresh-token')
        const refreshed = await tryRefreshToken(event)
        if (refreshed) {
          token = event.context.accessToken as string | undefined
        }
      }
    }
    catch {
      return
    }
  }

  if (!token) return

  try {
    const parts = token.split('.')
    if (parts.length !== 3) return

    const raw = Buffer.from(parts[1], 'base64url').toString('utf8')
    const payload = JSON.parse(raw) as { sub?: string, name?: string, email?: string, exp?: number }

    if (!payload.sub) return
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return

    user.value = {
      id: payload.sub,
      name: payload.name ?? '',
      email: payload.email ?? '',
      isActive: true,
      createdAt: '',
    }
  }
  catch {
    user.value = null
  }
})
