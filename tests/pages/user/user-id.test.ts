import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import UserIdPage from '~/pages/user/[id].vue'

// Mock useRoute to provide the id param
vi.mock('#imports', async (importOriginal) => {
  const original = await importOriginal<Record<string, unknown>>()
  return {
    ...original,
    useRoute: () => ({
      params: { id: 'user-123' },
    }),
  }
})

// Mock $fetch which is used internally by useFetch
const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

describe('UserIdPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders user name and details when data loads', async () => {
    mockFetch.mockResolvedValue({
      id: 'user-123',
      name: 'Bob',
      email: 'bob@example.com',
      isActive: true,
      createdAt: '2023-03-10T00:00:00Z',
    })

    const wrapper = await mountSuspended(UserIdPage)
    expect(wrapper.text()).toContain('Bob')
    expect(wrapper.text()).toContain('March 10, 2023')
  })

  it('shows error state when fetch fails', async () => {
    mockFetch.mockRejectedValue(new Error('Not Found'))

    const wrapper = await mountSuspended(UserIdPage)
    expect(wrapper.text()).toContain('User not found')
    expect(wrapper.text()).toContain('does not exist or is not available')
  })

  it('has a back to home link on error', async () => {
    mockFetch.mockRejectedValue(new Error('Not Found'))

    const wrapper = await mountSuspended(UserIdPage)
    const link = wrapper.find('.public-profile__back-link')
    expect(link.exists()).toBe(true)
    expect(link.text()).toBe('Back to Home')
  })

  it('renders heading with user name on success', async () => {
    mockFetch.mockResolvedValue({
      id: 'user-123',
      name: 'Charlie',
      email: 'charlie@example.com',
      isActive: true,
      createdAt: '2025-01-01T00:00:00Z',
    })

    const wrapper = await mountSuspended(UserIdPage)
    expect(wrapper.find('.public-profile__heading').text()).toBe('Charlie')
  })
})
