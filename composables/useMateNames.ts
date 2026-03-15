import type { Mate } from '~/types'

let fetchPromise: Promise<void> | null = null

export function useMateNames() {
  const items = useState<Mate[]>('mate-names-global', () => [])

  if (import.meta.client && items.value.length === 0 && !fetchPromise) {
    fetchPromise = $fetch<{ items: Mate[] }>('/api/mates', { query: { size: 100 } })
      .then((res) => { items.value = res.items })
      .catch(() => {})
      .finally(() => { fetchPromise = null })
  }

  const mateNames = computed(() => {
    const map: Record<string, string> = {}
    for (const m of items.value) {
      map[m.id] = m.name
    }
    return map
  })

  const systemMateIds = computed(() => {
    const set = new Set<string>()
    for (const m of items.value) {
      if (m.isSystem) set.add(m.id)
    }
    return set
  })

  const allMates = computed(() => items.value)
  const mates = computed(() => allMates.value.filter(m => !m.isSystem))
  const systemMates = computed(() => allMates.value.filter(m => m.isSystem))

  function resolveName(mateId?: string, mateName?: string): string {
    if (!mateId) return mateName || 'Unknown'
    return mateName || mateNames.value[mateId] || mateId.slice(0, 8)
  }

  return { mateNames, systemMateIds, allMates, mates, systemMates, resolveName }
}
