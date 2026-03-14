export function usePageQuery() {
  const route = useRoute()
  const router = useRouter()

  const currentPage = computed({
    get: () => {
      const p = Number(route.query.page)
      return p > 0 ? p : 1
    },
    set: (value: number) => {
      router.push({ query: { ...route.query, page: value > 1 ? String(value) : undefined } })
    },
  })

  return { currentPage }
}
