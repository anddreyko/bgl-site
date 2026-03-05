import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, defineComponent, h } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'

// Mock route
const mockRouteParams: Record<string, string> = { id: 'test-game-123' }

const mockGameData = ref<unknown>(null)
const mockPending = ref(false)
const mockError = ref<unknown>(null)

vi.mock('#app/composables/fetch', async (importOriginal) => {
  const original = await importOriginal<Record<string, unknown>>()
  return {
    ...original,
    useLazyFetch: () => ({
      data: mockGameData,
      pending: mockPending,
      error: mockError,
    }),
  }
})

vi.mock('#app/composables/router', async (importOriginal) => {
  const original = await importOriginal<Record<string, unknown>>()
  return {
    ...original,
    useRoute: () => ({ params: mockRouteParams }),
  }
})

// Stub NuxtLink
const NuxtLinkStub = defineComponent({
  name: 'NuxtLink',
  props: ['to'],
  setup(props, { slots }) {
    return () => h('a', { href: props.to }, slots.default?.())
  },
})

// Stub GameCard
const GameCardStub = defineComponent({
  name: 'GameCard',
  props: ['game'],
  setup(props) {
    return () => h('div', { class: 'game-card-stub' }, props.game?.name)
  },
})

describe('pages/game/[id].vue', () => {
  beforeEach(() => {
    mockGameData.value = null
    mockPending.value = false
    mockError.value = null
    mockRouteParams.id = 'test-game-123'
  })

  async function mountPage() {
    const mod = await import('~/pages/game/[id].vue')
    return mountSuspended(mod.default, {
      global: {
        stubs: {
          NuxtLink: NuxtLinkStub,
          GameCard: GameCardStub,
        },
      },
    })
  }

  it('should show loading state when pending', async () => {
    mockPending.value = true
    const wrapper = await mountPage()
    expect(wrapper.text()).toContain('Loading game...')
  })

  it('should show error state on fetch error', async () => {
    mockError.value = new Error('Not found')
    const wrapper = await mountPage()
    expect(wrapper.text()).toContain('Failed to load game details')
  })

  it('should render game card when data is loaded', async () => {
    mockGameData.value = {
      id: 'test-game-123',
      bggId: 123,
      name: 'Catan',
      type: 'base',
      year: 1995,
    }
    const wrapper = await mountPage()
    const card = wrapper.find('.game-card-stub')
    expect(card.exists()).toBe(true)
    expect(card.text()).toBe('Catan')
  })

  it('should render back link to catalog', async () => {
    mockGameData.value = {
      id: 'test-game-123',
      bggId: 123,
      name: 'Catan',
      type: 'base',
    }
    const wrapper = await mountPage()
    const backLink = wrapper.find('.game-detail__back')
    expect(backLink.exists()).toBe(true)
    expect(backLink.attributes('href')).toBe('/game')
    expect(backLink.text()).toContain('Back to catalog')
  })

  it('should show alternative names when available', async () => {
    mockGameData.value = {
      id: 'test-game-123',
      bggId: 123,
      name: 'Catan',
      type: 'base',
      alternativeNames: ['Settlers of Catan', 'Die Siedler von Catan'],
    }
    const wrapper = await mountPage()
    const altNames = wrapper.find('.game-detail__alt-names')
    expect(altNames.exists()).toBe(true)
    const items = altNames.findAll('li')
    expect(items).toHaveLength(2)
    expect(items[0].text()).toBe('Settlers of Catan')
    expect(items[1].text()).toBe('Die Siedler von Catan')
  })

  it('should show family when available', async () => {
    mockGameData.value = {
      id: 'test-game-123',
      bggId: 123,
      name: 'Catan',
      type: 'base',
      family: 'Catan Series',
    }
    const wrapper = await mountPage()
    expect(wrapper.text()).toContain('Catan Series')
  })

  it('should not show alternative names section when empty', async () => {
    mockGameData.value = {
      id: 'test-game-123',
      bggId: 123,
      name: 'Catan',
      type: 'base',
    }
    const wrapper = await mountPage()
    expect(wrapper.find('.game-detail__alt-names').exists()).toBe(false)
  })

  it('should show return link on error', async () => {
    mockError.value = new Error('Error')
    const wrapper = await mountPage()
    const returnLink = wrapper.find('.game-detail__back-link')
    expect(returnLink.exists()).toBe(true)
    expect(returnLink.attributes('href')).toBe('/game')
  })
})
