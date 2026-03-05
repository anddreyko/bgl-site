# System Design

## High-Level Architecture

```mermaid
graph TD
    Users[Users / Browser] --> CDN[CDN / Static Assets]
    Users --> Nuxt[Nuxt SSR Server]

    subgraph "Site (BFF)"
        Nuxt --> Pages[Pages / SSR]
        Nuxt --> ServerRoutes[Server Routes / BFF Proxy]
        Nuxt --> Middleware[Server Middleware]
    end

    subgraph "Backend"
        ServerRoutes -->|HTTP| Gateway[API Gateway / Nginx]
        Gateway --> API[API / PHP Slim 4]
        API --> DB[(PostgreSQL)]
        API --> BGG[BGG XML API v2]
    end
```

## Evolution Stages

```mermaid
graph TD
    subgraph "Alpha"
        A1[Auth Pages]
        A2[Game Search]
        A3[Session CRUD]
        A4[Play History]
        A5[Basic Analytics]
    end

    subgraph "Beta"
        B1[Analytics Dashboard]
        B2[Friends System]
        B3[Notifications]
        B4[Session Sharing]
    end

    subgraph "Release"
        C1[PWA]
        C2[Recommendations]
        C3[Social Feed]
        C4[i18n]
    end

    A1 --> B1
    A3 --> B2
    B1 --> C2
    B3 --> C3
```

## Component Architecture

### Phase Matrix

| Component              | Alpha | Beta | RC  | Technology                |
|------------------------|-------|------|-----|---------------------------|
| SSR Pages              | +     | +    | +   | Nuxt 3, Vue 3             |
| BFF Proxy              | +     | +    | +   | Nuxt Server Routes        |
| Design System          | +     | +    | +   | Storybook 10, BEM         |
| Auth (client)          | +     | +    | +   | JWT storage, composables  |
| Game Search            | +     | +    | +   | Autocomplete, BGG proxy   |
| Session Forms          | +     | +    | +   | Vue forms, validation     |
| Analytics Charts       |       | +    | +   | Chart library (TBD)       |
| Friends UI             |       | +    | +   | User search, invites      |
| Notifications          |       | +    | +   | SSE or polling            |
| PWA                    |       |      | +   | Service Worker, manifest  |
| i18n                   |       |      | +   | @nuxtjs/i18n              |

## Data Flow

### Authentication Flow

```mermaid
sequenceDiagram
    participant Browser
    participant Nuxt as Nuxt SSR
    participant API as API Backend

    Browser->>Nuxt: POST /api/auth/sign-in
    Nuxt->>API: POST /v1/auth/sign-in
    API-->>Nuxt: {accessToken, refreshToken}
    Nuxt-->>Browser: Set httpOnly cookies

    Browser->>Nuxt: GET /sessions (with cookie)
    Nuxt->>Nuxt: Extract token from cookie
    Nuxt->>API: GET /v1/sessions (Bearer token)
    API-->>Nuxt: Sessions data
    Nuxt-->>Browser: SSR HTML with sessions
```

### Game Search Flow

```mermaid
sequenceDiagram
    participant Browser
    participant Nuxt as Nuxt SSR
    participant API as API Backend
    participant BGG as BGG API

    Browser->>Nuxt: GET /api/games?q=catan
    Nuxt->>API: GET /v1/games/search?q=catan
    API->>API: Check local cache (24h TTL)
    alt Cache miss
        API->>BGG: GET /xmlapi2/search?query=catan
        BGG-->>API: XML response
        API->>API: XML to JSON, store in DB
    end
    API-->>Nuxt: JSON game list
    Nuxt-->>Browser: Game results
```

### Session Creation Flow

```mermaid
sequenceDiagram
    participant Browser
    participant Nuxt as Nuxt SSR
    participant API as API Backend

    Browser->>Nuxt: POST /api/sessions
    Nuxt->>API: POST /v1/plays
    API->>API: Validate (game exists, players valid)
    API->>API: Create Play aggregate
    API->>API: Log domain event (SessionCreated)
    API-->>Nuxt: Created session
    Nuxt-->>Browser: Redirect to session detail
```

## API Contract

The API backend exposes a REST JSON API documented with OpenAPI 3.x specification.
Full spec: [`../api/web/openapi.json`](../../api/web/openapi.json)

### Key Endpoints (consumed by BFF)

| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| POST   | `/v1/auth/sign-up`          | Register new user        |
| POST   | `/v1/auth/sign-in`          | Login, get JWT pair      |
| GET    | `/v1/auth/confirm/{token}`  | Confirm email            |
| POST   | `/v1/auth/refresh`          | Refresh token pair       |
| POST   | `/v1/auth/sign-out`         | Invalidate session       |
| GET    | `/v1/games/search`          | Search BGG games         |
| POST   | `/v1/plays`                 | Create play session      |
| GET    | `/v1/plays`                 | List play sessions       |
| GET    | `/v1/plays/{id}`            | Get play detail          |

## Domain Model (Backend)

The backend organizes domain into bounded contexts:

```mermaid
graph LR
    subgraph Profile
        User
        Passkey
    end

    subgraph Games
        Game
    end

    subgraph Plays
        Play
        Player
    end

    subgraph Mates
        Mate
    end

    subgraph Stats
        TopGames[Top Games]
    end

    User --> Play
    User --> Mate
    Game --> Play
    Mate --> Player
    Play --> Stats
```

## Event Sourcing (Backend Foundation)

The API backend stores domain events alongside aggregates as a foundation for future event sourcing:

```mermaid
erDiagram
    events ||--o{ plays : "reconstructs"
    events {
        uuid event_id PK
        string aggregate_type
        uuid aggregate_id
        string event_type
        jsonb payload
        timestamp created_at
    }

    plays {
        uuid play_id PK
        uuid game_id FK
        uuid user_id FK
        timestamp started_at
        timestamp finished_at
        string status
        string visibility
    }

    players }o--|| plays : "participates"
    players {
        uuid player_id PK
        uuid mate_id FK
        uuid play_id FK
        boolean is_winner
        integer score
        string color
    }
```

## Deployment

### Development
```bash
# Root level — all services via Docker
make init                    # Build and start all containers

# Site only
cd site && pnpm dev          # Dev server with HMR
cd site && pnpm design       # Storybook
```

### Production (TBD)

Production deployment strategy is not finalized yet. Currently the project runs via Docker Compose (see root `docker-compose.yml` and `docker-compose-prod.yml`).

## Monitoring & Observability

### Target Metrics

| Metric                | Alpha Target | Beta Target |
|-----------------------|--------------|-------------|
| Service availability  | 99.5%        | 99.9%       |
| Page load (TTFB)      | < 500ms      | < 200ms     |
| API response time     | < 300ms      | < 150ms     |
| BGG API error rate    | < 5%         | < 1%        |

### Stack (Planned)
- **Error tracking:** Sentry
- **Performance:** Web Vitals monitoring
- **Uptime:** Health check endpoints

## Technology Radar

```mermaid
quadrantChart
    title Technology Radar
    x-axis "Mature" --> "Emerging"
    y-axis "Hold" --> "Adopt"
    quadrant-1 "Adopt"
    quadrant-2 "Trial"
    quadrant-3 "Assess"
    quadrant-4 "Hold"

    "Nuxt 3 SSR": [0.15, 0.9]
    "Vue 3 Composition API": [0.15, 0.85]
    "Storybook 10": [0.3, 0.8]
    "BEM": [0.1, 0.75]
    "pnpm": [0.2, 0.85]
    "PWA": [0.5, 0.5]
    "i18n": [0.4, 0.4]
