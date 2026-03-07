<template>
  <section
    class="game-hero"
    :style="heroStyle"
  >
    <div class="game-hero__overlay" />
    <div class="game-hero__content">
      <div
        v-if="game.image"
        class="game-hero__cover"
      >
        <img
          :src="game.image"
          :alt="game.name"
          class="game-hero__cover-img"
        />
      </div>
      <div class="game-hero__info">
        <h1 class="game-hero__title">{{ game.name }}</h1>
        <div class="game-hero__meta">
          <span v-if="game.yearPublished">{{ game.yearPublished }}</span>
          <span v-if="game.minPlayers && game.maxPlayers">
            {{ game.minPlayers }}&ndash;{{ game.maxPlayers }} players
          </span>
          <UiBadge
            v-if="game.type"
            variant="info"
          >
            {{ game.type }}
          </UiBadge>
        </div>
        <div
          v-if="stats"
          class="game-hero__stats"
        >
          <div class="game-hero__stat">
            <span class="game-hero__stat-value">{{ stats.totalPlays }}</span>
            <span class="game-hero__stat-label">plays</span>
          </div>
          <div class="game-hero__stat">
            <span class="game-hero__stat-value">{{ formattedTime }}</span>
            <span class="game-hero__stat-label">total time</span>
          </div>
          <div class="game-hero__stat">
            <span class="game-hero__stat-value">{{ stats.winRate }}%</span>
            <span class="game-hero__stat-label">win rate</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Game } from '~/types'
import type { GameStats } from '~/composables/useGameStats'
import { colorFromString } from '~/utils/color-from-string'
import UiBadge from '~/components/UiBadge/index.vue'

const props = defineProps<{
  game: Game
  stats?: GameStats
}>()

const colors = computed(() => colorFromString(props.game.name))

const safeImageUrl = computed(() => {
  if (!props.game.image) return null
  try {
    const url = new URL(props.game.image)
    return ['https:', 'http:'].includes(url.protocol) ? props.game.image : null
  }
  catch {
    return null
  }
})

const heroStyle = computed(() => ({
  '--hero-bg': colors.value.bg,
  '--hero-text': colors.value.text,
  ...(safeImageUrl.value ? { '--hero-image': `url(${safeImageUrl.value})` } : {}),
}))

const formattedTime = computed(() => {
  if (!props.stats) return '0m'
  const minutes = props.stats.totalTimeMinutes
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
})
</script>

<style scoped>
.game-hero {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background-color: var(--hero-bg);
  background-image: var(--hero-image, none);
  background-size: cover;
  background-position: center;
  color: var(--hero-text);
  min-height: 200px;
}

.game-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    var(--hero-bg) 40%,
    color-mix(in srgb, var(--hero-bg) 80%, transparent)
  );
}

.game-hero__content {
  position: relative;
  z-index: 1;
  display: flex;
  gap: var(--space-6);
  padding: var(--space-6);
  align-items: center;
}

.game-hero__cover {
  flex-shrink: 0;
  width: 140px;
  height: 140px;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.game-hero__cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.game-hero__info {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.game-hero__title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  margin: 0;
  line-height: var(--line-height-tight);
}

.game-hero__meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--font-size-sm);
  opacity: 0.85;
}

.game-hero__stats {
  display: flex;
  gap: var(--space-6);
  margin-top: var(--space-2);
}

.game-hero__stat {
  display: flex;
  flex-direction: column;
}

.game-hero__stat-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
}

.game-hero__stat-label {
  font-size: var(--font-size-xs);
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

@media (width <= 640px) {
  .game-hero__content {
    flex-direction: column;
    text-align: center;
    align-items: center;
  }

  .game-hero__stats {
    justify-content: center;
  }
}
</style>
