export default defineNuxtPlugin(async () => {
  const { fetchCurrentUser } = useAuth()
  await fetchCurrentUser()
})
