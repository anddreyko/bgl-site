import type { Place } from '~/types'

let fetchPromise: Promise<void> | null = null

export function usePlaceNames() {
  const items = useState<Place[]>('place-names-global', () => [])

  if (import.meta.client && items.value.length === 0 && !fetchPromise) {
    fetchPromise = $fetch<{ items: Place[] }>('/api/places', { query: { size: 100 } })
      .then((res) => { items.value = res.items })
      .catch(() => {})
      .finally(() => { fetchPromise = null })
  }

  const placeNames = computed(() => {
    const map: Record<string, string> = {}
    for (const p of items.value) {
      map[p.id] = p.name
    }
    return map
  })

  const places = computed(() => items.value)

  return { placeNames, places }
}
