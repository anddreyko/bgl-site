# Project Rules

## Architecture
- Nuxt 3.21 SSR (Vue 3, Vite 7) with BFF-pattern API proxy
- Package manager: pnpm (not npm)
- Server for SSR rendering and API proxying — no data storage, no background processes
- BEM methodology as target component architecture (not yet adopted)
- Storybook 10 (vue3-vite) for component development
- OpenAPI spec for future backend lives in a sibling project

## Roadmap
- Current phase: modernization (update dependencies, resolve conflicts)
- Phase 1 (Alpha): core functionality
- Phase 2 (Beta): feature-complete
- Phase 3 (RC): polish and release candidate

## Code Standards
- Type-check must pass before commit
- Build must pass before commit
- No hardcoded credentials

## Library-First Approach

Before writing new code (>20 lines), search for existing libraries:
- Check: weekly downloads >1000, commits in last 6 months, TypeScript/types support
- Use library when it covers >70% of required functionality and is actively maintained
- Write custom code for <20 lines of simple logic or core business logic requiring full control

## Session Completion

Work is NOT complete until `git push` succeeds.

1. Run quality gates (if code changed) — tests, linters, builds
2. Push to remote:
   ```bash
   git pull --rebase
   git push
   ```
3. Verify all changes committed and pushed
