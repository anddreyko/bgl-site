# ADR-008: Component Reuse Without Duplication

**Status:** Accepted
**Date:** 2026-03

## Context

As the component library grows, duplication creeps in: similar markup across pages, copy-pasted composable calls, repeated styling patterns. This leads to inconsistency and maintenance burden.

## Decision

Enforce a strict **single source of truth** principle for components and logic.

### Rules

1. **One component, one purpose** — if the same UI block appears on multiple pages, extract it into a shared component. Never copy markup between pages.
2. **Two-tier component system**:
   - `Ui*` primitives (`UiButton`, `UiCard`, `UiDialog`, etc.) — pure, stateless, no app logic, styled with BEM + CSS tokens
   - Domain components (`PlayCard`, `MateForm`, `RecordDialog`, etc.) — compose `Ui*` primitives, call composables, aware of app state
3. **One composable per domain** — `usePlays()`, `useMates()`, `useGames()`. Pages call composables, never duplicate fetch/mutation logic inline.
4. **Props down, events up** — domain components receive data via props and emit events. Parent pages orchestrate state and side effects.

### Anti-patterns (forbidden)

- Copying a component and tweaking it for a "slightly different" use case — use props/slots instead
- Inline `$fetch` calls in page templates — extract into composable
- Duplicating CSS between components — extract shared styles into tokens or a shared `Ui*` component

## Consequences

**Positive:**
- Single place to fix bugs and update behavior
- Consistent UI across all pages
- Smaller bundle — shared components are deduplicated by Vite

**Negative:**
- Requires upfront design of component API (props, slots, events)
- Shared components can accumulate props over time — need periodic review

## Alternatives Considered

1. **Copy-paste with local tweaks** — rejected: leads to drift and inconsistency
2. **Render functions / JSX** — rejected: less readable than SFC templates for this project's complexity
