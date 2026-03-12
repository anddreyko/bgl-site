# ADR-009: SSR Data Fetching Without Blocking and Without Flicker

**Status:** Accepted
**Date:** 2026-03

## Context

Nuxt SSR data fetching has two common pitfalls:

1. **Missing cookies on SSR** — `$fetch('/api/...')` on the server does not forward browser cookies to Nitro handlers. The backend rejects the request (no auth). Client-side navigation works fine because the browser attaches cookies automatically.
2. **Flicker on navigation** — `useAsyncData` with `lazy: true` avoids blocking SSR but re-fetches data on every client navigation, showing a skeleton (visual flicker). Without `lazy: true`, SSR blocks until data loads, which is correct — but requires proper cookie forwarding.

## Decision

Use `useRequestFetch()` + `useAsyncData` without `lazy` for all page-level data fetching.

### Pattern

```ts
const requestFetch = useRequestFetch()

const { data, pending, refresh } = useAsyncData(
  'unique-key',
  () => requestFetch<T>('/api/endpoint', { query: { ... } }),
  { default: () => null },
)
```

### Rules

1. **`useRequestFetch()`** instead of `$fetch` — forwards cookies and headers from the browser request during SSR
2. **No `lazy: true`**, no `server: false` — data loads on the server, lands in the SSR payload, arrives with the HTML
3. **`default: () => null`** — safe initial value before data resolves, prevents template errors
4. **Unique string key** per data source — Nuxt caches by key, so client navigation reuses the payload without re-fetching
5. **CSS in SSR response** — styles are included in the server-rendered HTML, no FOUC (Flash of Unstyled Content)

### Behavior by scenario

**Direct link (SSR):**
- Server runs `useAsyncData`, fetches data with forwarded cookies
- HTML arrives with data already rendered, styles applied
- No skeleton, no flicker, no blank page

**Client navigation (SPA):**
- Nuxt checks the payload cache by key
- If cached — instant render, no request, no flicker
- If not cached (new key) — fetches client-side, `pending` is true, show skeleton

**Refresh / hard reload:**
- Same as direct link — full SSR cycle

## Consequences

**Positive:**
- Zero flicker on both SSR and client navigation
- Cookies forwarded correctly — auth works on first load
- Data cached in Nuxt payload — no redundant requests
- Styles applied instantly — no FOUC

**Negative:**
- SSR waits for data before sending HTML (time-to-first-byte increases)
- Must remember to use `useRequestFetch()` everywhere, not `$fetch`
- Key collisions cause stale data — keys must be unique and descriptive

## Alternatives Considered

1. **`lazy: true` everywhere** — rejected: causes flicker on every navigation, skeleton appears even when data is already available
2. **`server: false` + client fetch** — rejected: no SSR benefit, blank page on direct link
3. **`$fetch` without `useRequestFetch`** — rejected: cookies not forwarded during SSR, auth fails on first load
4. **`useFetch` shorthand** — acceptable for simple cases, but `useAsyncData` + `useRequestFetch` gives explicit control over the fetch function and key
