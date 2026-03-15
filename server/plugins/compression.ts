import { createGzip } from 'node:zlib'
import { Readable } from 'node:stream'

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('beforeResponse', (event, response) => {
    const accept = getRequestHeader(event, 'accept-encoding') || ''
    if (!accept.includes('gzip')) return
    if (!response.body || typeof response.body !== 'string') return
    if (response.body.length < 1024) return

    const contentType = String(getResponseHeader(event, 'content-type') || '')
    if (!/text|javascript|json|css|svg|xml/.test(contentType)) return
    if (getResponseHeader(event, 'content-encoding')) return

    const gzipStream = createGzip()
    const input = Readable.from(Buffer.from(response.body))

    setResponseHeader(event, 'content-encoding', 'gzip')
    setResponseHeader(event, 'vary', 'Accept-Encoding')
    removeResponseHeader(event, 'content-length')

    response.body = input.pipe(gzipStream)
  })
})
