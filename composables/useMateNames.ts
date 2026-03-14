import type { Mate } from '~/types'

export function useMateNames() {
  const { data } = useAsyncData<{ items: Mate[] }>(
    'mate-names-global',
    () => $fetch<{ items: Mate[] }>('/api/mates', { query: { size: 100 } }),
    { server: false },
  )

  const mateNames = computed(() => {
    const map: Record<string, string> = {}
    for (const m of data.value?.items ?? []) {
      map[m.id] = m.name
    }
    return map
  })

  const systemMateIds = computed(() => {
    const set = new Set<string>()
    for (const m of data.value?.items ?? []) {
      if (m.isSystem) set.add(m.id)
    }
    return set
  })

  const allMates = computed(() => data.value?.items ?? [])
  const mates = computed(() => allMates.value.filter(m => !m.isSystem))
  const systemMates = computed(() => allMates.value.filter(m => m.isSystem))

  function resolveName(mateId?: string, mateName?: string): string {
    if (!mateId) return mateName || 'Unknown'
    return mateName || mateNames.value[mateId] || mateId.slice(0, 8)
  }

  return { mateNames, systemMateIds, allMates, mates, systemMates, resolveName }
}
