import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
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

  it('shows fallback heading and plays section when profile fetch fails', async () => {
    mockFetch.mockImplementation((url: string) => {
      if (typeof url === 'string' && url.includes('/api/user/'))
        return Promise.reject(new Error('Unauthorized'))
      return Promise.resolve({ items: [], total: 0, page: 1, size: 20 })
    })

    const wrapper = await mountSuspended(UserIdPage)
    await flushPromises()
    expect(wrapper.find('.public-profile__name').exists()).toBe(true)
    expect(wrapper.find('.public-profile__plays').exists()).toBe(true)
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
    expect(wrapper.find('.public-profile__name').text()).toBe('Charlie')
  })
})
