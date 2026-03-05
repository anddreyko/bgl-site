<template>
  <button
    class="ui-button"
    :class="[
      `ui-button--${variant}`,
      `ui-button--${size}`,
      { 'ui-button--loading': loading },
    ]"
    :type="type"
    :disabled="disabled || loading"
    :aria-disabled="disabled || loading"
    :aria-busy="loading"
    @click="handleClick"
  >
    <span
      v-if="$slots['icon-left'] && !loading"
      class="ui-button__icon-left"
    >
      <slot name="icon-left" />
    </span>
    <UiSpinner
      v-if="loading"
      class="ui-button__spinner"
      size="sm"
    />
    <slot v-if="!loading" />
    <span
      v-if="$slots['icon-right'] && !loading"
      class="ui-button__icon-right"
    >
      <slot name="icon-right" />
    </span>
  </button>
</template>

<script setup lang="ts">
import UiSpinner from '~/components/UiSpinner/index.vue'

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'record'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  type: 'button',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.ui-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: background-color var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
}

.ui-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* Sizes */
.ui-button--sm {
  padding: var(--space-1) var(--space-3);
  font-size: var(--font-size-sm);
}

.ui-button--md {
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-md);
}

.ui-button--lg {
  padding: var(--space-3) var(--space-6);
  font-size: var(--font-size-lg);
}

/* Variants */
.ui-button--primary {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
}

.ui-button--primary:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}

.ui-button--secondary {
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border-color: var(--color-border);
}

.ui-button--secondary:hover:not(:disabled) {
  background-color: var(--color-surface-raised);
}

.ui-button--ghost {
  background-color: transparent;
  color: var(--color-text-primary);
}

.ui-button--ghost:hover:not(:disabled) {
  background-color: var(--color-surface-sunken);
}

.ui-button--danger {
  background-color: var(--color-danger);
  color: var(--color-text-inverse);
}

.ui-button--danger:hover:not(:disabled) {
  background-color: var(--color-record-hover);
}

.ui-button--record {
  background-color: var(--color-record);
  color: var(--color-text-inverse);
}

.ui-button--record:hover:not(:disabled) {
  background-color: var(--color-record-hover);
}

.ui-button--record:active:not(:disabled) {
  background-color: var(--color-record-active);
}

.ui-button--loading {
  pointer-events: none;
}
</style>
