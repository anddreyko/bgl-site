import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useActivePlay } from '~/composables/useActivePlay'

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

const stateStore: Record<string, { value: unknown }> = {}
vi.stubGlobal('useState', (key: string, init: () => unknown) => {
  if (!stateStore[key]) {
    stateStore[key] = { value: init() }
  }
  return stateStore[key]
})

describe('useActivePlay', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    for (const key of Object.keys(stateStore)) {
      stateStore[key] = undefined as unknown as { value: unknown }
    }
  })

  it('initializes with null activePlay', () => {
    const { activePlay } = useActivePlay()
    expect(activePlay.value).toBeNull()
  })

  it('starts a play and sets activePlay', async () => {
    const mockPlay = {
      id: 'play-1',
      status: 'draft',
      visibility: 'private',
      startedAt: '2024-01-01T00:00:00Z',
      players: [],
    }
    mockFetch.mockResolvedValueOnce(mockPlay)

    const { activePlay, startPlay } = useActivePlay()
    const id = await startPlay({
      visibility: 'private',
      players: [],
    })

    expect(id).toBe('play-1')
    expect(activePlay.value).toEqual(mockPlay)
    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch).toHaveBeenCalledWith('/api/plays', {
      method: 'POST',
      body: { visibility: 'private', players: [] },
    })
  })

  it('finishes the active play', async () => {
    const mockPlay = {
      id: 'play-1',
      status: 'draft',
      visibility: 'private',
      startedAt: '2024-01-01T00:00:00Z',
      players: [],
    }
    stateStore['active-play'] = { value: mockPlay }
    mockFetch.mockResolvedValueOnce({})

    const { activePlay, finishPlay } = useActivePlay()
    await finishPlay()

    expect(activePlay.value).toBeNull()
    expect(mockFetch).toHaveBeenCalledWith('/api/plays/play-1/finish', {
      method: 'PATCH',
      body: expect.objectContaining({ finishedAt: expect.any(String) }),
    })
  })

  it('does nothing when finishing without active play', async () => {
    const { finishPlay } = useActivePlay()
    await finishPlay()

    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('checks for active play from recent plays', async () => {
    const activeDraft = {
      id: 'play-2',
      status: 'draft',
      visibility: 'private',
      startedAt: '2024-01-01T00:00:00Z',
      players: [],
    }
    mockFetch.mockResolvedValueOnce({
      items: [
        { id: 'play-1', status: 'published', finishedAt: '2024-01-01T01:00:00Z', startedAt: '2024-01-01T00:00:00Z', players: [] },
        activeDraft,
      ],
    })

    const { activePlay, checkActivePlay } = useActivePlay()
    await checkActivePlay()

    expect(activePlay.value).toEqual(activeDraft)
  })

  it('sets activePlay to null when no active play found', async () => {
    mockFetch.mockResolvedValueOnce({
      items: [
        { id: 'play-1', status: 'published', finishedAt: '2024-01-01T01:00:00Z', startedAt: '2024-01-01T00:00:00Z', players: [] },
      ],
    })

    const { activePlay, checkActivePlay } = useActivePlay()
    await checkActivePlay()

    expect(activePlay.value).toBeNull()
  })

  it('handles error in checkActivePlay', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const { activePlay, checkActivePlay } = useActivePlay()
    await checkActivePlay()

    expect(activePlay.value).toBeNull()
  })
})
