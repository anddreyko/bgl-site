<template>
  <nav class="main-menu">
    <div class="main-menu__brand">
      <NuxtLink to="/">4Record</NuxtLink>
    </div>
    <ul class="main-menu__links">
      <li>
        <NuxtLink
          to="/"
          class="main-menu__link"
        >Home</NuxtLink>
      </li>
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
          to="/plays"
          class="main-menu__link"
        >Plays</NuxtLink>
      </li>
      <li>
        <NuxtLink
          to="/about"
          class="main-menu__link"
        >About</NuxtLink>
      </li>
      <li>
        <NuxtLink
          to="/user"
          class="main-menu__link"
        >Profile</NuxtLink>
      </li>
    </ul>
    <div
      v-if="activePlay"
      class="main-menu__active-play"
    >
      <UiTimer
        :started-at="activePlay.startedAt"
        :running="true"
      />
    </div>
    <UiButton
      variant="record"
      size="sm"
      @click="$emit('record')"
    >
      Record
    </UiButton>
  </nav>
</template>

<script setup lang="ts">
import UiButton from '~/components/UiButton/index.vue'
import UiTimer from '~/components/UiTimer/index.vue'

defineProps<{
  activePlay?: { id: string, startedAt: string } | null
}>()

defineEmits<{
  record: []
}>()
</script>

<style scoped>
.main-menu {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) 0;
}

.main-menu__brand {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
}

.main-menu__brand a {
  color: var(--color-record);
  text-decoration: none;
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
}

.main-menu__link:hover {
  color: var(--color-text-primary);
  text-decoration: none;
}

.main-menu__active-play {
  display: flex;
  align-items: center;
}
</style>
