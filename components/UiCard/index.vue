<template>
  <div
    class="ui-card"
    :class="{ 'ui-card--clickable': clickable }"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
    @click="handleClick"
    @keydown.enter="handleClick"
  >
    <div
      v-if="$slots.header"
      class="ui-card__header"
    >
      <slot name="header" />
    </div>
    <div class="ui-card__body">
      <slot />
    </div>
    <div
      v-if="$slots.footer"
      class="ui-card__footer"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  clickable?: boolean
}>(), {
  clickable: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent | KeyboardEvent]
}>()

function handleClick(event: MouseEvent | KeyboardEvent) {
  if (props.clickable) {
    emit('click', event)
  }
}
</script>

<style scoped>
.ui-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.ui-card--clickable {
  cursor: pointer;
  transition: box-shadow var(--transition-fast), border-color var(--transition-fast);
}

.ui-card--clickable:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary);
}

.ui-card__header {
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.ui-card__body {
  padding: var(--space-4);
}

.ui-card__footer {
  padding: var(--space-4);
  border-top: 1px solid var(--color-border);
  background-color: var(--color-surface-raised);
}
</style>
