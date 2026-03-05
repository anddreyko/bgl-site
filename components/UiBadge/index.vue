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
  background-color: #dcfce7;
  color: var(--color-success);
}

.ui-badge--warning {
  background-color: #fef3c7;
  color: var(--color-warning);
}

.ui-badge--danger {
  background-color: #fee2e2;
  color: var(--color-danger);
}

.ui-badge--info {
  background-color: #dbeafe;
  color: var(--color-primary);
}
</style>
