import { FetchError } from 'ofetch'

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof FetchError) {
    const dataMessage = (error.data as Record<string, unknown> | undefined)?.message
    if (typeof dataMessage === 'string' && dataMessage) {
      return dataMessage
    }
  }

  if (error instanceof Error) {
    const data = (error as Error & { data?: Record<string, unknown> }).data
    if (typeof data?.message === 'string' && data.message) {
      return data.message
    }

    if (error.message && !error.message.includes('Server Error')) {
      return error.message
    }
  }

  return fallback
}
