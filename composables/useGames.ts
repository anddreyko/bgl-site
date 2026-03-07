import type { Game, PaginatedResponse } from '~/types'

export function useGames() {
  const searchQuery = ref('')
  const currentPage = ref(1)
  const pageSize = ref(20)

  const debouncedQuery = ref('')
  const hasSearched = ref(false)
  let debounceTimer: ReturnType<typeof setTimeout> | undefined

  watch(searchQuery, (val: string) => {
    clearTimeout(debounceTimer)
    if (val.length < 3) return
    debounceTimer = setTimeout(() => {
      debouncedQuery.value = val
      currentPage.value = 1
      hasSearched.value = true
    }, 300)
  })

  if (getCurrentScope()) {
    onScopeDispose(() => clearTimeout(debounceTimer))
  }

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
  const isLoading = computed(() => hasSearched.value && pending.value)

  function search(q: string) {
    searchQuery.value = q
  }

  function goToPage(page: number) {
    currentPage.value = page
  }

  return {
    searchQuery,
    hasSearched,
    games,
    total,
    totalPages,
    currentPage,
    pending: isLoading,
    error,
    search,
    goToPage,
    refresh,
  }
}
