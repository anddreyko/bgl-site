import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuth } from '~/composables/useAuth'

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

// Mock navigateTo — it's auto-imported from vue-router in nuxt test env
// We need to mock the #imports module
vi.mock('#imports', async (importOriginal) => {
  const original = await importOriginal<Record<string, unknown>>()
  return {
    ...original,
    navigateTo: vi.fn(),
  }
})

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset user state between tests
    const { user } = useAuth()
    user.value = null
  })

  describe('signIn', () => {
    it('calls sign-in endpoint and fetches user', async () => {
      const fullUser = { id: '1', email: 'test@test.com', name: 'Test', isActive: true, createdAt: '2024-01-01' }
      mockFetch
        .mockResolvedValueOnce({ ok: true }) // sign-in
        .mockResolvedValueOnce(fullUser) // user/me (now returns full profile)

      const { signIn, user } = useAuth()
      await signIn({ email: 'test@test.com', password: 'pass' })

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/sign-in', {
        method: 'POST',
        body: { email: 'test@test.com', password: 'pass' },
      })
      expect(user.value).toEqual(expect.objectContaining({ id: '1', name: 'Test' }))
    })
  })

  describe('signUp', () => {
    it('calls sign-up endpoint and returns message', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true, message: 'Check email' })

      const { signUp } = useAuth()
      const result = await signUp({ email: 'new@test.com', password: 'pass' })

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/sign-up', {
        method: 'POST',
        body: { email: 'new@test.com', password: 'pass' },
      })
      expect(result).toEqual({ ok: true, message: 'Check email' })
    })
  })

  describe('resendCode', () => {
    it('calls email endpoint with email', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true })

      const { resendCode } = useAuth()
      await resendCode('test@test.com')

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/email', {
        method: 'POST',
        body: { email: 'test@test.com' },
      })
    })
  })

  describe('signOut', () => {
    it('calls sign-out endpoint and clears user', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true })

      const { signOut, user } = useAuth()
      user.value = { id: '1', email: 'test@test.com', name: 'Test', isActive: true, createdAt: '2024-01-01' }

      await signOut()

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/sign-out', { method: 'POST' })
      expect(user.value).toBeNull()
    })
  })

  describe('isAuthenticated', () => {
    it('returns false when user is null', () => {
      const { isAuthenticated } = useAuth()
      expect(isAuthenticated.value).toBe(false)
    })

    it('returns true when user is set', () => {
      const { isAuthenticated, user } = useAuth()
      user.value = { id: '1', email: 'test@test.com', name: 'Test', isActive: true, createdAt: '2024-01-01' }
      expect(isAuthenticated.value).toBe(true)
    })
  })

  describe('fetchCurrentUser', () => {
    it('sets user on success', async () => {
      const fullUser = { id: '1', email: 'test@test.com', name: 'Test', isActive: true, createdAt: '2024-01-01' }
      mockFetch.mockResolvedValueOnce(fullUser) // user/me now returns full profile

      const { fetchCurrentUser, user } = useAuth()
      await fetchCurrentUser()

      expect(user.value).toEqual(expect.objectContaining({ id: '1', name: 'Test' }))
    })

    it('clears user on error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('401'))

      const { fetchCurrentUser, user } = useAuth()
      user.value = { id: '1', email: 'test@test.com', name: 'Test', isActive: true, createdAt: '2024-01-01' }

      await fetchCurrentUser()

      expect(user.value).toBeNull()
    })
  })
})
