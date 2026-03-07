export default defineNuxtPlugin(async () => {
  const { user } = useAuth()
  const requestFetch = useRequestFetch()
  try {
    user.value = await requestFetch<import('~/types').User>('/api/user/me')
  }
  catch {
    user.value = null
  }
})
