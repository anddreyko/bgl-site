import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import MatesPage from '~/pages/mates/index.vue'

const mockFetchMates = vi.fn()
const mockCreateMate = vi.fn()
const mockUpdateMate = vi.fn()
const mockDeleteMate = vi.fn()

const mockMates = ref([
  { id: '1', name: 'Alice', notes: 'Notes', createdAt: '2024-01-01' },
  { id: '2', name: 'Bob', createdAt: '2024-01-02' },
])
const mockTotal = ref(2)
const mockTotalPages = computed(() => 1)
const mockCurrentPage = ref(1)
const mockPageSize = ref(20)
const mockSortBy = ref('name')
const mockSortOrder = ref('asc')
const mockLoading = ref(false)
const mockError = ref(null)

vi.mock('~/composables/useMates', () => ({
  useMates: () => ({
    mates: mockMates,
    total: mockTotal,
    totalPages: mockTotalPages,
    currentPage: mockCurrentPage,
    pageSize: mockPageSize,
    sortBy: mockSortBy,
    sortOrder: mockSortOrder,
    loading: mockLoading,
    error: mockError,
    fetchMates: mockFetchMates,
    createMate: mockCreateMate,
    updateMate: mockUpdateMate,
    deleteMate: mockDeleteMate,
  }),
}))

describe('Mates Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockMates.value = [
      { id: '1', name: 'Alice', notes: 'Notes', createdAt: '2024-01-01' },
      { id: '2', name: 'Bob', createdAt: '2024-01-02' },
    ]
    mockTotal.value = 2
    mockLoading.value = false
    mockError.value = null
  })

  it('renders page title', async () => {
    const wrapper = await mountSuspended(MatesPage)
    expect(wrapper.find('.mates-page__title').text()).toBe('My Mates')
  })

  it('renders mate cards', async () => {
    const wrapper = await mountSuspended(MatesPage)
    const cards = wrapper.findAll('.mate-card')
    expect(cards).toHaveLength(2)
  })

  it('shows loading spinner', async () => {
    mockLoading.value = true
    mockMates.value = []
    const wrapper = await mountSuspended(MatesPage)
    expect(wrapper.find('.mates-page__loading').exists()).toBe(true)
  })

  it('shows error state', async () => {
    mockError.value = 'Failed to load mates' as unknown as string
    mockMates.value = []
    const wrapper = await mountSuspended(MatesPage)
    expect(wrapper.find('.mates-page__error').exists()).toBe(true)
    expect(wrapper.text()).toContain('Failed to load mates')
  })

  it('shows empty state', async () => {
    mockMates.value = []
    const wrapper = await mountSuspended(MatesPage)
    expect(wrapper.find('.mates-page__empty').exists()).toBe(true)
  })

  it('calls fetchMates on mount', async () => {
    await mountSuspended(MatesPage)
    expect(mockFetchMates).toHaveBeenCalled()
  })

  it('has Add Mate button', async () => {
    const wrapper = await mountSuspended(MatesPage)
    const addBtn = wrapper.findAll('button').find(b => b.text() === 'Add Mate')
    expect(addBtn).toBeDefined()
  })
})
