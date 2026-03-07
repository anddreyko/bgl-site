<template>
  <span class="player-badge">
    <span
      v-if="player.color"
      class="player-badge__color"
      :style="{ backgroundColor: player.color }"
      aria-hidden="true"
    />
    <span class="player-badge__name">{{ displayName }}</span>
    <span
      v-if="player.score != null"
      class="player-badge__score"
    >
      {{ player.score }}
    </span>
    <UiBadge
      v-if="player.isWinner"
      variant="success"
    >
      Winner
    </UiBadge>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Player } from '~/types'
import UiBadge from '~/components/UiBadge/index.vue'

const props = defineProps<{
  player: Player
}>()

const { mateNames } = useMateNames()

const displayName = computed(() =>
  props.player.mateName || mateNames.value[props.player.mateId] || props.player.mateId.slice(0, 8),
)
</script>

<style scoped>
.player-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

.player-badge__color {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.player-badge__name {
  font-weight: var(--font-weight-medium);
}

.player-badge__score {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}
</style>
