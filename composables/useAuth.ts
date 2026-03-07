import type { User, SignInPayload, SignUpPayload } from '~/types'

export function useAuth() {
  const user = useState<User | null>('auth:user', () => null)
  const isAuthenticated = computed(() => user.value !== null)

  async function fetchCurrentUser(): Promise<void> {
    try {
      const me = await $fetch<User>('/api/user/me')
      if (me?.id) {
        user.value = await $fetch<User>(`/api/user/${me.id}`)
      }
    }
    catch {
      user.value = null
    }
  }

  async function signIn(payload: SignInPayload): Promise<void> {
    await $fetch('/api/auth/sign-in', { method: 'POST', body: payload })
    await fetchCurrentUser()
  }

  async function signUp(payload: SignUpPayload): Promise<{ message?: string }> {
    const result = await $fetch<{ ok: boolean, message?: string }>('/api/auth/sign-up', { method: 'POST', body: payload })
    return result
  }

  async function signOut(): Promise<void> {
    await $fetch('/api/auth/sign-out', { method: 'POST' })
    user.value = null
    await navigateTo('/auth/sign-in')
  }

  return { user, isAuthenticated, fetchCurrentUser, signIn, signUp, signOut }
}
