import type { Play, PlayCreatePayload, PaginatedResponse } from '~/types'

export function useActivePlay() {
  const activePlay = useState<Play | null>('active-play', () => null)

  async function startPlay(payload: PlayCreatePayload): Promise<string> {
    const play = await $fetch<Play>('/api/plays', {
      method: 'POST',
      body: payload,
    })

    activePlay.value = play

    return play.id
  }

  async function finishPlay(): Promise<void> {
    if (!activePlay.value) return

    await $fetch(`/api/plays/${activePlay.value.id}`, {
      method: 'PATCH',
      body: { finishedAt: new Date().toISOString() },
    })

    activePlay.value = null
  }

  async function checkActivePlay(): Promise<void> {
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
