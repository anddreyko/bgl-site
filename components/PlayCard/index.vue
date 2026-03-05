<template>
  <UiCard
    class="play-card"
    :clickable="true"
    @click="$emit('click', play)"
  >
    <template #header>
      <div class="play-card__header">
        <h3 class="play-card__game-name">
          {{ play.game?.name ?? play.gameName ?? 'No game' }}
        </h3>
        <div class="play-card__badges">
          <UiBadge :variant="statusVariant">{{ play.status }}</UiBadge>
          <UiBadge variant="info">{{ play.visibility }}</UiBadge>
        </div>
      </div>
    </template>

    <div class="play-card__body">
      <div class="play-card__meta">
        <time
          class="play-card__date"
          :datetime="play.startedAt"
        >
          {{ formattedDate }}
        </time>
        <span
          v-if="play.finishedAt"
          class="play-card__duration"
        >
          {{ formattedDuration }}
        </span>
        <UiTimer
          v-else
          :started-at="play.startedAt"
          :running="true"
        />
      </div>

      <ul
        v-if="play.players.length > 0"
        class="play-card__players"
        aria-label="Players"
      >
        <li
          v-for="player in play.players"
          :key="player.id"
          class="play-card__player"
        >
          <span
            v-if="player.color"
            class="play-card__player-color"
            :style="{ backgroundColor: player.color }"
            aria-hidden="true"
          />
          <span class="play-card__player-name">
            {{ player.mateId }}
          </span>
          <span
            v-if="player.score != null"
            class="play-card__player-score"
          >
            {{ player.score }}
          </span>
          <UiBadge
            v-if="player.winner"
            variant="success"
          >
            Winner
          </UiBadge>
        </li>
      </ul>
      <p
        v-else
        class="play-card__no-players"
      >
        No players
      </p>
    </div>

    <template
      v-if="play.name"
      #footer
    >
      <p class="play-card__name">{{ play.name }}</p>
    </template>
  </UiCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Play } from '~/types'
import UiCard from '~/components/UiCard/index.vue'
import UiBadge from '~/components/UiBadge/index.vue'
import UiTimer from '~/components/UiTimer/index.vue'

const props = defineProps<{
  play: Play
}>()

defineEmits<{
  click: [play: Play]
}>()

const statusVariant = computed(() => {
  switch (props.play.status) {
    case 'published': return 'success'
    case 'deleted': return 'danger'
    default: return 'warning'
  }
})

const formattedDate = computed(() => {
  const date = new Date(props.play.startedAt)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
})

const formattedDuration = computed(() => {
  if (!props.play.finishedAt) return ''

  const start = new Date(props.play.startedAt).getTime()
  const end = new Date(props.play.finishedAt).getTime()
  const totalSeconds = Math.max(0, Math.floor((end - start) / 1000))

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
})
</script>

<style scoped>
.play-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.play-card__game-name {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.play-card__badges {
  display: flex;
  gap: var(--space-1);
  flex-shrink: 0;
}

.play-card__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.play-card__meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.play-card__date {
  white-space: nowrap;
}

.play-card__duration {
  font-weight: var(--font-weight-medium);
}

.play-card__players {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.play-card__player {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
}

.play-card__player-color {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.play-card__player-name {
  flex: 1;
}

.play-card__player-score {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.play-card__no-players {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-disabled);
}

.play-card__name {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-style: italic;
}
</style>
