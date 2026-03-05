<template>
  <article class="mate-card">
    <div class="mate-card__body">
      <h3 class="mate-card__name">{{ mate.name }}</h3>
      <p
        v-if="mate.notes"
        class="mate-card__notes"
      >
        {{ truncatedNotes }}
      </p>
      <time
        class="mate-card__date"
        :datetime="mate.createdAt"
      >
        Added {{ formattedDate }}
      </time>
    </div>
    <div class="mate-card__actions">
      <UiButton
        variant="ghost"
        size="sm"
        aria-label="Edit mate"
        @click="$emit('edit', mate)"
      >
        Edit
      </UiButton>
      <UiButton
        variant="danger"
        size="sm"
        aria-label="Delete mate"
        @click="$emit('delete', mate)"
      >
        Delete
      </UiButton>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Mate } from '~/types'
import UiButton from '~/components/UiButton/index.vue'

const props = defineProps<{
  mate: Mate
}>()

defineEmits<{
  edit: [mate: Mate]
  delete: [mate: Mate]
}>()

const MAX_NOTES_LENGTH = 100

const truncatedNotes = computed(() => {
  if (!props.mate.notes) return ''
  if (props.mate.notes.length <= MAX_NOTES_LENGTH) return props.mate.notes
  return `${props.mate.notes.slice(0, MAX_NOTES_LENGTH)}...`
})

const formattedDate = computed(() => {
  return new Date(props.mate.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
})
</script>

<style scoped>
.mate-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background-color: var(--color-surface);
  transition: box-shadow var(--transition-fast);
}

.mate-card:hover {
  box-shadow: var(--shadow-md);
}

.mate-card__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.mate-card__name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.mate-card__notes {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.mate-card__date {
  font-size: var(--font-size-sm);
  color: var(--color-text-disabled);
}

.mate-card__actions {
  display: flex;
  gap: var(--space-2);
}
</style>
