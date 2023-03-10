export default defineEventHandler(async () => {
  const { apiGameHost } = useRuntimeConfig()
  return await $fetch(apiGameHost)
})
