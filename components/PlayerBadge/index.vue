<template>
  <span class="player-badge">
    <MateAvatar
      :mate="player.mate"
      :is-winner="player.isWinner"
    />
    <span
      v-if="player.color"
      class="player-badge__color"
      :style="{ backgroundColor: resolveColor(player.color) }"
      :title="player.color"
      role="img"
      :aria-label="`Color: ${player.color}`"
    />
    <span class="player-badge__name">{{ displayName }}</span>
    <span
      v-if="player.score != null"
      class="player-badge__score"
    >
      {{ player.score }}
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Player } from '~/types'
import MateAvatar from '~/components/MateAvatar/index.vue'
import { resolveColor } from '~/utils/player-colors'

const props = defineProps<{
  player: Player
}>()

const { resolveName } = useMateNames()

const displayName = computed(() =>
  resolveName(props.player.mate?.id, props.player.mate?.name),
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
