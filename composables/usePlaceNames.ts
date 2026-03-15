import type { Place } from '~/types'

export function usePlaceNames() {
  const { data } = useAsyncData<{ items: Place[] }>(
    'place-names-global',
    () => $fetch<{ items: Place[] }>('/api/places', { query: { size: 100 } }),
    { server: false },
  )

  const placeNames = computed(() => {
    const map: Record<string, string> = {}
    for (const p of data.value?.items ?? []) {
      map[p.id] = p.name
    }
    return map
  })

  const places = computed(() => data.value?.items ?? [])

  return { placeNames, places }
}
