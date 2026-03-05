import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, computed } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import SignUp from '~/pages/auth/sign-up.vue'

const mockSignUp = vi.fn()

vi.mock('~/composables/useAuth', () => ({
  useAuth: () => ({
    signUp: mockSignUp,
    user: ref(null),
    isAuthenticated: computed(() => false),
    fetchCurrentUser: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
  }),
}))

vi.mock('#imports', async (importOriginal) => {
  const original = await importOriginal<Record<string, unknown>>()
  return {
    ...original,
    navigateTo: vi.fn(),
  }
})

describe('sign-up page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders sign-up form with all fields', async () => {
    const wrapper = await mountSuspended(SignUp)

    expect(wrapper.find('h1').text()).toBe('Sign Up')
    expect(wrapper.find('#sign-up-name').exists()).toBe(true)
    expect(wrapper.find('#sign-up-email').exists()).toBe(true)
    expect(wrapper.find('#sign-up-password').exists()).toBe(true)
    expect(wrapper.find('#sign-up-confirm-password').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('renders link to sign-in page', async () => {
    const wrapper = await mountSuspended(SignUp)
    const link = wrapper.find('a[href="/auth/sign-in"]')
    expect(link.exists()).toBe(true)
    expect(link.text()).toBe('Sign In')
  })

  it('shows validation errors on empty submit', async () => {
    const wrapper = await mountSuspended(SignUp)

    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Email is required')
    expect(wrapper.text()).toContain('Password is required')
    expect(mockSignUp).not.toHaveBeenCalled()
  })

  it('shows error when passwords do not match', async () => {
    const wrapper = await mountSuspended(SignUp)

    await wrapper.find('#sign-up-email').setValue('user@example.com')
    await wrapper.find('#sign-up-password').setValue('password123')
    await wrapper.find('#sign-up-confirm-password').setValue('different')

    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Passwords do not match')
    expect(mockSignUp).not.toHaveBeenCalled()
  })

  it('shows error when confirm password is empty', async () => {
    const wrapper = await mountSuspended(SignUp)

    await wrapper.find('#sign-up-email').setValue('user@example.com')
    await wrapper.find('#sign-up-password').setValue('password123')

    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Please confirm your password')
    expect(mockSignUp).not.toHaveBeenCalled()
  })

  it('calls signUp with correct payload on valid submit', async () => {
    mockSignUp.mockResolvedValueOnce({ message: 'Check your email' })
    const wrapper = await mountSuspended(SignUp)

    await wrapper.find('#sign-up-name').setValue('John')
    await wrapper.find('#sign-up-email').setValue('user@example.com')
    await wrapper.find('#sign-up-password').setValue('password123')
    await wrapper.find('#sign-up-confirm-password').setValue('password123')

    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()

    expect(mockSignUp).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'password123',
      name: 'John',
    })
  })

  it('calls signUp without name when name is empty', async () => {
    mockSignUp.mockResolvedValueOnce({ message: 'Check your email' })
    const wrapper = await mountSuspended(SignUp)

    await wrapper.find('#sign-up-email').setValue('user@example.com')
    await wrapper.find('#sign-up-password').setValue('password123')
    await wrapper.find('#sign-up-confirm-password').setValue('password123')

    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()

    expect(mockSignUp).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'password123',
      name: undefined,
    })
  })

  it('shows success message after successful sign-up', async () => {
    mockSignUp.mockResolvedValueOnce({ message: 'Check your email to confirm registration' })
    const wrapper = await mountSuspended(SignUp)

    await wrapper.find('#sign-up-email').setValue('user@example.com')
    await wrapper.find('#sign-up-password').setValue('password123')
    await wrapper.find('#sign-up-confirm-password').setValue('password123')

    await wrapper.find('form').trigger('submit')

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('Check your email to confirm registration')
    })
  })

  it('displays error message when signUp fails', async () => {
    mockSignUp.mockRejectedValueOnce(new Error('Email already registered'))
    const wrapper = await mountSuspended(SignUp)

    await wrapper.find('#sign-up-email').setValue('user@example.com')
    await wrapper.find('#sign-up-password').setValue('password123')
    await wrapper.find('#sign-up-confirm-password').setValue('password123')

    await wrapper.find('form').trigger('submit')

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('Email already registered')
    })
  })
})
