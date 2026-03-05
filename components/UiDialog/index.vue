<template>
  <DialogRoot
    :open="open"
    @update:open="(val: boolean) => $emit('update:open', val)"
  >
    <DialogPortal>
      <DialogOverlay class="ui-dialog__overlay" />
      <DialogContent class="ui-dialog__content">
        <div class="ui-dialog__header">
          <DialogTitle class="ui-dialog__title">{{ title }}</DialogTitle>
          <DialogClose
            class="ui-dialog__close"
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
        <DialogDescription
          v-if="description"
          class="ui-dialog__description"
        >
          {{ description }}
        </DialogDescription>
        <div class="ui-dialog__body">
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
  DialogDescription,
  DialogClose,
} from 'radix-vue'

defineProps<{
  open: boolean
  title: string
  description?: string
}>()

defineEmits<{
  'update:open': [value: boolean]
}>()
</script>

<style scoped>
.ui-dialog__overlay {
  position: fixed;
  inset: 0;
  background-color: var(--color-overlay-bg);
  z-index: var(--z-dialog);
  animation: ui-dialog-overlay-show var(--transition-fast);
}

.ui-dialog__content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 480px;
  max-height: 85vh;
  overflow-y: auto;
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--space-6);
  z-index: var(--z-overlay);
  animation: ui-dialog-content-show var(--transition-normal);
}

.ui-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.ui-dialog__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.ui-dialog__description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-4);
}

.ui-dialog__close {
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

.ui-dialog__close:hover {
  background-color: var(--color-surface-sunken);
  color: var(--color-text-primary);
}

@keyframes ui-dialog-overlay-show {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes ui-dialog-content-show {
  from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
  }

  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>
