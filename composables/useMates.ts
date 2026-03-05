import type { Mate, MatePayload, PaginatedResponse } from '~/types'

export function useMates() {
  const mates = ref<Mate[]>([])
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(20)
  const sortBy = ref<'name' | 'createdAt'>('name')
  const sortOrder = ref<'asc' | 'desc'>('asc')
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchMates(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<PaginatedResponse<Mate>>('/api/mates', {
        query: {
          page: currentPage.value,
          size: pageSize.value,
          sort: sortBy.value,
          order: sortOrder.value,
        },
      })
      mates.value = data.items
      total.value = data.total
    }
    catch {
      error.value = 'Failed to load mates'
    }
    finally {
      loading.value = false
    }
  }

  async function createMate(payload: MatePayload): Promise<Mate> {
    const mate = await $fetch<Mate>('/api/mates', {
      method: 'POST',
      body: payload,
    })
    await fetchMates()
    return mate
  }

  async function updateMate(id: string, payload: MatePayload): Promise<Mate> {
    const mate = await $fetch<Mate>(`/api/mates/${id}`, {
      method: 'PUT',
      body: payload,
    })
    await fetchMates()
    return mate
  }

  async function deleteMate(id: string): Promise<void> {
    await $fetch(`/api/mates/${id}`, { method: 'DELETE' })
    await fetchMates()
  }

  const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

  return {
    mates,
    total,
    totalPages,
    currentPage,
    pageSize,
    sortBy,
    sortOrder,
    loading,
    error,
    fetchMates,
    createMate,
    updateMate,
    deleteMate,
  }
}
