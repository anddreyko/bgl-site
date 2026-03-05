import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ConfirmToken from '~/pages/auth/confirm/[token].vue'

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)
vi.stubGlobal('useHead', vi.fn())
vi.stubGlobal('definePageMeta', vi.fn())
vi.stubGlobal('useRoute', () => ({
  params: { token: 'test-token-123' },
}))

describe('confirm token page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders title', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true })
    const wrapper = await mountSuspended(ConfirmToken)

    expect(wrapper.find('h1').text()).toBe('Email Confirmation')
  })

  it('shows success message after successful confirmation', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true })
    const wrapper = await mountSuspended(ConfirmToken)

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('Email confirmed! You can now sign in.')
    })

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch.mock.calls[0][0]).toContain('/api/auth/confirm/')
  })

  it('shows link to sign-in on success', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true })
    const wrapper = await mountSuspended(ConfirmToken)

    await vi.waitFor(() => {
      expect(wrapper.find('a[href="/auth/sign-in"]').exists()).toBe(true)
    })
  })

  it('shows error message on failed confirmation', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Token expired'))
    const wrapper = await mountSuspended(ConfirmToken)

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('Token expired')
    })
  })

  it('shows error state for non-Error rejection', async () => {
    mockFetch.mockRejectedValueOnce('unknown error')
    const wrapper = await mountSuspended(ConfirmToken)

    await vi.waitFor(() => {
      expect(wrapper.find('[role="alert"]').exists()).toBe(true)
    })
  })
})
