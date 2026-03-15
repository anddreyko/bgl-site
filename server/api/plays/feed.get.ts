import { defineEventHandler, getQuery } from 'h3'
import type { ApiResponse, PaginatedResponse, Play } from '~/types'
import { unwrap, handleBackendError } from '~/server/utils/api-client'
import { snakeToCamel } from '~/server/utils/case-convert'

export default defineEventHandler(async (event) => {
  const { apiHost } = useRuntimeConfig(event)
  const raw = getQuery(event)

  const query: Record<string, unknown> = {}
  if (raw.page) query.page = Number(raw.page)
  if (raw.size) query.size = Number(raw.size)

  try {
    const response = await $fetch<ApiResponse<PaginatedResponse<Play>>>('/v1/plays', {
      baseURL: apiHost,
      query,
      onResponse({ response: res }) {
        if (res._data && typeof res._data === 'object') {
          res._data = snakeToCamel(res._data)
        }
      },
    })
    return unwrap(response)
  }
  catch (err) {
    handleBackendError(err)
  }
})
