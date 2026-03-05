# ADR-006: Vitest for Testing

**Status:** Accepted
**Date:** 2025-03

## Context

The project needs a test framework compatible with Vite and Vue 3 for component and unit testing.

## Decision

Use **Vitest 4** with **happy-dom** as DOM environment and **@vue/test-utils** for component testing.

### Stack

- **Vitest** — test runner (Vite-native, shared config with build)
- **happy-dom** — lightweight DOM implementation (faster than jsdom)
- **@vue/test-utils** — Vue component mounting and assertions
- **@nuxt/test-utils** — Nuxt-specific test helpers (auto-imports, composables)

### Test Location

Tests live in `tests/` directory:

```
tests/
  components/
    GameCard.test.ts
```

### Commands

- `pnpm test` — single run
- `pnpm test:watch` — watch mode for development

## Consequences

**Positive:**
- Native Vite integration (shared transforms, fast startup)
- happy-dom is significantly faster than jsdom
- @nuxt/test-utils provides proper Nuxt context for testing composables and auto-imports

**Negative:**
- happy-dom may have edge cases where behavior differs from real browsers
- E2E testing will need a separate tool (Playwright) in the future
