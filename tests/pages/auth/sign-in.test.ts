import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, computed } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import SignIn from '~/pages/auth/sign-in.vue'

const mockSignIn = vi.fn()
const mockSignInWithPasskey = vi.fn()
const mockNavigateTo = vi.fn()

vi.mock('~/composables/useAuth', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
    user: ref(null),
    isAuthenticated: computed(() => false),
    fetchCurrentUser: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
  }),
}))

vi.mock('~/composables/usePasskey', () => ({
  usePasskey: () => ({
    signInWithPasskey: mockSignInWithPasskey,
    registerPasskey: vi.fn(),
  }),
}))

vi.mock('#imports', async (importOriginal) => {
  const original = await importOriginal<Record<string, unknown>>()
  return {
    ...original,
    navigateTo: mockNavigateTo,
  }
})

describe('sign-in page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders sign-in form with all fields', async () => {
    const wrapper = await mountSuspended(SignIn)

    expect(wrapper.find('h1').text()).toBe('Sign In')
    expect(wrapper.find('#sign-in-email').exists()).toBe(true)
    expect(wrapper.find('#sign-in-password').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('renders passkey button', async () => {
    const wrapper = await mountSuspended(SignIn)
    const buttons = wrapper.findAll('button')
    const passkeyBtn = buttons.find(b => b.text() === 'Sign in with Passkey')
    expect(passkeyBtn).toBeDefined()
  })

  it('renders link to sign-up page', async () => {
    const wrapper = await mountSuspended(SignIn)
    const link = wrapper.find('a[href="/auth/sign-up"]')
    expect(link.exists()).toBe(true)
    expect(link.text()).toBe('Sign Up')
  })

  it('shows validation errors on empty submit', async () => {
    const wrapper = await mountSuspended(SignIn)

    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Email is required')
    expect(wrapper.text()).toContain('Password is required')
    expect(mockSignIn).not.toHaveBeenCalled()
  })

  it('shows email validation error for invalid email', async () => {
    const wrapper = await mountSuspended(SignIn)

    const emailInput = wrapper.find('#sign-in-email')
    await emailInput.setValue('not-an-email')
    const passwordInput = wrapper.find('#sign-in-password')
    await passwordInput.setValue('12345678')

    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Please enter a valid email address')
    expect(mockSignIn).not.toHaveBeenCalled()
  })

  it('shows password validation error for short password', async () => {
    const wrapper = await mountSuspended(SignIn)

    const emailInput = wrapper.find('#sign-in-email')
    await emailInput.setValue('user@example.com')
    const passwordInput = wrapper.find('#sign-in-password')
    await passwordInput.setValue('short')

    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Password must be at least 8 characters')
    expect(mockSignIn).not.toHaveBeenCalled()
  })

  it('calls signIn with correct payload on valid submit', async () => {
    mockSignIn.mockResolvedValueOnce(undefined)
    const wrapper = await mountSuspended(SignIn)

    const emailInput = wrapper.find('#sign-in-email')
    await emailInput.setValue('user@example.com')
    const passwordInput = wrapper.find('#sign-in-password')
    await passwordInput.setValue('password123')

    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()

    expect(mockSignIn).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'password123',
    })
  })

  it('displays error message when signIn fails', async () => {
    mockSignIn.mockRejectedValueOnce(new Error('Invalid credentials'))
    const wrapper = await mountSuspended(SignIn)

    const emailInput = wrapper.find('#sign-in-email')
    await emailInput.setValue('user@example.com')
    const passwordInput = wrapper.find('#sign-in-password')
    await passwordInput.setValue('password123')

    await wrapper.find('form').trigger('submit')

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('Invalid credentials')
    })
  })

  it('calls signInWithPasskey when passkey button clicked', async () => {
    mockSignInWithPasskey.mockResolvedValueOnce(undefined)
    const wrapper = await mountSuspended(SignIn)

    const buttons = wrapper.findAll('button')
    const passkeyBtn = buttons.find(b => b.text() === 'Sign in with Passkey')
    await passkeyBtn!.trigger('click')

    expect(mockSignInWithPasskey).toHaveBeenCalled()
  })
})
