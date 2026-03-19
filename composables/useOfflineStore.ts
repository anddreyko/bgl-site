import type { SyncOperation, OfflineIdMap, Mate, Place, Play } from '~/types'

function hasIndexedDB(): boolean {
  return typeof indexedDB !== 'undefined'
}

async function idbGet<T>(key: string): Promise<T | undefined> {
  if (!hasIndexedDB()) return undefined
  const { get } = await import('idb-keyval')
  return get<T>(key)
}

async function idbSet(key: string, value: unknown): Promise<void> {
  if (!hasIndexedDB()) return
  const { set } = await import('idb-keyval')
  await set(key, value)
}

const QUEUE_KEY = 'offline:queue'
const ID_MAP_KEY = 'offline:idMap'
const CACHE_MATES_KEY = 'offline:cache:mates'
const CACHE_PLACES_KEY = 'offline:cache:places'

const OFFLINE_PREFIX = '_offline_'
const PERSIST_DEBOUNCE = 300

export function useOfflineStore() {
  const syncQueue = useState<SyncOperation[]>('offline:queue', () => [])
  const idMap = useState<OfflineIdMap>('offline:idMap', () => ({}))
  const cachedMates = useState<Mate[]>('offline:cache:mates', () => [])
  const cachedPlaces = useState<Place[]>('offline:cache:places', () => [])
  const loaded = useState<boolean>('offline:loaded', () => false)

  function generateOfflineId(): string {
    return `${OFFLINE_PREFIX}${crypto.randomUUID()}`
  }

  function isOfflineId(id: string): boolean {
    return id.startsWith(OFFLINE_PREFIX)
  }

  function resolveId(id: string): string {
    return idMap.value[id] ?? id
  }

  function resolveIdsInPayload<T>(payload: T): T {
    if (!payload || typeof payload !== 'object') return payload

    if (Array.isArray(payload)) {
      return payload.map(item => resolveIdsInPayload(item)) as T
    }

    const result = { ...payload } as Record<string, unknown>
    for (const [key, value] of Object.entries(result)) {
      if (typeof value === 'string' && isOfflineId(value)) {
        result[key] = resolveId(value)
      }
      else if (typeof value === 'object' && value !== null) {
        result[key] = resolveIdsInPayload(value)
      }
    }
    return result as T
  }

  function addOperation(op: Omit<SyncOperation, 'id' | 'timestamp' | 'status' | 'retryCount'>): void {
    const operation: SyncOperation = {
      ...op,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      status: 'pending',
      retryCount: 0,
    }
    syncQueue.value = [...syncQueue.value, operation]
  }

  function updateOperation(id: string, patch: Partial<SyncOperation>): void {
    syncQueue.value = syncQueue.value.map(op =>
      op.id === id ? { ...op, ...patch } : op,
    )
  }

  function removeOperation(id: string): void {
    syncQueue.value = syncQueue.value.filter(op => op.id !== id)
  }

  function mapId(tempId: string, realId: string): void {
    idMap.value = { ...idMap.value, [tempId]: realId }
  }

  function replaceIdsInState(mates: Ref<Mate[]>, places: Ref<Place[]>, activePlay: Ref<Play | null>): void {
    for (const [tempId, realId] of Object.entries(idMap.value)) {
      mates.value = mates.value.map(m =>
        m.id === tempId ? { ...m, id: realId } : m,
      )
      places.value = places.value.map(p =>
        p.id === tempId ? { ...p, id: realId } : p,
      )
      if (activePlay.value?.id === tempId) {
        activePlay.value = { ...activePlay.value, id: realId }
      }
    }
  }

  const pendingCount = computed(() =>
    syncQueue.value.filter(op => op.status === 'pending' || op.status === 'syncing').length,
  )

  const failedOps = computed(() =>
    syncQueue.value.filter(op => op.status === 'failed'),
  )

  async function loadFromStorage(): Promise<void> {
    if (!import.meta.client || loaded.value) return

    const [queue, map, mates, places] = await Promise.all([
      idbGet<SyncOperation[]>(QUEUE_KEY),
      idbGet<OfflineIdMap>(ID_MAP_KEY),
      idbGet<Mate[]>(CACHE_MATES_KEY),
      idbGet<Place[]>(CACHE_PLACES_KEY),
    ])

    if (queue) syncQueue.value = queue
    if (map) idMap.value = map
    if (mates) cachedMates.value = mates
    if (places) cachedPlaces.value = places

    loaded.value = true
  }

  async function persistQueue(): Promise<void> {
    if (!import.meta.client) return
    await idbSet(QUEUE_KEY, toRaw(syncQueue.value))
  }

  async function persistIdMap(): Promise<void> {
    if (!import.meta.client) return
    await idbSet(ID_MAP_KEY, toRaw(idMap.value))
  }

  async function persistCachedMates(): Promise<void> {
    if (!import.meta.client) return
    await idbSet(CACHE_MATES_KEY, toRaw(cachedMates.value))
  }

  async function persistCachedPlaces(): Promise<void> {
    if (!import.meta.client) return
    await idbSet(CACHE_PLACES_KEY, toRaw(cachedPlaces.value))
  }

  if (import.meta.client) {
    let queueTimer: ReturnType<typeof setTimeout> | undefined
    let idMapTimer: ReturnType<typeof setTimeout> | undefined

    watch(syncQueue, () => {
      clearTimeout(queueTimer)
      queueTimer = setTimeout(persistQueue, PERSIST_DEBOUNCE)
    }, { deep: true })

    watch(idMap, () => {
      clearTimeout(idMapTimer)
      idMapTimer = setTimeout(persistIdMap, PERSIST_DEBOUNCE)
    }, { deep: true })
  }

  return {
    syncQueue: readonly(syncQueue),
    idMap: readonly(idMap),
    cachedMates,
    cachedPlaces,
    loaded: readonly(loaded),
    pendingCount,
    failedOps,
    generateOfflineId,
    isOfflineId,
    resolveId,
    resolveIdsInPayload,
    addOperation,
    updateOperation,
    removeOperation,
    mapId,
    replaceIdsInState,
    loadFromStorage,
    persistCachedMates,
    persistCachedPlaces,
  }
}
