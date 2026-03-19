<script setup lang="ts">
import UiDialog from '~/components/UiDialog/index.vue'
import UiButton from '~/components/UiButton/index.vue'

const ENTITY_LABELS: Record<string, string> = {
  mate: 'Mate',
  place: 'Place',
  play: 'Play',
}

const ACTION_LABELS: Record<string, string> = {
  create: 'creating',
  update: 'updating',
  delete: 'deleting',
}

const {
  currentConflict,
  hasConflicts,
  showNextConflict,
  resolveWithLocal,
  resolveWithServer,
  resolveAsCopy,
  dismiss,
} = useSyncConflict()

const isOpen = computed({
  get: () => currentConflict.value !== null,
  set: (val: boolean) => {
    if (!val) dismiss()
  },
})

const conflictTitle = computed(() => {
  const op = currentConflict.value
  if (!op) return 'Sync conflict'
  return `Sync conflict: ${ENTITY_LABELS[op.entityType] ?? op.entityType}`
})

const conflictDescription = computed(() => {
  const op = currentConflict.value
  if (!op) return ''
  const action = ACTION_LABELS[op.action] ?? op.action
  return `Error ${action} ${ENTITY_LABELS[op.entityType]?.toLowerCase() ?? op.entityType}: ${op.error ?? 'Unknown error'}`
})

const canSaveAsCopy = computed(() => {
  return currentConflict.value?.action === 'create'
})

watch(hasConflicts, (has) => {
  if (has && !currentConflict.value) {
    showNextConflict()
  }
})
</script>

<template>
  <UiDialog
    :open="isOpen"
    :title="conflictTitle"
    :description="conflictDescription"
    @update:open="isOpen = $event"
  >
    <div
      v-if="currentConflict"
      class="sync-conflict-dialog__actions"
    >
      <UiButton
        variant="primary"
        @click="resolveWithLocal(currentConflict.id)"
      >
        Use local version
      </UiButton>
      <UiButton
        variant="secondary"
        @click="resolveWithServer(currentConflict.id)"
      >
        Use server version
      </UiButton>
      <UiButton
        v-if="canSaveAsCopy"
        variant="secondary"
        @click="resolveAsCopy(currentConflict.id)"
      >
        Save as copy
      </UiButton>
    </div>
  </UiDialog>
</template>

<style scoped>
.sync-conflict-dialog__actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
</style>
