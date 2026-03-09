import type { Place, PlacePayload, PaginatedResponse } from '~/types'

export function usePlaces() {
  const places = ref<Place[]>([])
  const total = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(20)
  const sortBy = ref<'name' | 'createdAt'>('name')
  const sortOrder = ref<'asc' | 'desc'>('asc')
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchPlaces(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<PaginatedResponse<Place>>('/api/places', {
        query: {
          page: currentPage.value,
          size: pageSize.value,
          sort: sortBy.value,
          order: sortOrder.value,
        },
      })
      places.value = data.items
      total.value = data.total
    }
    catch (e) {
      console.error('[usePlaces] fetchPlaces error:', e)
      error.value = 'Failed to load places'
    }
    finally {
      loading.value = false
    }
  }

  async function createPlace(payload: PlacePayload): Promise<Place> {
    const place = await $fetch<Place>('/api/places', {
      method: 'POST',
      body: payload,
    })
    await fetchPlaces()
    return place
  }

  async function updatePlace(id: string, payload: PlacePayload): Promise<Place> {
    const place = await $fetch<Place>(`/api/places/${id}`, {
      method: 'PUT',
      body: payload,
    })
    await fetchPlaces()
    return place
  }

  async function deletePlace(id: string): Promise<void> {
    await $fetch(`/api/places/${id}`, { method: 'DELETE' })
    await fetchPlaces()
  }

  const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

  return {
    places,
    total,
    totalPages,
    currentPage,
    pageSize,
    sortBy,
    sortOrder,
    loading,
    error,
    fetchPlaces,
    createPlace,
    updatePlace,
    deletePlace,
  }
}
