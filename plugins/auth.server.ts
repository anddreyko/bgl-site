export default defineNuxtPlugin(() => {
  const { user } = useAuth()
  const token = useCookie('access_token').value
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
