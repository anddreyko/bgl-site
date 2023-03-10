export default defineEventHandler(async () => {
  const { apiHelloWorldHost } = useRuntimeConfig()
  return await $fetch(apiHelloWorldHost)
})
