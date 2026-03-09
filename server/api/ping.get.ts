import { defineEventHandler } from 'h3'
import { createApiClient, handleBackendError } from '~/server/utils/api-client'

interface BackendPingData {
  environment: string
  version: string
  datetime: { timestamp: string, datetime: string }
}

export default defineEventHandler(async (event) => {
  try {
    const api = createApiClient(event)
    const response = await api<{ code: number, data: BackendPingData }>('/ping')
    return {
      status: 'ok',
      environment: response.data.environment,
      version: response.data.version,
    }
  }
  catch (err) {
    handleBackendError(err)
  }
})
