<template>
  <button
    class="ui-fab"
    :class="{ 'ui-fab--active': active }"
    @click="$emit('click')"
  >
    <span class="ui-fab__circle">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          cx="12"
          cy="12"
          r="6"
          fill="currentColor"
        />
      </svg>
    </span>
    <span class="ui-fab__label">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  label?: string
  active?: boolean
}>(), {
  label: 'Record',
  active: false,
})

defineEmits<{
  click: []
}>()
</script>

<style scoped>
.ui-fab {
  position: fixed;
  bottom: var(--space-8);
  right: var(--space-8);
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  height: 56px;
  padding: 0 var(--space-5) 0 var(--space-4);
  justify-content: center;
  background-color: var(--color-surface);
  color: var(--color-record);
  border: 2px solid var(--color-record);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-lg);
  cursor: pointer;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  z-index: var(--z-fab);
  transition: background-color var(--transition-fast), transform var(--transition-fast);
}

.ui-fab__label {
  display: inline;
}

.ui-fab:hover {
  background-color: var(--color-surface-raised);
  transform: scale(1.05);
}

.ui-fab:active {
  background-color: var(--color-surface);
  transform: scale(0.98);
}

.ui-fab__circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ui-fab--active .ui-fab__circle {
  animation: ui-fab-pulse 1.5s ease-in-out infinite;
}

@media (width <= 640px) {
  .ui-fab {
    width: 56px;
    padding: 0;
  }

  .ui-fab__label {
    display: none;
  }
}

@keyframes ui-fab-pulse {
  0%, 100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
    color: var(--color-record-pulse);
  }
}
</style>
