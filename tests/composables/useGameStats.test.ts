import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useGameStats } from '~/composables/useGameStats'

const mockFetch = vi.fn()

vi.stubGlobal('$fetch', mockFetch)

const asyncDataResults = new Map<string, { value: unknown }>()
vi.stubGlobal('useAsyncData', (key: string, fetcher: () => Promise<unknown>, opts?: { default?: () => unknown }) => {
  const data = ref(opts?.default?.() ?? null)
  const status = ref('idle')

  const execute = async () => {
    status.value = 'pending'
    try {
      data.value = await fetcher()
      status.value = 'success'
    }
    catch {
      status.value = 'error'
    }
  }

  asyncDataResults.set(key, data)
  return { data, status, execute }
})

describe('useGameStats', () => {
  beforeEach(() => {
    mockFetch.mockReset()
    asyncDataResults.clear()
  })

  it('starts with zero stats', () => {
    const gameId = ref('game-1')
    const { stats } = useGameStats(gameId)
    expect(stats.value.totalPlays).toBe(0)
    expect(stats.value.totalTimeMinutes).toBe(0)
    expect(stats.value.winRate).toBe(0)
    expect(stats.value.isApproximate).toBe(false)
  })

  it('fetches and computes stats', async () => {
    mockFetch.mockResolvedValue({
      items: [
        {
          id: 'p1',
          startedAt: '2024-01-01T10:00:00Z',
          finishedAt: '2024-01-01T11:00:00Z',
          players: [{ id: '1', mateId: 'm1', isWinner: true }],
        },
        {
          id: 'p2',
          startedAt: '2024-01-02T10:00:00Z',
          finishedAt: '2024-01-02T10:30:00Z',
          players: [{ id: '2', mateId: 'm1' }],
        },
      ],
      total: 2,
      page: 1,
      size: 100,
    })

    const gameId = ref('game-1')
    const { stats, fetchStats } = useGameStats(gameId)
    await fetchStats()

    expect(stats.value.totalPlays).toBe(2)
    expect(stats.value.totalTimeMinutes).toBe(90)
    expect(stats.value.winRate).toBe(50)
    expect(stats.value.isApproximate).toBe(false)
    expect(mockFetch).toHaveBeenCalledWith('/api/plays', {
      query: { gameId: 'game-1', size: 100 },
    })
  })

  it('sets isApproximate when total exceeds fetched items', async () => {
    mockFetch.mockResolvedValue({
      items: [
        {
          id: 'p1',
          startedAt: '2024-01-01T10:00:00Z',
          finishedAt: '2024-01-01T11:00:00Z',
          players: [{ id: '1', mateId: 'm1', isWinner: true }],
        },
      ],
      total: 150,
      page: 1,
      size: 100,
    })

    const gameId = ref('game-1')
    const { stats, fetchStats } = useGameStats(gameId)
    await fetchStats()

    expect(stats.value.totalPlays).toBe(150)
    expect(stats.value.isApproximate).toBe(true)
  })

  it('handles fetch error gracefully', async () => {
    mockFetch.mockRejectedValue(new Error('fail'))
    const gameId = ref('game-1')
    const { stats, fetchStats } = useGameStats(gameId)
    await fetchStats()
    expect(stats.value.totalPlays).toBe(0)
  })
})
