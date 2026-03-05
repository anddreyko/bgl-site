import type { Play, PlayCreatePayload, PaginatedResponse } from '~/types'

export function useActivePlay() {
  const activePlay = useState<Play | null>('active-play', () => null)

  async function startPlay(payload: PlayCreatePayload): Promise<string> {
    const result = await $fetch<{ session_id: string }>('/api/plays', {
      method: 'POST',
      body: payload,
    })

    const play = await $fetch<Play>(`/api/plays/${result.session_id}`)
    activePlay.value = play

    return result.session_id
  }

  async function finishPlay(): Promise<void> {
    if (!activePlay.value) return

    await $fetch(`/api/plays/${activePlay.value.id}/finish`, {
      method: 'PATCH',
      body: { finished_at: new Date().toISOString() },
    })

    activePlay.value = null
  }

  async function checkActivePlay(): Promise<void> {
    try {
      const data = await $fetch<PaginatedResponse<Play>>('/api/plays', {
        query: { page: 1, size: 5 },
      })
      const active = data.items.find(p => !p.finishedAt && p.status === 'draft')
      activePlay.value = active ?? null
    }
    catch {
      activePlay.value = null
    }
  }

  return { activePlay, startPlay, finishPlay, checkActivePlay }
}
