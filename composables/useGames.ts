import type { Game, PaginatedResponse } from '~/types'

export function useGames() {
  const searchQuery = ref('')
  const currentPage = ref(1)
  const pageSize = ref(20)

  const debouncedQuery = ref('')
  let debounceTimer: ReturnType<typeof setTimeout> | undefined

  watch(searchQuery, (val: string) => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      debouncedQuery.value = val
      currentPage.value = 1
    }, 300)
  })

  const { data, pending, error, refresh } = useLazyFetch<PaginatedResponse<Game>>('/api/games', {
    query: computed(() => ({
      q: debouncedQuery.value,
      page: currentPage.value,
      size: pageSize.value,
    })),
    immediate: false,
  })

  const games = computed(() => data.value?.items ?? [])
  const total = computed(() => data.value?.total ?? 0)
  const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

  function search(q: string) {
    searchQuery.value = q
  }

  function goToPage(page: number) {
    currentPage.value = page
  }

  return {
    searchQuery,
    games,
    total,
    totalPages,
    currentPage,
    pending,
    error,
    search,
    goToPage,
    refresh,
  }
}
