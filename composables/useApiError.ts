import type { FetchError } from 'ofetch'

interface ApiErrorInfo {
  message: string
  statusCode: number
}

const DEFAULT_MESSAGES: Record<number, string> = {
  400: 'Invalid request. Please check your input.',
  401: 'Please sign in to continue.',
  403: 'You do not have permission for this action.',
  404: 'The requested resource was not found.',
  409: 'This action conflicts with existing data.',
  422: 'The provided data is invalid.',
  429: 'Too many requests. Please try again later.',
  500: 'A server error occurred. Please try again.',
  502: 'The service is temporarily unavailable.',
  503: 'The service is temporarily unavailable.',
}

export function useApiError() {
  function parseError(error: unknown): ApiErrorInfo {
    if (isFetchError(error)) {
      const statusCode = error.statusCode ?? 500
      const message = extractMessage(error) ?? DEFAULT_MESSAGES[statusCode] ?? 'An unexpected error occurred.'
      return { message, statusCode }
    }

    if (error instanceof Error) {
      return { message: error.message, statusCode: 500 }
    }

    return { message: 'An unexpected error occurred.', statusCode: 500 }
  }

  return { parseError }
}

function isFetchError(error: unknown): error is FetchError {
  return error !== null && typeof error === 'object' && 'statusCode' in error
}

function extractMessage(error: FetchError): string | undefined {
  const data = error.data
  if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
    return data.message
  }
  return error.message || undefined
}
