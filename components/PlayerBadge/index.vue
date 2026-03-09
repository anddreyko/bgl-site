<template>
  <span class="player-badge">
    <MateAvatar
      :mate-id="player.mateId"
      :mate-name="player.mateName"
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
    <span
      v-if="player.isWinner"
      class="player-badge__crown"
      role="img"
      aria-label="Winner"
      v-html="crownSvg"
    />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Player } from '~/types'
import MateAvatar from '~/components/MateAvatar/index.vue'
import crownSvg from '~/assets/icons/crown.svg?raw'
import { resolveColor } from '~/utils/player-colors'

const props = defineProps<{
  player: Player
}>()

const { resolveName } = useMateNames()

const displayName = computed(() =>
  resolveName(props.player.mateId, props.player.mateName),
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

.player-badge__crown {
  color: var(--color-crown);
  flex-shrink: 0;
  display: inline-flex;
}

.player-badge__crown :deep(svg) {
  width: 16px;
  height: 16px;
}
</style>
