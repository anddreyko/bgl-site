<template>
  <span
    class="ui-badge"
    :class="`ui-badge--${variant}`"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}>(), {
  variant: 'default',
})
</script>

<style scoped>
.ui-badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-2);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-tight);
  border-radius: var(--radius-full);
}

.ui-badge--default {
  background-color: var(--color-surface-sunken);
  color: var(--color-text-secondary);
}

.ui-badge--success {
  background-color: var(--color-badge-success-bg);
  color: var(--color-badge-success-text);
}

.ui-badge--warning {
  background-color: var(--color-badge-warning-bg);
  color: var(--color-badge-warning-text);
}

.ui-badge--danger {
  background-color: var(--color-badge-danger-bg);
  color: var(--color-badge-danger-text);
}

.ui-badge--info {
  background-color: var(--color-badge-info-bg);
  color: var(--color-badge-info-text);
}
</style>
