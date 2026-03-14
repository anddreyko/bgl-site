<template>
  <nav class="main-menu">
    <AppLogo>
      <RecordButton
        :active-play="activePlay"
        @click="onRecord"
      />
    </AppLogo>
    <ul class="main-menu__links">
      <li>
        <NuxtLink
          to="/game"
          class="main-menu__link"
        >Games</NuxtLink>
      </li>
      <li>
        <NuxtLink
          to="/mates"
          class="main-menu__link"
        >Mates</NuxtLink>
      </li>
      <li>
        <NuxtLink
          to="/places"
          class="main-menu__link"
        >Places</NuxtLink>
      </li>
      <li>
        <NuxtLink
          to="/plays"
          class="main-menu__link"
        >Plays</NuxtLink>
      </li>
    </ul>
    <UserAvatar
      v-if="user"
      :name="user.name || user.email || '?'"
      size="md"
      :to="`/user/${user.nickname ?? user.id}`"
    />
    <NuxtLink
      v-else
      to="/auth/sign-in"
      class="main-menu__link"
    >
      Sign In
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import AppLogo from '~/components/AppLogo/index.vue'
import RecordButton from '~/components/RecordButton/index.vue'
import UserAvatar from '~/components/UserAvatar/index.vue'

import type { Play, User } from '~/types'

defineProps<{
  activePlay?: Play | null
  user?: User | null
}>()

const emit = defineEmits<{
  record: []
}>()

function onRecord() {
  emit('record')
}
</script>

<style scoped>
.main-menu {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) 0;
}

.main-menu__links {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
}

.main-menu__link {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color var(--transition-fast);
  white-space: nowrap;
}

.main-menu__link:hover {
  color: var(--color-text-primary);
  text-decoration: none;
}

@media (width <= 768px) {
  .main-menu {
    gap: var(--space-2);
    justify-content: space-between;
  }

  .main-menu__links {
    display: none;
  }
}
</style>
