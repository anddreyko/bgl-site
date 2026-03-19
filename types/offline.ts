export type SyncEntityType = 'mate' | 'place' | 'play'
export type SyncAction = 'create' | 'update' | 'delete'
export type SyncStatus = 'pending' | 'syncing' | 'failed' | 'resolved'

export interface SyncOperation {
  id: string
  timestamp: number
  entityType: SyncEntityType
  action: SyncAction
  tempId?: string
  entityId: string
  payload: unknown
  dependsOn: string[]
  status: SyncStatus
  error?: string
  retryCount: number
}

export type OfflineIdMap = Record<string, string>
