<template>
  <DialogRoot
    :open="isOpen"
    @update:open="(val: boolean) => val ? open() : close()"
  >
    <DialogPortal>
      <DialogOverlay class="record-dialog__backdrop" />
      <DialogContent class="record-dialog__panel">
        <div class="record-dialog__header">
          <DialogTitle class="record-dialog__title">Record a Play</DialogTitle>
          <DialogClose
            class="record-dialog__close"
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
        <div class="record-dialog__body">
          <PlayForm
            :mates="mates"
            :system-mates="systemMates"
            :places="places"
            @submit="onSubmit"
          />
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
import type { PlayCreatePayload } from '~/types'
import PlayForm from '~/components/PlayForm/index.vue'

const { isOpen, open, close } = useRecordDialog()
const { startPlay } = useActivePlay()
const { mates, systemMates } = useMateNames()
const { places } = usePlaceNames()

async function onSubmit(payload: PlayCreatePayload) {
  try {
    await startPlay(payload)
    close()
  }
  catch {
    // error handled by composable
  }
}
</script>

<style scoped>
.record-dialog__backdrop {
  position: fixed;
  inset: 0;
  background-color: var(--color-overlay-bg);
  z-index: var(--z-dialog);
  animation: record-dialog-fade-in var(--transition-fast);
}

.record-dialog__panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 600px;
  max-height: 85vh;
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-overlay);
  display: flex;
  flex-direction: column;
  animation: record-dialog-scale-in var(--transition-normal);
}

.record-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.record-dialog__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.record-dialog__close {
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

.record-dialog__close:hover {
  background-color: var(--color-surface-sunken);
  color: var(--color-text-primary);
}

.record-dialog__body {
  padding: var(--space-6);
  overflow-y: auto;
  flex: 1;
}

@keyframes record-dialog-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes record-dialog-scale-in {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
  }

  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>
