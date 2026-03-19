import type { SyncOperation } from '~/types'

export function useSyncConflict() {
  const { failedOps, removeOperation, updateOperation } = useOfflineStore()
  const { retrySingle } = useOfflineSync()

  const currentConflict = useState<SyncOperation | null>('sync:conflict', () => null)

  const hasConflicts = computed(() => failedOps.value.length > 0)

  function showNextConflict(): void {
    currentConflict.value = failedOps.value[0] ?? null
  }

  async function resolveWithLocal(opId: string): Promise<void> {
    updateOperation(opId, { status: 'pending', error: undefined, retryCount: 0 })
    currentConflict.value = null
    await retrySingle(opId)
    showNextConflict()
  }

  function resolveWithServer(opId: string): void {
    removeOperation(opId)
    currentConflict.value = null
    showNextConflict()
  }

  async function resolveAsCopy(opId: string): Promise<void> {
    const op = failedOps.value.find(o => o.id === opId)
    if (!op || op.action !== 'create') {
      resolveWithServer(opId)
      return
    }

    removeOperation(opId)

    const { generateOfflineId, addOperation } = useOfflineStore()
    const newTempId = generateOfflineId()

    addOperation({
      entityType: op.entityType,
      action: 'create',
      tempId: newTempId,
      entityId: newTempId,
      payload: op.payload,
      dependsOn: [],
    })

    currentConflict.value = null
    showNextConflict()
  }

  function dismiss(): void {
    currentConflict.value = null
  }

  return {
    currentConflict: readonly(currentConflict),
    hasConflicts,
    showNextConflict,
    resolveWithLocal,
    resolveWithServer,
    resolveAsCopy,
    dismiss,
  }
}
