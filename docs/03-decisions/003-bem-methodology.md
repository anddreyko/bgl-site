# ADR-003: BEM Methodology for CSS

**Status:** Accepted (target, not yet fully adopted)
**Date:** 2025-03

## Context

The project needs a consistent CSS naming convention that scales with the component library and is easy to understand for new contributors.

## Decision

Adopt **BEM (Block-Element-Modifier)** methodology as the target CSS architecture.

### Naming Convention

```
.block {}
.block__element {}
.block--modifier {}
.block__element--modifier {}
```

### Example

```vue
<template>
  <div class="game-card game-card--featured">
    <img class="game-card__image" />
    <h3 class="game-card__title">Catan</h3>
    <span class="game-card__score game-card__score--high">9.2</span>
  </div>
</template>
```

## Consequences

**Positive:**
- Flat CSS specificity, no nesting wars
- Component CSS is self-documenting
- Works with scoped styles and Storybook
- No runtime overhead (unlike CSS-in-JS)

**Negative:**
- Verbose class names
- Requires discipline to follow consistently
- Not enforced by tooling (manual review)

## CSS Processing

CSS is processed via **PostCSS** (built into Vite/Nuxt). PostCSS handles:
- Autoprefixing (vendor prefixes)
- Future CSS syntax (nesting, custom media queries)
- Minification in production

BEM provides the naming convention; PostCSS provides the build pipeline.

## Alternatives Considered

1. **CSS Modules** — rejected: adds build complexity, less readable in templates
2. **Scoped styles only** — rejected: doesn't provide naming convention
