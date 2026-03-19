import type { Place, PlacePayload, PaginatedResponse } from '~/types'

export function usePlaces() {
  const { isOnline } = useNetworkStatus()
  const {
    cachedPlaces,
    generateOfflineId,
    addOperation,
    persistCachedPlaces,
  } = useOfflineStore()

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
      if (!isOnline.value) {
        places.value = cachedPlaces.value
        total.value = cachedPlaces.value.length
        return
      }

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

      cachedPlaces.value = data.items
      persistCachedPlaces()
    }
    catch {
      if (cachedPlaces.value.length > 0) {
        places.value = cachedPlaces.value
        total.value = cachedPlaces.value.length
      }
      else {
        error.value = 'Failed to load places'
      }
    }
    finally {
      loading.value = false
    }
  }

  async function createPlace(payload: PlacePayload): Promise<Place> {
    if (!isOnline.value) {
      const tempId = generateOfflineId()
      const offlinePlace: Place = {
        id: tempId,
        name: payload.name,
        address: payload.address,
        notes: payload.notes,
        url: payload.url,
        createdAt: new Date().toISOString(),
      }

      places.value = [...places.value, offlinePlace]
      cachedPlaces.value = [...cachedPlaces.value, offlinePlace]
      persistCachedPlaces()

      addOperation({
        entityType: 'place',
        action: 'create',
        tempId,
        entityId: tempId,
        payload,
        dependsOn: [],
      })

      return offlinePlace
    }

    const place = await $fetch<Place>('/api/places', {
      method: 'POST',
      body: payload,
    })
    await fetchPlaces()
    return place
  }

  async function updatePlace(id: string, payload: PlacePayload): Promise<Place> {
    if (!isOnline.value) {
      const updatedPlace: Place = {
        id,
        name: payload.name,
        address: payload.address,
        notes: payload.notes,
        url: payload.url,
        createdAt: places.value.find(p => p.id === id)?.createdAt ?? new Date().toISOString(),
      }

      places.value = places.value.map(p => p.id === id ? updatedPlace : p)
      cachedPlaces.value = cachedPlaces.value.map(p => p.id === id ? updatedPlace : p)
      persistCachedPlaces()

      addOperation({
        entityType: 'place',
        action: 'update',
        entityId: id,
        payload,
        dependsOn: [],
      })

      return updatedPlace
    }

    const place = await $fetch<Place>(`/api/places/${id}`, {
      method: 'PUT',
      body: payload,
    })
    await fetchPlaces()
    return place
  }

  async function deletePlace(id: string): Promise<void> {
    if (!isOnline.value) {
      places.value = places.value.filter(p => p.id !== id)
      cachedPlaces.value = cachedPlaces.value.filter(p => p.id !== id)
      persistCachedPlaces()

      addOperation({
        entityType: 'place',
        action: 'delete',
        entityId: id,
        payload: null,
        dependsOn: [],
      })

      return
    }

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
