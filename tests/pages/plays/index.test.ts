import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import PlaysPage from '~/pages/plays/index.vue'

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

describe('PlaysPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockResolvedValue({ items: [], total: 0, page: 1, size: 10 })
  })

  it('renders page title', async () => {
    const wrapper = await mountSuspended(PlaysPage)
    expect(wrapper.find('.plays-page__title').text()).toBe('Plays')
  })

  it('renders New Play button', async () => {
    const wrapper = await mountSuspended(PlaysPage)
    const btn = wrapper.findAll('button').find(b => b.text() === 'New Play')
    expect(btn).toBeDefined()
  })

  it('renders plays page container', async () => {
    const wrapper = await mountSuspended(PlaysPage)
    expect(wrapper.find('.plays-page').exists()).toBe(true)
  })
})
