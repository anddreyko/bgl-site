import type { Play, PlayCreatePayload, PaginatedResponse } from '~/types'

export function useActivePlay() {
  const { isOnline } = useNetworkStatus()
  const {
    generateOfflineId,
    isOfflineId,
    addOperation,
  } = useOfflineStore()

  const activePlay = useState<Play | null>('active-play', () => null)

  function collectDependencies(payload: PlayCreatePayload): string[] {
    const deps: string[] = []
    if (payload.locationId && isOfflineId(payload.locationId)) {
      deps.push(payload.locationId)
    }
    if (payload.players) {
      for (const player of payload.players) {
        if (isOfflineId(player.mateId)) {
          deps.push(player.mateId)
        }
      }
    }
    return deps
  }

  async function startPlay(payload: PlayCreatePayload): Promise<string> {
    if (!isOnline.value) {
      const tempId = generateOfflineId()
      const offlinePlay: Play = {
        id: tempId,
        name: payload.name,
        notes: payload.notes,
        status: 'current',
        visibility: payload.visibility ?? 'private',
        startedAt: payload.startedAt ?? new Date().toISOString(),
        finishedAt: payload.finishedAt,
        game: payload.gameId ? { id: payload.gameId, name: '' } : undefined,
        location: payload.locationId ? { id: payload.locationId, name: '' } : undefined,
        players: (payload.players ?? []).map(p => ({
          id: generateOfflineId(),
          mate: { id: p.mateId, name: '' },
          score: p.score,
          isWinner: p.isWinner,
          color: p.color,
          teamTag: p.teamTag,
        })),
      }

      activePlay.value = offlinePlay

      addOperation({
        entityType: 'play',
        action: 'create',
        tempId,
        entityId: tempId,
        payload,
        dependsOn: collectDependencies(payload),
      })

      return tempId
    }

    const play = await $fetch<Play>('/api/plays', {
      method: 'POST',
      body: payload,
    })

    activePlay.value = play
    return play.id
  }

  async function finishPlay(): Promise<void> {
    if (!activePlay.value) return

    const playId = activePlay.value.id
    const finishedAt = new Date().toISOString()

    if (!isOnline.value) {
      activePlay.value = null

      const deps: string[] = []
      if (isOfflineId(playId)) {
        deps.push(playId)
      }

      addOperation({
        entityType: 'play',
        action: 'update',
        entityId: playId,
        payload: { finishedAt },
        dependsOn: deps,
      })

      return
    }

    await $fetch(`/api/plays/${playId}`, {
      method: 'PATCH',
      body: { finishedAt },
    })

    activePlay.value = null
  }

  async function checkActivePlay(): Promise<void> {
    if (!isOnline.value) return

    try {
      const data = await $fetch<PaginatedResponse<Play>>('/api/plays', {
        query: { page: 1, size: 1, status: 'current' },
      })
      activePlay.value = data.items[0] ?? null
    }
    catch {
      activePlay.value = null
    }
  }

  return { activePlay, startPlay, finishPlay, checkActivePlay }
}
