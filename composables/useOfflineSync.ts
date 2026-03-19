import type { SyncOperation, SyncEntityType, SyncAction } from '~/types'

interface EndpointConfig {
  path: (entityId: string) => string
  method: string
}

const ENDPOINTS: Record<SyncEntityType, Record<SyncAction, EndpointConfig>> = {
  mate: {
    create: { path: () => '/api/mates', method: 'POST' },
    update: { path: id => `/api/mates/${id}`, method: 'PUT' },
    delete: { path: id => `/api/mates/${id}`, method: 'DELETE' },
  },
  place: {
    create: { path: () => '/api/places', method: 'POST' },
    update: { path: id => `/api/places/${id}`, method: 'PUT' },
    delete: { path: id => `/api/places/${id}`, method: 'DELETE' },
  },
  play: {
    create: { path: () => '/api/plays', method: 'POST' },
    update: { path: id => `/api/plays/${id}`, method: 'PATCH' },
    delete: { path: id => `/api/plays/${id}`, method: 'DELETE' },
  },
}

export function useOfflineSync() {
  const {
    syncQueue,
    updateOperation,
    removeOperation,
    resolveId,
    resolveIdsInPayload,
    mapId,
    isOfflineId,
  } = useOfflineStore()

  const isSyncing = useState<boolean>('offline:syncing', () => false)

  function areDepsResolved(op: SyncOperation): boolean {
    return op.dependsOn.every(depId => !isOfflineId(resolveId(depId)))
  }

  async function syncOperation(op: SyncOperation): Promise<boolean> {
    const endpoint = ENDPOINTS[op.entityType][op.action]
    const entityId = resolveId(op.entityId)
    const path = endpoint.path(entityId)
    const payload = op.payload ? resolveIdsInPayload(op.payload) : undefined

    updateOperation(op.id, { status: 'syncing' })

    try {
      const options: Record<string, unknown> = { method: endpoint.method }
      if (payload && op.action !== 'delete') {
        options.body = payload
      }

      const response = await $fetch<{ id: string }>(path, options)

      if (op.action === 'create' && op.tempId && response?.id) {
        mapId(op.tempId, response.id)
      }

      updateOperation(op.id, { status: 'resolved' })
      return true
    }
    catch (err: unknown) {
      const status = (err as { statusCode?: number })?.statusCode ?? 0

      if (status >= 400 && status < 500) {
        const message = (err as { statusMessage?: string })?.statusMessage ?? 'Sync failed'
        updateOperation(op.id, {
          status: 'failed',
          error: message,
          retryCount: op.retryCount + 1,
        })
        return true
      }

      updateOperation(op.id, { status: 'pending' })
      return false
    }
  }

  async function startSync(): Promise<void> {
    if (isSyncing.value) return
    isSyncing.value = true

    try {
      const pending = [...syncQueue.value]
        .filter(op => op.status === 'pending')
        .sort((a, b) => a.timestamp - b.timestamp)

      for (const op of pending) {
        if (!areDepsResolved(op)) continue

        const canContinue = await syncOperation(op)
        if (!canContinue) break
      }

      const stillPending = syncQueue.value.some(op => op.status === 'pending' && areDepsResolved(op))
      if (stillPending) {
        await startSync()
        return
      }

      const resolved = syncQueue.value.filter(op => op.status === 'resolved')
      for (const op of resolved) {
        removeOperation(op.id)
      }
    }
    finally {
      isSyncing.value = false
    }
  }

  async function retrySingle(opId: string): Promise<void> {
    const op = syncQueue.value.find(o => o.id === opId)
    if (!op) return
    updateOperation(opId, { status: 'pending', error: undefined })
    await startSync()
  }

  function discardOperation(opId: string): void {
    removeOperation(opId)
  }

  return {
    isSyncing: readonly(isSyncing),
    startSync,
    retrySingle,
    discardOperation,
  }
}
