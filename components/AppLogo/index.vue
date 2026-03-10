<template>
  <component
    :is="isHome ? 'span' : NuxtLink"
    v-bind="isHome ? {} : { 'to': '/', 'aria-label': 'Go to home page' }"
    class="app-logo"
    :class="sizeClass"
  >
    <span class="app-logo__text">For the</span>
    <slot>
      <span class="app-logo__record">Record</span>
    </slot>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NuxtLink } from '#components'

const props = withDefaults(defineProps<{
  size?: 'md' | 'lg'
}>(), {
  size: 'md',
})

const route = useRoute()
const isHome = computed(() => route.path === '/')
const sizeClass = computed(() => `app-logo--${props.size}`)
</script>

<style scoped>
.app-logo {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  text-decoration: none;
}

.app-logo:hover {
  text-decoration: none;
}

a.app-logo:hover {
  opacity: 0.8;
}

.app-logo__record {
  color: var(--color-record);
}

.app-logo--lg {
  font-size: var(--font-size-2xl);
}
</style>
