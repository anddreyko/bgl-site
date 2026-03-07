import type { Mate } from '~/types'

export function useMateNames() {
  const { data } = useAsyncData<{ items: Mate[] }>(
    'mate-names-global',
    () => $fetch<{ items: Mate[] }>('/api/mates', { query: { size: 100 } }),
  )

  const mateNames = computed(() => {
    const map: Record<string, string> = {}
    for (const m of data.value?.items ?? []) {
      map[m.id] = m.name
    }
    return map
  })

  const mates = computed(() => data.value?.items ?? [])

  return { mateNames, mates }
}
