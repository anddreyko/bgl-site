import { ref, computed } from 'vue'
import type { Play, PlaysListParams, PaginatedResponse } from '~/types'

export function usePlays() {
  const plays = ref<Play[]>([])
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const loading = ref(false)
  const error = ref<string | null>(null)

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
