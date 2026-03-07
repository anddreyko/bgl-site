import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, computed, defineComponent, h } from 'vue'

// Mock useGames composable
const mockGames = ref<unknown[]>([])
const mockTotalPages = ref(0)
const mockCurrentPage = ref(1)
const mockPending = ref(false)
const mockError = ref<unknown>(null)
const mockSearchQuery = ref('')
const mockHasSearched = ref(false)
const mockGoToPage = vi.fn()
const mockRefresh = vi.fn()

vi.mock('~/composables/useGames', () => ({
  useGames: () => ({
    searchQuery: mockSearchQuery,
    hasSearched: mockHasSearched,
    games: computed(() => mockGames.value),
    totalPages: computed(() => mockTotalPages.value),
    currentPage: mockCurrentPage,
    pending: mockPending,
    error: mockError,
    goToPage: mockGoToPage,
    refresh: mockRefresh,
  }),
}))

// Stub Nuxt globals
vi.stubGlobal('useHead', () => {})
vi.stubGlobal('definePageMeta', () => {})

// Stub NuxtLink as a simple <a> tag
const NuxtLinkStub = defineComponent({
  name: 'NuxtLink',
  props: ['to'],
  setup(props, { slots }) {
    return () => h('a', { href: props.to }, slots.default?.())
  },
})

describe('pages/game/index.vue', () => {
  beforeEach(() => {
    mockGames.value = []
    mockTotalPages.value = 0
    mockCurrentPage.value = 1
    mockPending.value = false
    mockError.value = null
    mockSearchQuery.value = ''
    mockHasSearched.value = false
    mockGoToPage.mockClear()
    mockRefresh.mockClear()
  })

  async function mountPage() {
    const GameIndexPage = (await import('~/pages/game/index.vue')).default
    return mount(GameIndexPage, {
      global: {
        stubs: {
          NuxtLink: NuxtLinkStub,
        },
      },
    })
  }

  it('should render search input', async () => {
    const wrapper = await mountPage()
    const input = wrapper.find('#game-search')
    expect(input.exists()).toBe(true)
    expect(input.attributes('type')).toBe('search')
    expect(input.attributes('placeholder')).toBe('Search board games...')
  })

  it('should show hint when search query has less than 3 characters', async () => {
    mockSearchQuery.value = 'ab'
    const wrapper = await mountPage()
    const hint = wrapper.find('#search-hint')
    expect(hint.exists()).toBe(true)
    expect(hint.text()).toContain('at least 3 characters')
  })

  it('should not show hint when search query is empty', async () => {
    mockSearchQuery.value = ''
    const wrapper = await mountPage()
    const hint = wrapper.find('#search-hint')
    expect(hint.exists()).toBe(false)
  })

  it('should show loading state when pending', async () => {
    mockPending.value = true
    const wrapper = await mountPage()
    expect(wrapper.text()).toContain('Loading games...')
  })

  it('should show error state with retry button', async () => {
    mockError.value = new Error('Failed')
    const wrapper = await mountPage()
    expect(wrapper.text()).toContain('Failed to load games')
    const retryBtn = wrapper.find('.game-catalog__retry-btn')
    expect(retryBtn.exists()).toBe(true)
  })

  it('should show empty state when no games found', async () => {
    mockSearchQuery.value = 'xyz'
    mockHasSearched.value = true
    mockGames.value = []
    const wrapper = await mountPage()
    expect(wrapper.text()).toContain('No games found')
  })

  it('should render game cards in grid', async () => {
    mockGames.value = [
      { id: '1', bggId: 1, name: 'Catan', type: 'base' },
      { id: '2', bggId: 2, name: 'Azul', type: 'base' },
    ]
    const wrapper = await mountPage()
    const cards = wrapper.findAll('.game-card')
    expect(cards).toHaveLength(2)
  })

  it('should render game card links to correct URLs', async () => {
    mockGames.value = [
      { id: 'abc', bggId: 1, name: 'Catan', type: 'base' },
    ]
    const wrapper = await mountPage()
    const link = wrapper.find('.game-catalog__grid-item')
    expect(link.attributes('href')).toBe('/game/abc')
  })

  it('should show pagination when totalPages > 1', async () => {
    mockTotalPages.value = 3
    mockCurrentPage.value = 2
    mockGames.value = [{ id: '1', bggId: 1, name: 'Game', type: 'base' }]
    const wrapper = await mountPage()
    const pagination = wrapper.find('.game-catalog__pagination')
    expect(pagination.exists()).toBe(true)
    expect(pagination.text()).toContain('Page 2 of 3')
  })

  it('should not show pagination when totalPages <= 1', async () => {
    mockTotalPages.value = 1
    mockGames.value = [{ id: '1', bggId: 1, name: 'Game', type: 'base' }]
    const wrapper = await mountPage()
    const pagination = wrapper.find('.game-catalog__pagination')
    expect(pagination.exists()).toBe(false)
  })

  it('should disable previous button on first page', async () => {
    mockTotalPages.value = 3
    mockCurrentPage.value = 1
    mockGames.value = [{ id: '1', bggId: 1, name: 'Game', type: 'base' }]
    const wrapper = await mountPage()
    const buttons = wrapper.findAll('.game-catalog__page-btn')
    const prevBtn = buttons[0]
    expect(prevBtn.attributes('disabled')).toBeDefined()
  })

  it('should disable next button on last page', async () => {
    mockTotalPages.value = 3
    mockCurrentPage.value = 3
    mockGames.value = [{ id: '1', bggId: 1, name: 'Game', type: 'base' }]
    const wrapper = await mountPage()
    const buttons = wrapper.findAll('.game-catalog__page-btn')
    const nextBtn = buttons[1]
    expect(nextBtn.attributes('disabled')).toBeDefined()
  })

  it('should call goToPage on pagination button click', async () => {
    mockTotalPages.value = 3
    mockCurrentPage.value = 2
    mockGames.value = [{ id: '1', bggId: 1, name: 'Game', type: 'base' }]
    const wrapper = await mountPage()
    const buttons = wrapper.findAll('.game-catalog__page-btn')
    await buttons[1].trigger('click')
    expect(mockGoToPage).toHaveBeenCalledWith(3)
  })

  it('should have accessible labels', async () => {
    const wrapper = await mountPage()
    const label = wrapper.find('label[for="game-search"]')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Search games')
  })
})
