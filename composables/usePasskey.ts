// Backend returns binary fields in MIME RFC 2047 format: =?BINARY?B?<base64>?=
// Convert to base64url as expected by @simplewebauthn
function decodeMimeBinary(value: string): string {
  const match = value.match(/^=\?BINARY\?B\?(.+?)\?=$/)
  if (!match) return value
  return match[1].replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function normalizeOptions(obj: unknown): unknown {
  if (typeof obj === 'string') return decodeMimeBinary(obj)
  if (Array.isArray(obj)) return obj.map(normalizeOptions)
  if (obj && typeof obj === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(obj)) {
      result[key] = normalizeOptions(val)
    }
    return result
  }
  return obj
}

function parseOptions(raw: unknown): Record<string, unknown> {
  const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
  // Backend may wrap options in { publicKey: ... }, but @simplewebauthn v13 expects top-level fields
  const unwrapped = parsed.publicKey ?? parsed
  return normalizeOptions(unwrapped) as Record<string, unknown>
}

export function usePasskey() {
  async function registerPasskey(label?: string): Promise<void> {
    if (!import.meta.client) return
    const { startRegistration } = await import('@simplewebauthn/browser')
    // Use native fetch before startRegistration — Safari requires user gesture context,
    // and ofetch/$fetch wrappers break user activation detection
    const raw = await fetch('/api/auth/passkey/register', { method: 'POST' })
    if (!raw.ok) throw new Error('Failed to get passkey options')
    const { options } = await raw.json() as { options: unknown }
    const response = await startRegistration({ optionsJSON: parseOptions(options) })
    await $fetch('/api/auth/passkey/register-verify', {
      method: 'POST',
      body: { response: JSON.stringify(response), label },
    })
  }

  async function signInWithPasskey(): Promise<void> {
    if (!import.meta.client) return
    const { startAuthentication } = await import('@simplewebauthn/browser')
    // Use native fetch before startAuthentication — Safari user gesture requirement
    const raw = await fetch('/api/auth/passkey/sign-in', { method: 'POST' })
    if (!raw.ok) throw new Error('Failed to get passkey options')
    const { options } = await raw.json() as { options: unknown }
    const response = await startAuthentication({ optionsJSON: parseOptions(options) })
    await $fetch('/api/auth/passkey/sign-in-verify', {
      method: 'POST',
      body: { response: JSON.stringify(response) },
    })
    const { fetchCurrentUser } = useAuth()
    await fetchCurrentUser()
  }

  return { registerPasskey, signInWithPasskey }
}
