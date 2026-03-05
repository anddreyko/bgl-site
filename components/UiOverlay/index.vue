<template>
  <DialogRoot
    :open="open"
    @update:open="(val: boolean) => $emit('update:open', val)"
  >
    <DialogPortal>
      <DialogOverlay class="ui-overlay__backdrop" />
      <DialogContent class="ui-overlay__panel">
        <div class="ui-overlay__header">
          <DialogTitle class="ui-overlay__title">{{ title }}</DialogTitle>
          <DialogClose
            class="ui-overlay__close"
            aria-label="Close"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M4 4L12 12M12 4L4 12"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </DialogClose>
        </div>
        <div class="ui-overlay__body">
          <slot />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogClose,
} from 'radix-vue'

defineProps<{
  open: boolean
  title: string
}>()

defineEmits<{
  'update:open': [value: boolean]
}>()
</script>

<style scoped>
.ui-overlay__backdrop {
  position: fixed;
  inset: 0;
  background-color: var(--color-overlay-bg);
  z-index: var(--z-dialog);
}

.ui-overlay__panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 90vw;
  max-width: 480px;
  background-color: var(--color-surface);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-overlay);
  display: flex;
  flex-direction: column;
  animation: ui-overlay-slide-in var(--transition-normal);
}

.ui-overlay__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--color-border);
}

.ui-overlay__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.ui-overlay__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.ui-overlay__close:hover {
  background-color: var(--color-surface-sunken);
  color: var(--color-text-primary);
}

.ui-overlay__body {
  flex: 1;
  padding: var(--space-6);
  overflow-y: auto;
}

@keyframes ui-overlay-slide-in {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
</style>
