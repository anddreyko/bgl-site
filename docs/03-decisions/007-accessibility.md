# ADR-007: Accessible UI (WCAG 2.1 AA)

**Status:** Accepted
**Date:** 2025-03

## Context

The platform must be usable by all people, including those with disabilities. Web accessibility is both an ethical requirement and a legal consideration in many jurisdictions.

## Decision

Target **WCAG 2.1 Level AA** conformance across all UI. Follow the four WCAG principles (POUR):

### 1. Perceivable

- All non-text content has text alternatives (`alt`, `aria-label`)
- Color is never the only means of conveying information (use icons, text alongside color)
- Minimum contrast ratio 4.5:1 for normal text, 3:1 for large text
- Content is responsive and readable at 200% zoom

### 2. Operable

- All interactive elements are keyboard accessible (Tab, Enter, Space, Escape, Arrow keys)
- Visible focus indicators on all focusable elements
- No keyboard traps
- Skip navigation links for repetitive content
- Touch targets minimum 44x44 CSS pixels

### 3. Understandable

- Page language declared (`<html lang="en">`)
- Consistent navigation across pages
- Form inputs have visible labels (not placeholder-only)
- Error messages are descriptive and associated with inputs (`aria-describedby`)
- Instructions don't rely solely on sensory characteristics ("click the red button")

### 4. Robust

- Valid semantic HTML (`<nav>`, `<main>`, `<article>`, `<button>`, `<header>`, `<footer>`)
- ARIA attributes only when native HTML semantics are insufficient
- Works with screen readers (VoiceOver, NVDA)
- No ARIA misuse — first rule of ARIA: don't use ARIA if native HTML works

## Implementation Guidelines

### Semantic HTML First

```vue
<!-- Good -->
<button @click="submit">Save session</button>
<nav aria-label="Main navigation">...</nav>

<!-- Bad -->
<div @click="submit">Save session</div>
<div class="nav">...</div>
```

### Forms

```vue
<label for="game-search">Search games</label>
<input id="game-search" type="search" aria-describedby="game-search-hint" />
<span id="game-search-hint">Type at least 3 characters to search BGG catalog</span>
```

### Images

```vue
<!-- Informative image -->
<img :src="game.thumbnail" :alt="game.name + ' box cover'" />

<!-- Decorative image -->
<img src="/decorative-bg.svg" alt="" role="presentation" />
```

### Dynamic Content

- Use `aria-live="polite"` for non-critical updates (search results loaded)
- Use `aria-live="assertive"` for errors and critical messages
- Manage focus when content changes (modal open/close, route navigation)

## Testing

- **Manual:** keyboard-only navigation, screen reader testing (VoiceOver on macOS)
- **Automated:** axe-core (via browser extension or Vitest integration)
- **CI:** lighthouse accessibility audit (target score 90+)

## Consequences

**Positive:**
- Usable by everyone, including screen reader and keyboard users
- Better SEO (semantic HTML)
- Improved UX for all users (clear labels, focus management, contrast)
- Legal compliance

**Negative:**
- Requires additional development effort for ARIA and keyboard handling
- Testing effort increases (manual screen reader testing)
- Some design decisions constrained by contrast and sizing requirements
