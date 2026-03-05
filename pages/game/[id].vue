<template>
  <div class="game-detail">
    <NuxtLink
      to="/game"
      class="game-detail__back"
      aria-label="Back to game catalog"
    >
      &larr; Back to catalog
    </NuxtLink>

    <div
      v-if="pending"
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
      <div class="game-detail__card">
        <GameCard :game="game" />
      </div>

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
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Game } from '~/types'
import GameCard from '~/components/GameCard/index.vue'

const route = useRoute()
const gameId = route.params.id as string

const { pending, data: game, error } = useLazyFetch<Game>(`/api/games/${gameId}`)

useHead({
  title: computed(() => `4Record > ${game.value?.name ?? 'Game'}`),
})

definePageMeta({ layout: 'games' })
</script>

<style scoped>
.game-detail {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}

.game-detail__back {
  display: inline-block;
  margin-bottom: 1rem;
  color: var(--color-link, #2563eb);
  text-decoration: none;
  font-size: 0.875rem;
}

.game-detail__back:hover {
  text-decoration: underline;
}

.game-detail__back:focus {
  outline: 2px solid var(--color-focus, #2563eb);
  outline-offset: 2px;
}

.game-detail__loading,
.game-detail__error {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-muted, #666);
}

.game-detail__back-link {
  color: var(--color-link, #2563eb);
  text-decoration: underline;
}

.game-detail__card {
  margin-bottom: 1.5rem;
}

.game-detail__section {
  margin-bottom: 1rem;
}

.game-detail__section-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
}

.game-detail__alt-names {
  margin: 0;
  padding-left: 1.25rem;
}

.game-detail__alt-names li {
  margin-bottom: 0.25rem;
}
</style>
