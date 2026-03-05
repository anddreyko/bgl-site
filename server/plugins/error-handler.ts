export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('error', (error, { event }) => {
    const url = event ? getRequestURL(event).pathname : 'unknown'
    const method = event ? getMethod(event) : 'unknown'
    const statusCode = (error as { statusCode?: number }).statusCode ?? 500

    if (statusCode >= 500) {
      console.error(`[server-error] ${method} ${url} ${statusCode}:`, error.message)
    }
    else if (statusCode !== 401 && statusCode !== 404) {
      console.warn(`[server-warn] ${method} ${url} ${statusCode}:`, error.message)
    }
  })
})
