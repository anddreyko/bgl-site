<template>
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getInitials } from '~/utils/color-from-string'
import robotSvg from '~/assets/icons/robot.svg?raw'
import anonymousSvg from '~/assets/icons/anonymous.svg?raw'

const props = withDefaults(defineProps<{
  mateId: string
  mateName?: string
  size?: 'sm' | 'md'
}>(), {
  size: 'sm',
})

const { resolveName, systemMateIds } = useMateNames()

const name = computed(() => resolveName(props.mateId, props.mateName))

const sizeClass = computed(() => `mate-avatar--${props.size}`)

const systemIcon = computed(() => {
  if (!systemMateIds.value.has(props.mateId)) return null
  const n = name.value.toLowerCase()
  if (n === 'automa') return 'robot'
  if (n === 'anonymous') return 'anonymous'
  return null
})
</script>

<style scoped>
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
