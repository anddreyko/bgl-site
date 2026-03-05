# ADR-004: pnpm as Package Manager

**Status:** Accepted
**Date:** 2025-03

## Context

The project needs a reliable, fast package manager. Previously used npm/yarn, but encountered dependency hoisting issues with Nuxt and Storybook.

## Decision

Use **pnpm** as the sole package manager.

### Configuration

`.npmrc`:
```
shamefully-hoist=true
```

`package.json` overrides:
```json
{
  "pnpm": {
    "overrides": {
      "serialize-javascript": "^7.0.3"
    }
  }
}
```

## Consequences

**Positive:**
- Strict dependency isolation by default
- Faster installs via content-addressable storage
- `pnpm.overrides` for patching transitive vulnerabilities (e.g., serialize-javascript)
- Disk space savings across projects

**Negative:**
- `shamefully-hoist=true` required for Nuxt/Storybook compatibility (reduces strictness)
- Team must use pnpm consistently (no mixing with npm/yarn)

## Alternatives Considered

1. **npm** — rejected: slower, less strict dependency resolution
2. **yarn** — rejected: no significant advantage over pnpm for this project
