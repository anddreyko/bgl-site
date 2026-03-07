import type { Play, PaginatedResponse } from '~/types'

export interface GameStats {
  totalPlays: number
  totalTimeMinutes: number
  winRate: number
  plays: Play[]
}

export function useGameStats(gameId: Ref<string>) {
  const stats = ref<GameStats>({
    totalPlays: 0,
    totalTimeMinutes: 0,
    winRate: 0,
    plays: [],
  })
  const loading = ref(false)

  async function fetchStats(): Promise<void> {
    loading.value = true
    try {
      const data = await $fetch<PaginatedResponse<Play>>('/api/plays', {
        query: { gameId: gameId.value, size: 100 },
      })

      const plays = data.items
      const finished = plays.filter(p => p.finishedAt)
      let totalMinutes = 0
      let wins = 0

      for (const play of finished) {
        const start = new Date(play.startedAt).getTime()
        const end = new Date(play.finishedAt!).getTime()
        totalMinutes += (end - start) / 60_000
      }

      for (const play of plays) {
        const hasWinner = play.players.some(p => p.isWinner)
        if (hasWinner) wins++
      }

      stats.value = {
        totalPlays: data.total,
        totalTimeMinutes: Math.round(totalMinutes),
        winRate: plays.length > 0 ? Math.round((wins / plays.length) * 100) : 0,
        plays,
      }
    }
    catch {
      // keep defaults
    }
    finally {
      loading.value = false
    }
  }

  return { stats, loading, fetchStats }
}
