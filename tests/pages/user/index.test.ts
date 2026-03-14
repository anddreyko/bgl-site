import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, computed } from 'vue'
import EditProfilePage from '~/pages/profile.vue'

const mockSignOut = vi.fn()
const mockRegisterPasskey = vi.fn()
const mockFetch = vi.fn()

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

vi.stubGlobal('$fetch', mockFetch)

describe('EditProfilePage (me.vue)', () => {
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
    const wrapper = await mountSuspended(EditProfilePage)
    expect(wrapper.find('.edit-profile__title').text()).toBe('Edit Profile')
  })

  it('displays user name in input', async () => {
    const wrapper = await mountSuspended(EditProfilePage)
    const input = wrapper.find('#profile-name')
    expect((input.element as HTMLInputElement).value).toBe('Alice')
  })

  it('displays user email', async () => {
    const wrapper = await mountSuspended(EditProfilePage)
    expect(wrapper.text()).toContain('alice@example.com')
  })

  it('displays formatted member since date', async () => {
    const wrapper = await mountSuspended(EditProfilePage)
    expect(wrapper.text()).toContain('June 15, 2024')
  })

  it('calls signOut when Sign Out button is clicked', async () => {
    mockSignOut.mockResolvedValue(undefined)
    const wrapper = await mountSuspended(EditProfilePage)
    const buttons = wrapper.findAll('button')
    const signOutBtn = buttons.find(b => b.text() === 'Sign Out')
    expect(signOutBtn).toBeDefined()
    await signOutBtn!.trigger('click')
    expect(mockSignOut).toHaveBeenCalledOnce()
  })

  it('calls registerPasskey when Register Passkey button is clicked', async () => {
    mockRegisterPasskey.mockResolvedValue(undefined)
    const wrapper = await mountSuspended(EditProfilePage)
    const buttons = wrapper.findAll('button')
    const passkeyBtn = buttons.find(b => b.text() === 'Register Passkey')
    expect(passkeyBtn).toBeDefined()
    await passkeyBtn!.trigger('click')
    expect(mockRegisterPasskey).toHaveBeenCalledOnce()
  })

  it('shows error message when passkey registration fails', async () => {
    mockRegisterPasskey.mockRejectedValue(new Error('WebAuthn not supported'))
    const wrapper = await mountSuspended(EditProfilePage)
    const buttons = wrapper.findAll('button')
    const passkeyBtn = buttons.find(b => b.text() === 'Register Passkey')
    await passkeyBtn!.trigger('click')
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[role="alert"]').text()).toBe('WebAuthn not supported')
  })
})
