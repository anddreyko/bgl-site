export default defineEventHandler(async (event): Promise<unknown> => {
  const slug = getRouterParam(event, 'slug')
  const { apiGameHost } = useRuntimeConfig()
  return await $fetch(`${apiGameHost}/${slug}`)
})
