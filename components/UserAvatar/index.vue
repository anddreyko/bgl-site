<template>
  <NuxtLink
    :to="to"
    class="user-avatar"
    :class="`user-avatar--${size}`"
    :style="{ backgroundColor: colors.bg, color: colors.text }"
    :aria-label="`Profile: ${name}`"
  >
    {{ initials }}
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { colorFromString, getInitials } from '~/utils/color-from-string'

const props = withDefaults(defineProps<{
  name: string
  size?: 'sm' | 'md' | 'lg'
  to?: string
}>(), {
  size: 'md',
  to: '/user/me',
})

const initials = computed(() => getInitials(props.name))
const colors = computed(() => colorFromString(props.name))
</script>

<style scoped>
.user-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  line-height: 1;
  flex-shrink: 0;
  transition: opacity var(--transition-fast);
}

.user-avatar:hover {
  opacity: 0.85;
}

.user-avatar--sm {
  width: var(--avatar-sm);
  height: var(--avatar-sm);
  font-size: var(--font-size-xs);
}

.user-avatar--md {
  width: var(--avatar-md);
  height: var(--avatar-md);
  font-size: var(--font-size-sm);
}

.user-avatar--lg {
  width: var(--avatar-lg);
  height: var(--avatar-lg);
  font-size: var(--font-size-lg);
}
</style>
