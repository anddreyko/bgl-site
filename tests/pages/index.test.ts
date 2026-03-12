import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, defineComponent, h, nextTick } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'

const mockUser = ref<{ id: string, name: string } | null>(null)
const mockActivePlay = ref<unknown>(null)
const mockFetch = vi.fn()

vi.mock('~/composables/useAuth', () => ({
  useAuth: () => ({
    user: mockUser,
    isAuthenticated: { value: !!mockUser.value },
  }),
}))

vi.mock('~/composables/useActivePlay', () => ({
  useActivePlay: () => ({
    activePlay: mockActivePlay,
  }),
}))

vi.stubGlobal('$fetch', mockFetch)

const PlayCardStub = defineComponent({
  name: 'PlayCard',
  props: ['play'],
  setup(props) {
    return () => h('div', { class: 'play-card-stub' }, props.play?.id)
  },
})

const UiButtonStub = defineComponent({
  name: 'UiButton',
  props: ['variant'],
  emits: ['click'],
  setup(_, { slots, emit }) {
    return () => h('button', { onClick: () => emit('click') }, slots.default?.())
  },
})

describe('pages/index.vue', () => {
  beforeEach(() => {
    mockUser.value = null
    mockActivePlay.value = null
    mockFetch.mockResolvedValue({ items: [], total: 0, page: 1, size: 20 })
  })

  async function mountPage() {
    const mod = await import('~/pages/index.vue')
    const wrapper = await mountSuspended(mod.default, {
      global: {
        stubs: {
          PlayCard: PlayCardStub,
          UiButton: UiButtonStub,
          UiPagination: true,
          NuxtLink: true,
        },
      },
    })
    await flushPromises()
    await nextTick()
    return wrapper
  }

  it('renders hero for unauthenticated user', async () => {
    const wrapper = await mountPage()
    expect(wrapper.find('.home-page__hero').exists()).toBe(true)
    expect(wrapper.text()).toContain('Track your board game plays')
  })

  it('does not show hero for authenticated user', async () => {
    mockUser.value = { id: 'u1', name: 'Alice' }
    const wrapper = await mountPage()
    expect(wrapper.find('.home-page__hero').exists()).toBe(false)
  })

  it('shows active play section when active play exists', async () => {
    const activeDraft = {
      id: 'play-1',
      status: 'current',
      visibility: 'private',
      startedAt: new Date().toISOString(),
      author: { id: 'u1', name: 'Alice' },
      players: [],
    }
    mockUser.value = { id: 'u1', name: 'Alice' }
    mockFetch.mockResolvedValue({
      items: [activeDraft],
      total: 1,
      page: 1,
      size: 20,
    })
    mockActivePlay.value = activeDraft
    const wrapper = await mountPage()
    expect(wrapper.find('.home-page__active').exists()).toBe(true)
  })

  it('shows stats when feed data is loaded', async () => {
    mockFetch.mockResolvedValue({
      items: [
        { id: 'p1', status: 'finished', game: { id: 'g1', name: 'Chess' }, author: { id: 'a1', name: 'Bob' }, startedAt: '2024-01-01', finishedAt: '2024-01-01', visibility: 'public', players: [] },
        { id: 'p2', status: 'finished', game: { id: 'g2', name: 'Go' }, author: { id: 'a2', name: 'Eve' }, startedAt: '2024-01-02', finishedAt: '2024-01-02', visibility: 'public', players: [] },
      ],
      total: 42,
      page: 1,
      size: 20,
    })
    const wrapper = await mountPage()
    expect(wrapper.find('.home-page__stats').exists()).toBe(true)
    expect(wrapper.text()).toContain('42 plays')
    expect(wrapper.text()).toContain('2 games')
    expect(wrapper.text()).toContain('2 players')
  })

  it('shows recent plays section when feed has data', async () => {
    mockFetch.mockResolvedValue({
      items: [
        { id: 'p1', status: 'finished', game: { id: 'g1', name: 'Chess' }, author: { id: 'a1', name: 'Bob' }, startedAt: '2024-01-01', finishedAt: '2024-01-01', visibility: 'public', players: [] },
      ],
      total: 1,
      page: 1,
      size: 20,
    })
    const wrapper = await mountPage()
    expect(wrapper.text()).toContain('Recent Plays')
  })

  it('hides recent plays section when feed is empty', async () => {
    const wrapper = await mountPage()
    expect(wrapper.text()).not.toContain('Recent Plays')
  })
})
