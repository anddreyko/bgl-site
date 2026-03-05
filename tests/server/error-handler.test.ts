import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.stubGlobal('getRequestURL', (event: unknown) => new URL(`http://localhost${(event as { path: string }).path}`))
vi.stubGlobal('getMethod', (event: unknown) => (event as { method: string }).method)

describe('error-handler plugin', () => {
  let errorHook: (error: Error & { statusCode?: number }, ctx: { event?: unknown }) => void

  beforeEach(async () => {
    vi.stubGlobal('defineNitroPlugin', (cb: (nitro: { hooks: { hook: typeof vi.fn } }) => void) => {
      const hooks = { hook: vi.fn() }
      cb({ hooks })
      errorHook = hooks.hook.mock.calls[0][1]
    })

    await import('~/server/plugins/error-handler')
  })

  it('logs 500 errors with console.error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const error = Object.assign(new Error('DB connection failed'), { statusCode: 500 })

    errorHook(error, { event: { path: '/api/plays', method: 'GET' } })

    expect(spy).toHaveBeenCalledWith(
      '[server-error] GET /api/plays 500:',
      'DB connection failed',
    )
    spy.mockRestore()
  })

  it('logs 4xx warnings (not 401/404) with console.warn', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const error = Object.assign(new Error('Bad request'), { statusCode: 400 })

    errorHook(error, { event: { path: '/api/mates', method: 'POST' } })

    expect(spy).toHaveBeenCalledWith(
      '[server-warn] POST /api/mates 400:',
      'Bad request',
    )
    spy.mockRestore()
  })

  it('does not log 401 errors', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const error = Object.assign(new Error('Unauthorized'), { statusCode: 401 })

    errorHook(error, { event: { path: '/api/plays', method: 'GET' } })

    expect(errorSpy).not.toHaveBeenCalled()
    expect(warnSpy).not.toHaveBeenCalled()
    errorSpy.mockRestore()
    warnSpy.mockRestore()
  })

  it('does not log 404 errors', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const error = Object.assign(new Error('Not found'), { statusCode: 404 })

    errorHook(error, { event: { path: '/api/plays/xyz', method: 'GET' } })

    expect(errorSpy).not.toHaveBeenCalled()
    expect(warnSpy).not.toHaveBeenCalled()
    errorSpy.mockRestore()
    warnSpy.mockRestore()
  })
})
