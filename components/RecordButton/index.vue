<template>
  <button
    class="record-button"
    :class="{ 'record-button--active': !!activePlay }"
    type="button"
    :aria-label="activePlay ? 'Active play in progress' : 'Record new play'"
    @click="$emit('click')"
  >
    <span
      class="record-button__dot"
      aria-hidden="true"
    />
    <template v-if="activePlay">
      <UiTimer
        class="record-button__timer"
        :started-at="activePlay.startedAt"
        :running="true"
      />
    </template>
    <template v-else>
      <span class="record-button__text">Record</span>
    </template>
  </button>
</template>

<script setup lang="ts">
import type { Play } from '~/types'
import UiTimer from '~/components/UiTimer/index.vue'

defineProps<{
  activePlay?: Play | null
}>()

defineEmits<{
  click: []
}>()
</script>

<style scoped>
.record-button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-3);
  border: none;
  border-radius: var(--radius-full);
  background-color: transparent;
  color: var(--color-text-primary);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: background-color var(--transition-fast);
}

.record-button:hover {
  background-color: var(--color-surface-sunken);
}

.record-button__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: var(--radius-full);
  background-color: var(--color-record);
  flex-shrink: 0;
}

.record-button--active .record-button__dot {
  animation: record-button-pulse 1.5s ease-in-out infinite;
}

.record-button__text {
  white-space: nowrap;
}

.record-button__timer {
  font-size: var(--font-size-sm);
}

@keyframes record-button-pulse {
  0%, 100% {
    opacity: 1;
  }

  50% {
    opacity: 0.3;
  }
}
</style>
