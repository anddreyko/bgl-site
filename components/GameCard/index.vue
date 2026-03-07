<template>
  <article
    class="game-card"
    :style="{ '--card-accent': accentColor }"
  >
    <div class="game-card__image">
      <img
        v-if="game.image"
        :src="game.image"
        :alt="game.name"
      />
      <div
        v-else
        class="game-card__placeholder"
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
        >
          <rect
            width="48"
            height="48"
            rx="8"
            fill="currentColor"
            opacity="0.1"
          />
          <path
            d="M16 32L20 26L24 30L30 22L34 32"
            stroke="currentColor"
            opacity="0.3"
            stroke-width="2"
          />
        </svg>
      </div>
    </div>
    <div class="game-card__body">
      <h3 class="game-card__name">{{ game.name }}</h3>
      <div class="game-card__meta">
        <span v-if="game.yearPublished">{{ game.yearPublished }}</span>
        <span v-if="game.minPlayers && game.maxPlayers">
          {{ game.minPlayers }}&ndash;{{ game.maxPlayers }} players
        </span>
      </div>
      <div
        v-if="game.type"
        class="game-card__badge"
      >
        <UiBadge variant="info">{{ game.type }}</UiBadge>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Game } from '~/types'
import UiBadge from '~/components/UiBadge/index.vue'
import { colorFromString } from '~/utils/color-from-string'

const props = defineProps<{
  game: Game
}>()

const accentColor = computed(() => colorFromString(props.game.name).bg)
</script>

<style scoped>
.game-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background-color: var(--color-surface);
  transition: box-shadow var(--transition-fast);
  border-top: 3px solid var(--card-accent, var(--color-border));
}

.game-card:hover {
  box-shadow: var(--shadow-md);
}

.game-card__image {
  aspect-ratio: 1;
  overflow: hidden;
  background-color: var(--color-surface-sunken);
}

.game-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.game-card__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--color-text-disabled);
}

.game-card__body {
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.game-card__name {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.game-card__meta {
  display: flex;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}
</style>
