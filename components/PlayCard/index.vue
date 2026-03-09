<template>
  <UiCard
    class="play-card"
    :clickable="true"
    @click="$emit('click', play)"
  >
    <template #header>
      <div class="play-card__header">
        <div class="play-card__titles">
          <h3 class="play-card__name">
            {{ play.name || play.game?.name || play.gameName || `Play #${play.id.slice(0, 8)}` }}
          </h3>
          <p
            v-if="play.name && (play.game?.name || play.gameName)"
            class="play-card__game-name"
          >
            {{ play.game?.name ?? play.gameName }}
          </p>
        </div>
        <div class="play-card__badges">
          <UiBadge :variant="play.finishedAt ? 'success' : 'warning'">{{ play.finishedAt ? 'Finished' : 'In progress' }}</UiBadge>
          <UiBadge variant="info">{{ play.visibility }}</UiBadge>
        </div>
      </div>
    </template>

    <div class="play-card__body">
      <div class="play-card__meta">
        <NuxtLink
          v-if="play.author"
          :to="`/user/${play.author.name}`"
          class="play-card__author"
          @click.stop
        >
          {{ play.author.name }}
        </NuxtLink>
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
          <PlayerBadge
            :player="player"
          />
        </li>
      </ul>
      <p
        v-else
        class="play-card__no-players"
      >
        No players
      </p>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Play } from '~/types'
import UiCard from '~/components/UiCard/index.vue'
import UiBadge from '~/components/UiBadge/index.vue'
import UiTimer from '~/components/UiTimer/index.vue'
import PlayerBadge from '~/components/PlayerBadge/index.vue'

const props = defineProps<{
  play: Play
}>()

defineEmits<{
  click: [play: Play]
}>()

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

.play-card__titles {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 0;
}

.play-card__name {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.play-card__game-name {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
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
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.play-card__meta > *:not(:first-child)::before {
  content: '\00B7';
  margin-right: var(--space-2);
}

.play-card__author {
  color: var(--color-primary);
  text-decoration: none;
  white-space: nowrap;
}

.play-card__author:hover {
  text-decoration: underline;
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
  font-size: var(--font-size-sm);
}

.play-card__no-players {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-disabled);
}
</style>
