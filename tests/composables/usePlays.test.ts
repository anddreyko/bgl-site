import { describe, it, expect, vi, beforeEach } from 'vitest'
import { usePlays } from '~/composables/usePlays'

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

// Mock Nuxt composables
const stateStore: Record<string, { value: unknown }> = {}
vi.stubGlobal('useState', (key: string, init: () => unknown) => {
  if (!stateStore[key]) {
    stateStore[key] = { value: init() }
  }
  return stateStore[key]
})
vi.stubGlobal('computed', (fn: () => unknown) => ({ value: fn() }))

describe('usePlays', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    for (const key of Object.keys(stateStore)) {
      stateStore[key] = undefined as unknown as { value: unknown }
    }
  })

  it('initializes with default state', () => {
    const { plays, total, currentPage, loading, error } = usePlays()
    expect(plays.value).toEqual([])
    expect(total.value).toBe(0)
    expect(currentPage.value).toBe(1)
    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
  })

  it('fetches plays and updates state', async () => {
    const mockData = {
      items: [
        { id: '1', status: 'draft', visibility: 'private', startedAt: '2024-01-01T00:00:00Z', players: [] },
      ],
      total: 1,
      page: 1,
      size: 10,
    }
    mockFetch.mockResolvedValueOnce(mockData)

    const { plays, total, fetchPlays } = usePlays()
    await fetchPlays()

    expect(mockFetch).toHaveBeenCalledWith('/api/plays', {
      query: { page: 1, size: 10 },
    })
    expect(plays.value).toEqual(mockData.items)
    expect(total.value).toBe(1)
  })

  it('fetches plays with custom params', async () => {
    const mockData = { items: [], total: 0, page: 2, size: 5 }
    mockFetch.mockResolvedValueOnce(mockData)

    const { fetchPlays } = usePlays()
    await fetchPlays({ page: 2, size: 5, gameId: 'game-1' })

    expect(mockFetch).toHaveBeenCalledWith('/api/plays', {
      query: { page: 2, size: 5, gameId: 'game-1' },
    })
  })

  it('handles fetch error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const { plays, error, fetchPlays } = usePlays()
    await fetchPlays()

    expect(error.value).toBe('Failed to load plays')
    expect(plays.value).toEqual([])
  })

  it('sets loading state during fetch', async () => {
    let resolvePromise: (value: unknown) => void = () => {}
    mockFetch.mockReturnValueOnce(new Promise((resolve) => {
      resolvePromise = resolve
    }))

    const { loading, fetchPlays } = usePlays()
    const fetchPromise = fetchPlays()

    expect(loading.value).toBe(true)

    resolvePromise({ items: [], total: 0, page: 1, size: 10 })
    await fetchPromise

    expect(loading.value).toBe(false)
  })
})
