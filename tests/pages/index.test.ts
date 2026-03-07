import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, defineComponent, h } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'

const mockUser = ref<{ name: string } | null>(null)
const mockActivePlay = ref<unknown>(null)
const mockCheckActivePlay = vi.fn()
const mockOpenRecord = vi.fn()
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
    checkActivePlay: mockCheckActivePlay,
  }),
}))

vi.mock('~/composables/useRecordDialog', () => ({
  useRecordDialog: () => ({
    open: mockOpenRecord,
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
    mockCheckActivePlay.mockClear()
    mockOpenRecord.mockClear()
    mockFetch.mockResolvedValue({ items: [], total: 0, page: 1, size: 5 })
  })

  async function mountPage() {
    const mod = await import('~/pages/index.vue')
    return mountSuspended(mod.default, {
      global: {
        stubs: {
          PlayCard: PlayCardStub,
          UiButton: UiButtonStub,
          NuxtLink: true,
        },
      },
    })
  }

  it('renders hero for unauthenticated user', async () => {
    const wrapper = await mountPage()
    expect(wrapper.find('.home-page__hero').exists()).toBe(true)
    expect(wrapper.text()).toContain('For the')
    expect(wrapper.text()).toContain('Record')
  })

  it('does not show welcome for unauthenticated user', async () => {
    const wrapper = await mountPage()
    expect(wrapper.find('.home-page__welcome').exists()).toBe(false)
  })

  it('renders welcome for authenticated user', async () => {
    mockUser.value = { name: 'Alice' }
    const wrapper = await mountPage()
    expect(wrapper.text()).toContain('Welcome back, Alice')
  })

  it('shows active play section when play is active', async () => {
    mockUser.value = { name: 'Alice' }
    mockActivePlay.value = {
      id: 'play-1',
      status: 'draft',
      visibility: 'private',
      startedAt: new Date().toISOString(),
      players: [],
    }
    const wrapper = await mountPage()
    expect(wrapper.find('.home-page__active').exists()).toBe(true)
  })
})
