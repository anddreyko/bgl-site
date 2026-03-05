import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useMates } from '~/composables/useMates'

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

describe('useMates', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchMates', () => {
    it('loads mates successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        items: [{ id: '1', name: 'Alice', createdAt: '2024-01-01' }],
        total: 1,
        page: 1,
        size: 20,
      })

      const { fetchMates, mates, total, loading, error } = useMates()
      await fetchMates()

      expect(mockFetch).toHaveBeenCalledWith('/api/mates', {
        query: { page: 1, size: 20, sort: 'name', order: 'asc' },
      })
      expect(mates.value).toHaveLength(1)
      expect(mates.value[0].name).toBe('Alice')
      expect(total.value).toBe(1)
      expect(loading.value).toBe(false)
      expect(error.value).toBeNull()
    })

    it('sets error on failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const { fetchMates, mates, error, loading } = useMates()
      await fetchMates()

      expect(mates.value).toHaveLength(0)
      expect(error.value).toBe('Failed to load mates')
      expect(loading.value).toBe(false)
    })
  })

  describe('createMate', () => {
    it('creates mate and refreshes list', async () => {
      const newMate = { id: '2', name: 'Bob', createdAt: '2024-01-02' }
      mockFetch
        .mockResolvedValueOnce(newMate)
        .mockResolvedValueOnce({
          items: [newMate],
          total: 1,
          page: 1,
          size: 20,
        })

      const { createMate, mates } = useMates()
      const result = await createMate({ name: 'Bob' })

      expect(mockFetch).toHaveBeenCalledWith('/api/mates', {
        method: 'POST',
        body: { name: 'Bob' },
      })
      expect(result).toEqual(newMate)
      expect(mates.value).toHaveLength(1)
    })
  })

  describe('updateMate', () => {
    it('updates mate and refreshes list', async () => {
      const updated = { id: '1', name: 'Alice Updated', createdAt: '2024-01-01' }
      mockFetch
        .mockResolvedValueOnce(updated)
        .mockResolvedValueOnce({
          items: [updated],
          total: 1,
          page: 1,
          size: 20,
        })

      const { updateMate } = useMates()
      const result = await updateMate('1', { name: 'Alice Updated' })

      expect(mockFetch).toHaveBeenCalledWith('/api/mates/1', {
        method: 'PUT',
        body: { name: 'Alice Updated' },
      })
      expect(result).toEqual(updated)
    })
  })

  describe('deleteMate', () => {
    it('deletes mate and refreshes list', async () => {
      mockFetch
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({
          items: [],
          total: 0,
          page: 1,
          size: 20,
        })

      const { deleteMate, mates, total } = useMates()
      await deleteMate('1')

      expect(mockFetch).toHaveBeenCalledWith('/api/mates/1', { method: 'DELETE' })
      expect(mates.value).toHaveLength(0)
      expect(total.value).toBe(0)
    })
  })

  describe('totalPages', () => {
    it('computes total pages correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        items: Array.from({ length: 20 }, (_, i) => ({ id: String(i), name: `M${i}`, createdAt: '2024-01-01' })),
        total: 45,
        page: 1,
        size: 20,
      })

      const { fetchMates, totalPages } = useMates()
      await fetchMates()

      expect(totalPages.value).toBe(3)
    })
  })
})
