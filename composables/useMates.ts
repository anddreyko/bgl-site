import type { Mate, MatePayload, PaginatedResponse } from '~/types'

export function useMates() {
  const { isOnline } = useNetworkStatus()
  const {
    cachedMates,
    generateOfflineId,
    addOperation,
    persistCachedMates,
  } = useOfflineStore()

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
      if (!isOnline.value) {
        mates.value = cachedMates.value
        total.value = cachedMates.value.length
        return
      }

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

      cachedMates.value = data.items
      persistCachedMates()
    }
    catch {
      if (cachedMates.value.length > 0) {
        mates.value = cachedMates.value
        total.value = cachedMates.value.length
      }
      else {
        error.value = 'Failed to load mates'
      }
    }
    finally {
      loading.value = false
    }
  }

  async function createMate(payload: MatePayload): Promise<Mate> {
    if (!isOnline.value) {
      const tempId = generateOfflineId()
      const offlineMate: Mate = {
        id: tempId,
        name: payload.name,
        notes: payload.notes,
        createdAt: new Date().toISOString(),
      }

      mates.value = [...mates.value, offlineMate]
      cachedMates.value = [...cachedMates.value, offlineMate]
      persistCachedMates()

      addOperation({
        entityType: 'mate',
        action: 'create',
        tempId,
        entityId: tempId,
        payload,
        dependsOn: [],
      })

      return offlineMate
    }

    const mate = await $fetch<Mate>('/api/mates', {
      method: 'POST',
      body: payload,
    })
    await fetchMates()
    return mate
  }

  async function updateMate(id: string, payload: MatePayload): Promise<Mate> {
    if (!isOnline.value) {
      const updatedMate: Mate = {
        id,
        name: payload.name,
        notes: payload.notes,
        createdAt: mates.value.find(m => m.id === id)?.createdAt ?? new Date().toISOString(),
      }

      mates.value = mates.value.map(m => m.id === id ? updatedMate : m)
      cachedMates.value = cachedMates.value.map(m => m.id === id ? updatedMate : m)
      persistCachedMates()

      addOperation({
        entityType: 'mate',
        action: 'update',
        entityId: id,
        payload,
        dependsOn: [],
      })

      return updatedMate
    }

    const mate = await $fetch<Mate>(`/api/mates/${id}`, {
      method: 'PUT',
      body: payload,
    })
    await fetchMates()
    return mate
  }

  async function deleteMate(id: string): Promise<void> {
    if (!isOnline.value) {
      mates.value = mates.value.filter(m => m.id !== id)
      cachedMates.value = cachedMates.value.filter(m => m.id !== id)
      persistCachedMates()

      addOperation({
        entityType: 'mate',
        action: 'delete',
        entityId: id,
        payload: null,
        dependsOn: [],
      })

      return
    }

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
