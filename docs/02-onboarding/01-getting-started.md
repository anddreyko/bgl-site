# Getting Started

## Prerequisites

- **Node.js** >= 18
- **pnpm** >= 9 (`npm install -g pnpm`)
- **Docker** and **Docker Compose** (for full-stack development)

## Setup

### Site Only (Frontend Development)

```bash
cd site
pnpm install
pnpm dev
```

The dev server starts at http://localhost:3000.

For Storybook (component development):

```bash
pnpm design
```

Storybook starts at http://localhost:6006.

### Full Stack (with API)

From the monorepo root:

```bash
make init
```

This starts:
- API Gateway at http://localhost:8081
- API backend (proxied through gateway)
- PostgreSQL database

Then start the site:

```bash
cd site
pnpm dev
```

## Environment Configuration

Runtime config is defined in `nuxt.config.ts` under `runtimeConfig`:

```ts
runtimeConfig: {
  apiHelloWorldHost: '',   // Hello World API host
  apiGameHost: '',         // Games API host
}
```

Override via environment variables:

```bash
NUXT_API_HELLO_WORLD_HOST=http://localhost:8081 \
NUXT_API_GAME_HOST=http://localhost:8081 \
pnpm dev
```

## Key Commands

| Command              | What it does                              |
|----------------------|-------------------------------------------|
| `pnpm dev`           | Start Nuxt dev server with HMR            |
| `pnpm build`         | Build for production                      |
| `pnpm preview`       | Preview production build                  |
| `pnpm design`        | Start Storybook dev server                |
| `pnpm design:build`  | Build static Storybook output             |
| `pnpm lint`          | Run ESLint                                |
| `pnpm lint:fix`      | Run ESLint with auto-fix                  |
| `pnpm lint:css`      | Run Stylelint on Vue/CSS files            |
| `pnpm lint:css:fix`  | Run Stylelint with auto-fix               |
| `pnpm test`          | Run Vitest (single run)                   |
| `pnpm test:watch`    | Run Vitest in watch mode                  |
| `pnpm typecheck`     | Run Nuxt type checking                    |

## Project Conventions

### Package Manager
Always use **pnpm**. Never use npm or yarn. The project uses `shamefully-hoist=true` in `.npmrc` (required for Nuxt/Storybook compatibility).

### Component Architecture
Target methodology is **BEM** (Block-Element-Modifier). Each component lives in its own directory:

```
components/
  GameCard/
    index.vue           # Component
    index.stories.js    # Storybook story
```

### Server Routes (BFF Proxy)
All API calls go through Nuxt server routes in `server/api/`. The browser never calls the backend API directly.

### Code Style
- Vue 3 Composition API (`<script setup>`)
- TypeScript
- ESLint with @nuxt/eslint (stylistic: 2-space indent, single quotes, no semicolons)
- Stylelint with stylelint-config-standard + postcss-html for Vue SFC
- Storybook story for every reusable component

### Git Hooks
Pre-commit hook (via simple-git-hooks + lint-staged) automatically runs:
- `eslint --fix` on staged `*.{js,ts,vue}` files
- `stylelint --fix` on staged `*.{vue,css}` files

### Testing
- Vitest 4 as test runner (happy-dom environment)
- @vue/test-utils for component testing
- @nuxt/test-utils for Nuxt-specific testing
- Tests live in `tests/` directory

## Troubleshooting

### `pnpm install` fails with peer dependency errors
Ensure `shamefully-hoist=true` is set in `.npmrc`. This is required because Nuxt and Storybook have complex dependency trees.

### Storybook fails to start
Check that `.storybook/main.js` uses ESM syntax and includes `@vitejs/plugin-vue` in `viteFinal` configuration.

### API proxy returns 502/503
Make sure the API backend is running (either via Docker or locally). Check that `runtimeConfig` values point to correct API hosts.

## Next Steps

- Read [Project Structure](02-project-structure.md) to understand the codebase layout
- Read [System Design](../01-project-overview/02-system-design.md) for architecture overview
- Check [Architecture Decisions](../03-decisions/) for rationale behind key choices
