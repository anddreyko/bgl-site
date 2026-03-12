<template>
  <div class="page-layout">
    <NuxtLink
      to="/game"
      class="game-detail__back"
      aria-label="Back to game catalog"
    >
      &larr; Back to catalog
    </NuxtLink>

    <div
      v-if="pending || statsLoading"
      class="game-detail__loading"
      role="status"
      aria-live="polite"
    >
      <p>Loading game...</p>
    </div>

    <div
      v-else-if="error"
      class="game-detail__error"
      role="alert"
    >
      <p>Failed to load game details.</p>
      <NuxtLink
        to="/game"
        class="game-detail__back-link"
      >
        Return to catalog
      </NuxtLink>
    </div>

    <template v-else-if="game">
      <GameHero
        :game="game"
        :stats="stats"
      />

      <section
        v-if="game.alternativeNames?.length"
        class="game-detail__section"
      >
        <h3 class="game-detail__section-title">Alternative Names</h3>
        <ul class="game-detail__alt-names">
          <li
            v-for="altName in game.alternativeNames"
            :key="altName"
          >
            {{ altName }}
          </li>
        </ul>
      </section>

      <section
        v-if="game.family"
        class="game-detail__section"
      >
        <h3 class="game-detail__section-title">Family</h3>
        <p>{{ game.family }}</p>
      </section>

      <GamePlaysTable
        v-if="stats.plays.length > 0"
        :plays="stats.plays"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Game } from '~/types'
import GameHero from '~/components/GameHero/index.vue'
import GamePlaysTable from '~/components/GamePlaysTable/index.vue'

const route = useRoute()
const gameId = computed(() => String(route.params.id))

const { set: setBreadcrumb, clear: clearBreadcrumb } = useBreadcrumbLabel()

const { pending, data: game, error } = useLazyFetch<Game>(() => `/api/games/${gameId.value}`)
const { stats, loading: statsLoading } = useGameStats(gameId)

watch(game, (g) => {
  if (g) {
    setBreadcrumb(g.name ?? 'Game')
  }
}, { immediate: true })

onUnmounted(() => clearBreadcrumb())

useHead({
  title: computed(() => `4Record > ${game.value?.name ?? 'Game'}`),
})
</script>

<style scoped>
.game-detail__back {
  display: inline-block;
  color: var(--color-primary);
  text-decoration: none;
  font-size: var(--font-size-sm);
}

.game-detail__back:hover {
  text-decoration: underline;
}

.game-detail__loading,
.game-detail__error {
  text-align: center;
  padding: var(--space-8);
  color: var(--color-text-secondary);
}

.game-detail__back-link {
  color: var(--color-primary);
  text-decoration: underline;
}

.game-detail__section {
  padding: 0;
}

.game-detail__section-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 var(--space-2);
}

.game-detail__alt-names {
  margin: 0;
  padding-left: 1.25rem;
}

.game-detail__alt-names li {
  margin-bottom: var(--space-1);
}
</style>
