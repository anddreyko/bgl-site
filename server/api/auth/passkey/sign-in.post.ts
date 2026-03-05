import { H3Error } from 'h3'

export default defineEventHandler(async () => {
  try {
    const { apiHost } = useRuntimeConfig()
    const response = await $fetch<{ options: Record<string, unknown> }>('/v1/auth/passkey/sign-in', {
      baseURL: apiHost,
      method: 'POST',
    })
    return response
  }
  catch (err) {
    if (err instanceof H3Error) throw err
    throw createError({ statusCode: 502, message: 'Backend unavailable' })
  }
})
