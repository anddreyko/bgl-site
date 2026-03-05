export function usePasskey() {
  async function registerPasskey(label?: string): Promise<void> {
    if (!import.meta.client) return
    const { startRegistration } = await import('@simplewebauthn/browser')
    const { options } = await $fetch<{ options: Record<string, unknown> }>('/api/auth/passkey/register', { method: 'POST' })
    const response = await startRegistration({ optionsJSON: options as unknown as Parameters<typeof startRegistration>[0]['optionsJSON'] })
    await $fetch('/api/auth/passkey/register-verify', {
      method: 'POST',
      body: { response: JSON.stringify(response), label },
    })
  }

  async function signInWithPasskey(): Promise<void> {
    if (!import.meta.client) return
    const { startAuthentication } = await import('@simplewebauthn/browser')
    const { options } = await $fetch<{ options: Record<string, unknown> }>('/api/auth/passkey/sign-in', { method: 'POST' })
    const response = await startAuthentication({ optionsJSON: options as unknown as Parameters<typeof startAuthentication>[0]['optionsJSON'] })
    await $fetch('/api/auth/passkey/sign-in-verify', {
      method: 'POST',
      body: { response: JSON.stringify(response) },
    })
    const { fetchCurrentUser } = useAuth()
    await fetchCurrentUser()
  }

  return { registerPasskey, signInWithPasskey }
}
