export default defineEventHandler((event) => {
  const { token } = getQuery(event)

  if (!token || typeof token !== 'string') {
    return sendRedirect(event, '/auth/confirm', 302)
  }

  return sendRedirect(event, `/auth/confirm/${encodeURIComponent(token)}`, 302)
})
