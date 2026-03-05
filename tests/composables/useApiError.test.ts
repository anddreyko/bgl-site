import { describe, it, expect } from 'vitest'
import { useApiError } from '~/composables/useApiError'

describe('useApiError', () => {
  const { parseError } = useApiError()

  it('parses FetchError with statusCode and data.message', () => {
    const error = {
      statusCode: 422,
      data: { message: 'Email already taken' },
      message: 'fetch error',
    }

    const result = parseError(error)

    expect(result.statusCode).toBe(422)
    expect(result.message).toBe('Email already taken')
  })

  it('uses default message for known status code without data.message', () => {
    const error = { statusCode: 401, message: '' }

    const result = parseError(error)

    expect(result.statusCode).toBe(401)
    expect(result.message).toBe('Please sign in to continue.')
  })

  it('uses error.message as fallback when no data.message', () => {
    const error = { statusCode: 400, message: 'Bad request body' }

    const result = parseError(error)

    expect(result.statusCode).toBe(400)
    expect(result.message).toBe('Bad request body')
  })

  it('handles standard Error objects', () => {
    const result = parseError(new Error('Network failure'))

    expect(result.statusCode).toBe(500)
    expect(result.message).toBe('Network failure')
  })

  it('handles unknown error types', () => {
    const result = parseError('something broke')

    expect(result.statusCode).toBe(500)
    expect(result.message).toBe('An unexpected error occurred.')
  })

  it('handles null error', () => {
    const result = parseError(null)

    expect(result.statusCode).toBe(500)
    expect(result.message).toBe('An unexpected error occurred.')
  })

  it('defaults to 500 when FetchError has no statusCode', () => {
    const error = { statusCode: undefined, message: 'timeout' }

    const result = parseError(error)

    expect(result.statusCode).toBe(500)
  })
})
