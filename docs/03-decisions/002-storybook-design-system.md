# ADR-002: Storybook 10 for Design System

**Status:** Accepted
**Date:** 2025-03

## Context

The project needs isolated component development and visual documentation. Components should be testable and reviewable outside the application context.

## Decision

Use **Storybook 10** with **vue3-vite** framework for component development and design system documentation.

Each reusable component gets a co-located story file:

```
components/
  GameCard/
    index.vue           # Component
    index.stories.js    # Story
```

## Configuration

- `.storybook/main.js` uses ESM syntax
- Explicit `@vitejs/plugin-vue` in `viteFinal` (required for Nuxt component compatibility)
- `shamefully-hoist=true` in `.npmrc` (resolves peer dependency issues)

## Consequences

**Positive:**
- Components developed in isolation, faster iteration
- Visual regression testing possible
- Documentation generated from stories
- Design review without running full app

**Negative:**
- Additional dependency and build step
- Stories require maintenance as components evolve
- Some Nuxt-specific features (auto-imports, composables) need mocking in Storybook context
