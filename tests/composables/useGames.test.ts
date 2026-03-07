import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, nextTick } from 'vue'

// Mock data for useLazyFetch
const mockData = ref<unknown>(null)
const mockPending = ref(false)
const mockError = ref<unknown>(null)
const mockRefresh = vi.fn()

vi.mock('#app/composables/fetch', async (importOriginal) => {
  const original = await importOriginal<Record<string, unknown>>()
  return {
    ...original,
    useLazyFetch: () => ({
      data: mockData,
      pending: mockPending,
      error: mockError,
      refresh: mockRefresh,
    }),
  }
})

describe('useGames', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockData.value = null
    mockPending.value = false
    mockError.value = null
    mockRefresh.mockClear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should initialize with empty state', async () => {
    const { useGames } = await import('~/composables/useGames')
    const { games, total, totalPages, currentPage, searchQuery } = useGames()

    expect(games.value).toEqual([])
    expect(total.value).toBe(0)
    expect(totalPages.value).toBe(0)
    expect(currentPage.value).toBe(1)
    expect(searchQuery.value).toBe('')
  })

  it('should update searchQuery via search function', async () => {
    const { useGames } = await import('~/composables/useGames')
    const { search, searchQuery } = useGames()

    search('catan')
    expect(searchQuery.value).toBe('catan')
  })

  it('should debounce search query with 300ms delay', async () => {
    const { useGames } = await import('~/composables/useGames')
    const { search, searchQuery } = useGames()

    search('cat')
    expect(searchQuery.value).toBe('cat')

    vi.advanceTimersByTime(300)
    await nextTick()
  })

  it('should reset currentPage to 1 on new search', async () => {
    const { useGames } = await import('~/composables/useGames')
    const { search, goToPage, currentPage } = useGames()

    goToPage(3)
    expect(currentPage.value).toBe(3)

    search('new query')
    await nextTick()
    vi.advanceTimersByTime(300)
    await nextTick()

    expect(currentPage.value).toBe(1)
  })

  it('should compute games from data', async () => {
    const { useGames } = await import('~/composables/useGames')
    const { games, total, totalPages } = useGames()

    mockData.value = {
      items: [
        { id: '1', bggId: 1, name: 'Catan', type: 'base' },
        { id: '2', bggId: 2, name: 'Ticket to Ride', type: 'base' },
      ],
      total: 42,
      page: 1,
      size: 20,
    }

    await nextTick()

    expect(games.value).toHaveLength(2)
    expect(total.value).toBe(42)
    expect(totalPages.value).toBe(3)
  })

  it('should navigate to specific page', async () => {
    const { useGames } = await import('~/composables/useGames')
    const { goToPage, currentPage } = useGames()

    goToPage(5)
    expect(currentPage.value).toBe(5)
  })

  it('should expose pending and error state', async () => {
    const { useGames } = await import('~/composables/useGames')
    const { pending, error, search } = useGames()

    expect(pending.value).toBe(false)
    expect(error.value).toBeNull()

    // Trigger search to set hasSearched = true (isLoading depends on it)
    search('catan')
    await nextTick() // flush watcher
    vi.advanceTimersByTime(300)
    await nextTick() // flush setTimeout callback

    mockPending.value = true
    mockError.value = new Error('Network error')

    await nextTick()

    expect(pending.value).toBe(true)
    expect(error.value).toBeInstanceOf(Error)
  })
})
