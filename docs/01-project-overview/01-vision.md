# Vision & Scope

## Mission

4Record Site is the frontend layer of the 4Record platform — a board game session logging service with analytics and BoardGameGeek integration. The site provides SSR-rendered UI and acts as a BFF proxy to the API backend.

## Goals

1. **Fast, accessible UI** — server-side rendering for SEO and initial load performance
2. **BFF proxy** — keep API credentials and internal URLs server-side
3. **Design system** — component library with Storybook for consistent UI development
4. **Progressive enhancement** — start with core features, iterate toward rich interactions

## Scope

### In Scope (Site)
- Server-side rendered pages (Nuxt SSR)
- BFF API proxy (server routes)
- Component library and design system (Storybook)
- Client-side state management
- Form handling and validation
- Responsive layout

### Out of Scope (Handled by API)
- Authentication logic (JWT issuance, validation)
- Business rules and domain logic
- Database operations
- BGG API integration and caching
- Event sourcing

## Target Users

- Board game enthusiasts tracking their plays
- Game group organizers managing sessions
- Collectors wanting play statistics for their collection

## Roadmap

### Modernization (Current)
- Upgrade Nuxt to 3.21, Storybook to 10
- Switch to pnpm, resolve dependency conflicts
- Establish BEM component architecture

### Phase 1 — Alpha
- Auth pages (login, register, confirmation)
- Game search with BGG autocomplete
- Session creation form
- Session history with filters
- User profile page

### Phase 2 — Beta
- Analytics dashboard (top games, play frequency charts)
- Friends and social features
- Session sharing and visibility controls
- Notifications

### Phase 3 — RC
- Performance optimization (lazy loading, caching)
- PWA support
- Accessibility audit (WCAG 2.1 AA)
- Internationalization (i18n)

## Design Principles

1. **Accessible by default** — WCAG 2.1 AA conformance, semantic HTML, keyboard navigation, screen reader support (see [ADR-007](../03-decisions/007-accessibility.md))
2. **Server-first** — SSR by default, client hydration where needed
3. **Proxy everything** — no direct API calls from browser
4. **Component isolation** — each component is self-contained with Storybook story
5. **BEM naming** — consistent CSS class naming convention
6. **Progressive disclosure** — show essential info first, details on demand
