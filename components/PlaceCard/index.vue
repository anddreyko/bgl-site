<template>
  <article class="place-card">
    <div class="place-card__body">
      <h3 class="place-card__name">{{ place.name }}</h3>
      <p
        v-if="place.address"
        class="place-card__address"
      >
        {{ place.address }}
      </p>
      <p
        v-if="place.notes"
        class="place-card__notes"
      >
        {{ truncatedNotes }}
      </p>
      <a
        v-if="place.url"
        :href="place.url"
        class="place-card__url"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ displayUrl }}
      </a>
      <time
        class="place-card__date"
        :datetime="place.createdAt"
      >
        Added {{ formattedDate }}
      </time>
    </div>
    <div class="place-card__actions">
      <UiButton
        variant="ghost"
        size="sm"
        aria-label="Edit place"
        @click="$emit('edit', place)"
      >
        Edit
      </UiButton>
      <UiButton
        variant="ghost"
        size="sm"
        aria-label="Delete place"
        @click="$emit('delete', place)"
      >
        Delete
      </UiButton>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Place } from '~/types'
import UiButton from '~/components/UiButton/index.vue'

const props = defineProps<{
  place: Place
}>()

defineEmits<{
  edit: [place: Place]
  delete: [place: Place]
}>()

const MAX_NOTES_LENGTH = 100

const truncatedNotes = computed(() => {
  if (!props.place.notes) return ''
  if (props.place.notes.length <= MAX_NOTES_LENGTH) return props.place.notes
  return `${props.place.notes.slice(0, MAX_NOTES_LENGTH)}...`
})

const formattedDate = computed(() => {
  return new Date(props.place.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
})

const displayUrl = computed(() => {
  if (!props.place.url) return ''
  try {
    return new URL(props.place.url).hostname
  }
  catch {
    return props.place.url
  }
})
</script>

<style scoped>
.place-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background-color: var(--color-surface);
  transition: box-shadow var(--transition-fast);
}

.place-card:hover {
  box-shadow: var(--shadow-md);
}

.place-card__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.place-card__name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.place-card__address {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.place-card__notes {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.place-card__url {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  text-decoration: none;
}

.place-card__url:hover {
  text-decoration: underline;
}

.place-card__date {
  font-size: var(--font-size-sm);
  color: var(--color-text-disabled);
}

.place-card__actions {
  display: flex;
  gap: var(--space-2);
}
</style>
