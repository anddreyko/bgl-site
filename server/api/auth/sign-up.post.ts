import { H3Error } from 'h3'
import type { ApiResponse, SignUpPayload } from '~/types'
import { createApiClient, unwrap } from '~/server/utils/api-client'

export default defineEventHandler(async (event) => {
  const body = await readBody<SignUpPayload>(event)
  const api = createApiClient(event)

  try {
    const response = await api<ApiResponse<string>>('/v1/auth/sign-up', {
      method: 'POST',
      body,
    })
    const message = unwrap(response)
    return { ok: true, message }
  }
  catch (err) {
    if (err instanceof H3Error) throw err
    throw createError({ statusCode: 502, message: 'Backend unavailable' })
  }
})
