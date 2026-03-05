import type { Play, PlaysListParams, PaginatedResponse } from '~/types'

export function usePlays() {
  const plays = useState<Play[]>('plays:list', () => [])
  const total = useState<number>('plays:total', () => 0)
  const currentPage = useState<number>('plays:page', () => 1)
  const pageSize = useState<number>('plays:size', () => 10)
  const loading = useState<boolean>('plays:loading', () => false)
  const error = useState<string | null>('plays:error', () => null)

  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))

  async function fetchPlays(params?: PlaysListParams): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const query: PlaysListParams = {
        page: params?.page ?? currentPage.value,
        size: params?.size ?? pageSize.value,
        ...params,
      }

      const data = await $fetch<PaginatedResponse<Play>>('/api/plays', { query })

      plays.value = data.items
      total.value = data.total
      currentPage.value = data.page
      pageSize.value = data.size
    }
    catch {
      error.value = 'Failed to load plays'
      plays.value = []
    }
    finally {
      loading.value = false
    }
  }

  return {
    plays,
    total,
    totalPages,
    currentPage,
    pageSize,
    loading,
    error,
    fetchPlays,
  }
}
