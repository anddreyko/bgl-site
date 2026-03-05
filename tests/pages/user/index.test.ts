import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, computed } from 'vue'
import UserProfilePage from '~/pages/user/index.vue'

const mockSignOut = vi.fn()
const mockRegisterPasskey = vi.fn()

const mockUserRef = ref<Record<string, unknown> | null>({
  id: '1',
  email: 'alice@example.com',
  name: 'Alice',
  isActive: true,
  createdAt: '2024-06-15T00:00:00Z',
  bggUsername: 'alice_bgg',
})

vi.mock('~/composables/useAuth', () => ({
  useAuth: () => ({
    user: mockUserRef,
    isAuthenticated: computed(() => mockUserRef.value !== null),
    signOut: mockSignOut,
    fetchCurrentUser: vi.fn(),
    signIn: vi.fn(),
    signUp: vi.fn(),
  }),
}))

vi.mock('~/composables/usePasskey', () => ({
  usePasskey: () => ({
    registerPasskey: mockRegisterPasskey,
    signInWithPasskey: vi.fn(),
  }),
}))

describe('UserProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUserRef.value = {
      id: '1',
      email: 'alice@example.com',
      name: 'Alice',
      isActive: true,
      createdAt: '2024-06-15T00:00:00Z',
      bggUsername: 'alice_bgg',
    }
  })

  it('renders page heading', async () => {
    const wrapper = await mountSuspended(UserProfilePage)
    expect(wrapper.find('.user-profile__heading').text()).toBe('My Profile')
  })

  it('displays user name', async () => {
    const wrapper = await mountSuspended(UserProfilePage)
    expect(wrapper.text()).toContain('Alice')
  })

  it('displays user email', async () => {
    const wrapper = await mountSuspended(UserProfilePage)
    expect(wrapper.text()).toContain('alice@example.com')
  })

  it('displays formatted member since date', async () => {
    const wrapper = await mountSuspended(UserProfilePage)
    expect(wrapper.text()).toContain('June 15, 2024')
  })

  it('displays BGG username when set', async () => {
    const wrapper = await mountSuspended(UserProfilePage)
    expect(wrapper.text()).toContain('alice_bgg')
    expect(wrapper.text()).toContain('BGG Username')
  })

  it('hides BGG username when not set', async () => {
    mockUserRef.value = {
      id: '1',
      email: 'alice@example.com',
      name: 'Alice',
      isActive: true,
      createdAt: '2024-06-15T00:00:00Z',
    }
    const wrapper = await mountSuspended(UserProfilePage)
    expect(wrapper.text()).not.toContain('BGG Username')
  })

  it('shows Active badge for active user', async () => {
    const wrapper = await mountSuspended(UserProfilePage)
    expect(wrapper.find('.ui-badge--success').exists()).toBe(true)
    expect(wrapper.find('.ui-badge--success').text()).toBe('Active')
  })

  it('shows Inactive badge for inactive user', async () => {
    mockUserRef.value = {
      id: '1',
      email: 'alice@example.com',
      name: 'Alice',
      isActive: false,
      createdAt: '2024-06-15T00:00:00Z',
    }
    const wrapper = await mountSuspended(UserProfilePage)
    expect(wrapper.find('.ui-badge--warning').exists()).toBe(true)
    expect(wrapper.find('.ui-badge--warning').text()).toBe('Inactive')
  })

  it('calls signOut when Sign Out button is clicked', async () => {
    mockSignOut.mockResolvedValue(undefined)
    const wrapper = await mountSuspended(UserProfilePage)
    const buttons = wrapper.findAll('button')
    const signOutBtn = buttons.find(b => b.text() === 'Sign Out')
    expect(signOutBtn).toBeDefined()
    await signOutBtn!.trigger('click')
    expect(mockSignOut).toHaveBeenCalledOnce()
  })

  it('calls registerPasskey when Register Passkey button is clicked', async () => {
    mockRegisterPasskey.mockResolvedValue(undefined)
    const wrapper = await mountSuspended(UserProfilePage)
    const buttons = wrapper.findAll('button')
    const passkeyBtn = buttons.find(b => b.text() === 'Register Passkey')
    expect(passkeyBtn).toBeDefined()
    await passkeyBtn!.trigger('click')
    expect(mockRegisterPasskey).toHaveBeenCalledOnce()
  })

  it('shows error message when passkey registration fails', async () => {
    mockRegisterPasskey.mockRejectedValue(new Error('WebAuthn not supported'))
    const wrapper = await mountSuspended(UserProfilePage)
    const buttons = wrapper.findAll('button')
    const passkeyBtn = buttons.find(b => b.text() === 'Register Passkey')
    await passkeyBtn!.trigger('click')
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[role="alert"]').text()).toBe('WebAuthn not supported')
  })
})
