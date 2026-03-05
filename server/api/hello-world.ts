export default defineEventHandler(async (): Promise<unknown> => {
  const { apiHelloWorldHost } = useRuntimeConfig()
  return await $fetch(apiHelloWorldHost)
})
