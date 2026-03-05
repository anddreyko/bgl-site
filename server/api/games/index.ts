export default defineEventHandler(async (): Promise<unknown> => {
  const { apiGameHost } = useRuntimeConfig()
  return await $fetch(apiGameHost)
})
