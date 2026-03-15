import { gzipSync } from 'node:zlib'

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('beforeResponse', (event, response) => {
    const accept = getRequestHeader(event, 'accept-encoding') || ''
    if (!accept.includes('gzip')) return
    if (!response.body || typeof response.body !== 'string') return
    if (response.body.length < 1024) return

    const contentType = String(getResponseHeader(event, 'content-type') || '')
    if (!/text|javascript|json|css|svg|xml/.test(contentType)) return
    if (getResponseHeader(event, 'content-encoding')) return

    const compressed = gzipSync(Buffer.from(response.body))

    setResponseHeader(event, 'content-encoding', 'gzip')
    setResponseHeader(event, 'vary', 'Accept-Encoding')
    setResponseHeader(event, 'content-length', compressed.length.toString())

    response.body = compressed
  })
})
