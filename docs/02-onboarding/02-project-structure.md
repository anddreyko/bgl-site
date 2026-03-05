# Project Structure

## Directory Layout

```
site/
├── components/          # Reusable Vue components (BEM)
│   ├── GameCard/        # Game display card
│   │   ├── index.vue
│   │   └── index.stories.ts
│   └── MainMenu/        # Main navigation
│       ├── index.vue
│       └── index.stories.ts
├── pages/               # File-based routing (Nuxt auto-routes)
│   ├── index.vue        # / — Home page
│   ├── about.vue        # /about — About page
│   ├── game/
│   │   ├── index.vue    # /game — Games list
│   │   └── [slug].vue   # /game/:slug — Game detail
│   └── user/
│       ├── index.vue    # /user — Users list
│       └── [login].vue  # /user/:login — User profile
├── server/              # Nuxt server-side code
│   ├── api/             # BFF proxy routes
│   │   ├── games/
│   │   │   ├── index.ts       # GET /api/games
│   │   │   └── [slug].ts      # GET /api/games/:slug
│   │   └── hello-world.ts     # GET /api/hello-world
│   ├── entities/        # Server-side type definitions
│   └── middleware/       # Server middleware (auth, logging)
├── layouts/             # Page layout templates
├── utils/               # Shared utility functions
├── .storybook/          # Storybook configuration
├── storybook-static/    # Built Storybook output (gitignored)
├── docs/                # Project documentation
├── nuxt.config.ts       # Nuxt framework configuration
├── app.config.ts        # Application-level configuration
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies and scripts
├── pnpm-lock.yaml       # Lockfile
├── error.vue            # Global error page
└── CLAUDE.local.md      # AI assistant configuration
```

## Key Concepts

### Pages (File-Based Routing)

Nuxt auto-generates routes from the `pages/` directory. Dynamic segments use bracket notation:

| File                  | Route              | Description       |
|-----------------------|--------------------|-------------------|
| `pages/index.vue`     | `/`                | Home page         |
| `pages/about.vue`     | `/about`           | About page        |
| `pages/game/index.vue`| `/game`            | Games list        |
| `pages/game/[slug].vue`| `/game/:slug`     | Game detail       |
| `pages/user/index.vue`| `/user`            | Users list        |
| `pages/user/[login].vue`| `/user/:login`  | User profile      |

### Components (BEM)

Each component is a directory containing the Vue component and its Storybook story:

```
components/
  ComponentName/
    index.vue           # Component implementation
    index.stories.js    # Storybook story
```

Components are auto-imported by Nuxt. Use them directly in templates without explicit imports.

### Server Routes (BFF Proxy)

Server routes in `server/api/` handle API proxying. They run on the Nuxt server (Node.js), not in the browser:

```
server/api/games/index.js    →  GET /api/games
server/api/games/[slug].js   →  GET /api/games/:slug
server/api/hello-world.js    →  GET /api/hello-world
```

Each route fetches data from the backend API using `runtimeConfig` values for host configuration.

### Layouts

Layout templates in `layouts/` wrap page content. The default layout provides common elements (navigation, footer).

### Runtime Configuration

Sensitive configuration (API hosts) is defined in `nuxt.config.ts` under `runtimeConfig` and is only accessible on the server side. Override with `NUXT_` prefixed environment variables.

## Planned Structure (Alpha)

```
site/
├── components/
│   ├── AuthForm/          # Login/register form
│   ├── GameSearch/        # BGG game autocomplete
│   ├── GameCard/          # Game display card (exists)
│   ├── MainMenu/          # Navigation (exists)
│   ├── SessionForm/       # Create/edit session
│   ├── SessionList/       # Session history list
│   └── AnalyticsChart/    # Top games chart
├── composables/
│   ├── useAuth.ts         # JWT management
│   ├── useBGG.ts          # Game search
│   └── useSessions.ts     # Session CRUD
├── pages/
│   ├── index.vue
│   ├── about.vue
│   ├── login.vue
│   ├── register.vue
│   ├── game/
│   ├── user/
│   └── sessions/
│       ├── index.vue      # Session history
│       └── create.vue     # New session form
├── server/
│   ├── api/
│   │   ├── auth/          # Auth proxy
│   │   ├── games/         # Games proxy
│   │   └── sessions/      # Sessions proxy
│   └── middleware/
│       └── auth.ts        # JWT cookie validation
└── store/
    └── auth.ts            # Auth state (Pinia)
```

## Related Documentation

- [System Design](../01-project-overview/02-system-design.md) — architecture and data flows
- [Getting Started](01-getting-started.md) — setup instructions
- [API OpenAPI Spec](../../../api/web/openapi.json) — backend API contract
