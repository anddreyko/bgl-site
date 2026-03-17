<template>
  <span
    class="mate-avatar-wrap"
    :class="{ 'mate-avatar-wrap--winner': isWinner }"
  >
    <span
      v-if="systemIcon === 'robot'"
      class="mate-avatar mate-avatar--icon"
      :class="sizeClass"
      :title="name"
      v-html="robotSvg"
    />
    <span
      v-else-if="systemIcon === 'anonymous'"
      class="mate-avatar mate-avatar--icon"
      :class="sizeClass"
      :title="name"
      v-html="anonymousSvg"
    />
    <span
      v-else
      class="mate-avatar"
      :class="sizeClass"
      :title="name"
    >
      {{ getInitials(name) }}
    </span>
    <span
      v-if="isWinner"
      class="mate-avatar-wrap__crown"
      role="img"
      aria-label="Winner"
      v-html="crownSvg"
    />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getInitials } from '~/utils/color-from-string'
import robotSvg from '~/assets/icons/robot.svg?raw'
import anonymousSvg from '~/assets/icons/anonymous.svg?raw'
import crownSvg from '~/assets/icons/crown.svg?raw'

const props = withDefaults(defineProps<{
  mate?: { id: string, name: string }
  size?: 'sm' | 'md'
  isWinner?: boolean
}>(), {
  size: 'sm',
  isWinner: false,
})

const name = computed(() => props.mate?.name || 'Unknown')

const sizeClass = computed(() => `mate-avatar--${props.size}`)

const SYSTEM_ICON_MAP: Record<string, 'robot' | 'anonymous'> = {
  '00000000-0000-4000-a000-000000000001': 'anonymous',
  '00000000-0000-4000-a000-000000000002': 'robot',
}

const systemIcon = computed(() => {
  if (!props.mate?.id) return null
  return SYSTEM_ICON_MAP[props.mate.id] ?? null
})
</script>

<style scoped>
.mate-avatar-wrap {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
}

.mate-avatar-wrap--winner .mate-avatar {
  box-shadow: 0 0 0 1px var(--color-crown);
}

.mate-avatar-wrap__crown {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--color-crown);
  line-height: 0;
}

.mate-avatar-wrap__crown :deep(svg) {
  width: 12px;
  height: 12px;
}

.mate-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background-color: var(--color-surface-raised);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.mate-avatar--sm {
  width: 28px;
  height: 28px;
  font-size: var(--font-size-xs);
}

.mate-avatar--md {
  width: 36px;
  height: 36px;
  font-size: var(--font-size-sm);
}

.mate-avatar--icon {
  color: var(--color-text-secondary);
}

.mate-avatar--icon :deep(svg) {
  width: 18px;
  height: 18px;
}
</style>
