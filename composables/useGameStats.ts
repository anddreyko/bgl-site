import type { Play, PaginatedResponse } from '~/types'

export interface GameStats {
  totalPlays: number
  totalTimeMinutes: number
  winRate: number
  plays: Play[]
  isApproximate: boolean
}

export function useGameStats(gameId: Ref<string>) {
  const { data: stats, status, execute: fetchStats } = useAsyncData<GameStats>(
    `game-stats-${gameId.value}`,
    async () => {
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

      return {
        totalPlays: data.total,
        totalTimeMinutes: Math.round(totalMinutes),
        winRate: plays.length > 0 ? Math.round((wins / plays.length) * 100) : 0,
        plays,
        isApproximate: data.total > plays.length,
      }
    },
    { default: () => ({ totalPlays: 0, totalTimeMinutes: 0, winRate: 0, plays: [], isApproximate: false }) },
  )

  const loading = computed(() => status.value === 'pending')

  return { stats, loading, fetchStats }
}
