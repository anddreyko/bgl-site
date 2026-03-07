export default defineNuxtPlugin(async () => {
  const { user } = useAuth()
  const requestFetch = useRequestFetch()
  try {
    const me = await requestFetch<import('~/types').User>('/api/user/me')
    if (me?.id) {
      user.value = await requestFetch<import('~/types').User>(`/api/user/${me.id}`)
    }
  }
  catch {
    user.value = null
  }
})
