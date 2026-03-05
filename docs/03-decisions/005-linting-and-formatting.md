# ADR-005: ESLint + Stylelint for Code Quality

**Status:** Accepted
**Date:** 2025-03

## Context

The project needs automated code quality enforcement for JavaScript/TypeScript/Vue and CSS.

## Decision

Use **ESLint 10** with **@nuxt/eslint** module and **Stylelint 17** with **postcss-html** for Vue SFC support.

### ESLint Configuration

- Integrated via `@nuxt/eslint` Nuxt module (generates config from `.nuxt/eslint.config.mjs`)
- Stylistic rules: 2-space indent, single quotes, no semicolons
- Extended in `eslint.config.mjs` with project-specific overrides

### Stylelint Configuration

- `stylelint-config-standard` as base
- `stylelint-config-html/vue` for Vue SFC `<style>` blocks
- Vue pseudo-classes (`deep`, `global`, `slotted`) whitelisted

### Pre-commit Hooks

- `simple-git-hooks` triggers `lint-staged` on pre-commit
- Staged JS/TS/Vue files: `eslint --fix`
- Staged Vue/CSS files: `stylelint --fix`

## Consequences

**Positive:**
- Consistent code style enforced automatically
- Issues caught before commit (pre-commit hook)
- @nuxt/eslint stays in sync with Nuxt framework conventions

**Negative:**
- Initial setup required lint-fixing existing codebase
- Two separate linting tools to maintain (ESLint for JS, Stylelint for CSS)
