export function usePasskey() {
  async function registerPasskey(label?: string): Promise<void> {
    if (!import.meta.client) return
    const { startRegistration } = await import('@simplewebauthn/browser')
    const { options } = await $fetch<{ options: string }>('/api/auth/passkey/register', { method: 'POST' })
    const optionsJSON = JSON.parse(options)
    const response = await startRegistration({ optionsJSON })
    await $fetch('/api/auth/passkey/register-verify', {
      method: 'POST',
      body: { response: JSON.stringify(response), label },
    })
  }

  async function signInWithPasskey(): Promise<void> {
    if (!import.meta.client) return
    const { startAuthentication } = await import('@simplewebauthn/browser')
    const { options } = await $fetch<{ options: string }>('/api/auth/passkey/sign-in', { method: 'POST' })
    const optionsJSON = JSON.parse(options)
    const response = await startAuthentication({ optionsJSON })
    await $fetch('/api/auth/passkey/sign-in-verify', {
      method: 'POST',
      body: { response: JSON.stringify(response) },
    })
    const { fetchCurrentUser } = useAuth()
    await fetchCurrentUser()
  }

  return { registerPasskey, signInWithPasskey }
}
