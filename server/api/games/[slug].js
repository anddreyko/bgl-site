export default defineEventHandler(async (event) => {
  const { slug } = event.context.params
  const { apiGameHost } = useRuntimeConfig()
  return await $fetch(`${apiGameHost}/${slug}`)
})
