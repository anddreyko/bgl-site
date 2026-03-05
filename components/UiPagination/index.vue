<template>
  <nav
    v-if="totalPages > 1"
    class="ui-pagination"
    aria-label="Pagination"
  >
    <ul class="ui-pagination__list">
      <li class="ui-pagination__item">
        <button
          class="ui-pagination__btn"
          :disabled="page <= 1"
          aria-label="Previous page"
          @click="$emit('update:page', page - 1)"
        >
          &laquo;
        </button>
      </li>
      <template
        v-for="item in visiblePages"
        :key="item"
      >
        <li
          v-if="item === '...'"
          class="ui-pagination__item"
        >
          <span class="ui-pagination__ellipsis">...</span>
        </li>
        <li
          v-else
          class="ui-pagination__item"
        >
          <button
            class="ui-pagination__btn"
            :class="{ 'ui-pagination__btn--active': item === page }"
            :aria-current="item === page ? 'page' : undefined"
            @click="$emit('update:page', item as number)"
          >
            {{ item }}
          </button>
        </li>
      </template>
      <li class="ui-pagination__item">
        <button
          class="ui-pagination__btn"
          :disabled="page >= totalPages"
          aria-label="Next page"
          @click="$emit('update:page', page + 1)"
        >
          &raquo;
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  page: number
  total: number
  size: number
}>()

defineEmits<{
  'update:page': [value: number]
}>()

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.size)))

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const tp = totalPages.value
  const p = props.page

  if (tp <= 7) {
    for (let i = 1; i <= tp; i++) pages.push(i)
    return pages
  }

  pages.push(1)
  if (p > 3) pages.push('...')

  const start = Math.max(2, p - 1)
  const end = Math.min(tp - 1, p + 1)
  for (let i = start; i <= end; i++) pages.push(i)

  if (p < tp - 2) pages.push('...')
  pages.push(tp)

  return pages
})
</script>

<style scoped>
.ui-pagination__list {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  list-style: none;
  padding: 0;
  margin: 0;
}

.ui-pagination__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  padding: var(--space-1) var(--space-2);
  font-size: var(--font-size-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.ui-pagination__btn:hover:not(:disabled) {
  background-color: var(--color-surface-sunken);
}

.ui-pagination__btn--active {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  border-color: var(--color-primary);
}

.ui-pagination__btn--active:hover {
  background-color: var(--color-primary-hover);
}

.ui-pagination__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.ui-pagination__ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  color: var(--color-text-secondary);
}
</style>
