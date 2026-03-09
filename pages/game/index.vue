<template>
  <div class="game-catalog">
    <h2 class="game-catalog__title">Game Catalog</h2>

    <div class="game-catalog__search">
      <label
        for="game-search"
        class="game-catalog__search-label"
      >
        Search games
      </label>
      <input
        id="game-search"
        v-model="searchQuery"
        type="search"
        class="game-catalog__search-input"
        placeholder="Search board games..."
        autocomplete="off"
        aria-describedby="search-hint"
      />
      <p
        v-if="searchQuery.length > 0 && searchQuery.length < 3"
        id="search-hint"
        class="game-catalog__hint"
        role="status"
      >
        Enter at least 3 characters to search.
      </p>
    </div>

    <!-- Recent games from plays -->
    <section
      v-if="showRecent"
      class="game-catalog__recent"
    >
      <h3 class="game-catalog__section-title">
        Recently played
      </h3>
      <div
        class="game-catalog__grid"
        role="list"
      >
        <NuxtLink
          v-for="game in recentGames"
          :key="game.id"
          :to="`/game/${game.id}`"
          class="game-catalog__grid-item"
          role="listitem"
        >
          <GameCard :game="game" />
        </NuxtLink>
      </div>
    </section>

    <div
      v-if="pending"
      class="game-catalog__loading"
      role="status"
      aria-live="polite"
    >
      <p>Loading games...</p>
    </div>

    <div
      v-else-if="error"
      class="game-catalog__error"
      role="alert"
    >
      <p>Failed to load games. Please try again.</p>
      <button
        class="game-catalog__retry-btn"
        @click="refresh()"
      >
        Retry
      </button>
    </div>

    <div
      v-else-if="hasSearched && games.length === 0"
      class="game-catalog__empty"
      role="status"
    >
      <p>No games found. Try a different search term.</p>
    </div>

    <div
      v-else-if="games.length > 0"
      class="game-catalog__grid"
      role="list"
    >
      <NuxtLink
        v-for="game in games"
        :key="game.id"
        :to="`/game/${game.id}`"
        class="game-catalog__grid-item"
        role="listitem"
      >
        <GameCard :game="game" />
      </NuxtLink>
    </div>

    <nav
      v-if="totalPages > 1"
      class="game-catalog__pagination"
      aria-label="Games pagination"
    >
      <button
        class="game-catalog__page-btn"
        :disabled="currentPage <= 1"
        aria-label="Previous page"
        @click="goToPage(currentPage - 1)"
      >
        Previous
      </button>

      <span
        class="game-catalog__page-info"
        aria-live="polite"
      >
        Page {{ currentPage }} of {{ totalPages }}
      </span>

      <button
        class="game-catalog__page-btn"
        :disabled="currentPage >= totalPages"
        aria-label="Next page"
        @click="goToPage(currentPage + 1)"
      >
        Next
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import type { Game, Play, PaginatedResponse } from '~/types'
import GameCard from '~/components/GameCard/index.vue'
import { useGames } from '~/composables/useGames'

useHead({
  title: '4Record > Game Catalog',
})

const {
  searchQuery,
  hasSearched,
  games,
  totalPages,
  currentPage,
  pending,
  error,
  goToPage,
  refresh,
} = useGames()

const requestFetch = useRequestFetch()
const { data: recentGamesData } = await useAsyncData(
  'recent-played-games',
  async () => {
    const data = await requestFetch<PaginatedResponse<Play>>('/api/plays', {
      query: { page: 1, size: 100 },
    })
    const seen = new Set<string>()
    const result: Game[] = []
    for (const play of data.items) {
      if (play.game && !seen.has(play.game.id)) {
        seen.add(play.game.id)
        result.push(play.game as Game)
      }
    }
    return result
  },
)

const recentGames = computed(() => recentGamesData.value ?? [])
const showRecent = computed(() => !hasSearched.value && recentGames.value.length > 0)
</script>

<style scoped>
.game-catalog__title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1.5rem;
}

.game-catalog__search {
  margin-bottom: 1.5rem;
}

.game-catalog__search-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: var(--color-text-secondary, #555);
}

.game-catalog__search-input {
  width: 100%;
  padding: 0.625rem 0.75rem;
  font-size: 1rem;
  border: 1px solid var(--color-border, #ccc);
  border-radius: var(--radius-md, 8px);
  background: var(--color-surface, #fff);
  box-sizing: border-box;
}

.game-catalog__search-input:focus {
  outline: 2px solid var(--color-focus, #2563eb);
  outline-offset: 2px;
}

.game-catalog__hint {
  font-size: 0.8125rem;
  color: var(--color-text-muted, #888);
  margin: 0.25rem 0 0;
}

.game-catalog__loading,
.game-catalog__empty,
.game-catalog__error {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-muted, #666);
}

.game-catalog__retry-btn {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border, #ccc);
  border-radius: var(--radius-sm, 4px);
  background: var(--color-surface, #fff);
  cursor: pointer;
}

.game-catalog__grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
}

@media (width >= 480px) {
  .game-catalog__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (width >= 768px) {
  .game-catalog__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (width >= 1024px) {
  .game-catalog__grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.game-catalog__grid-item {
  text-decoration: none;
  color: inherit;
  display: block;
}

.game-catalog__grid-item:focus {
  outline: 2px solid var(--color-focus, #2563eb);
  outline-offset: 2px;
  border-radius: var(--radius-md, 8px);
}

.game-catalog__pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem 0;
}

.game-catalog__page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border, #ccc);
  border-radius: var(--radius-sm, 4px);
  background: var(--color-surface, #fff);
  cursor: pointer;
  font-size: 0.875rem;
}

.game-catalog__page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.game-catalog__page-btn:hover:not(:disabled) {
  background: var(--color-surface-alt, #f5f5f5);
}

.game-catalog__page-info {
  font-size: 0.875rem;
  color: var(--color-text-secondary, #555);
}

.game-catalog__section-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 var(--space-3);
  color: var(--color-text-primary);
}

.game-catalog__recent {
  margin-bottom: var(--space-4);
}
</style>
