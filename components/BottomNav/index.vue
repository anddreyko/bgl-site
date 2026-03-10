<template>
  <nav
    class="bottom-nav"
    aria-label="Mobile navigation"
  >
    <NuxtLink
      to="/game"
      class="bottom-nav__item"
      :class="{ 'bottom-nav__item--active': route.path.startsWith('/game') }"
    >
      <svg
        class="bottom-nav__icon"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect
          x="3"
          y="3"
          width="7"
          height="7"
          rx="1"
        />
        <rect
          x="14"
          y="3"
          width="7"
          height="7"
          rx="1"
        />
        <rect
          x="3"
          y="14"
          width="7"
          height="7"
          rx="1"
        />
        <rect
          x="14"
          y="14"
          width="7"
          height="7"
          rx="1"
        />
      </svg>
      <span class="bottom-nav__label">Games</span>
    </NuxtLink>
    <NuxtLink
      to="/mates"
      class="bottom-nav__item"
      :class="{ 'bottom-nav__item--active': route.path.startsWith('/mates') }"
    >
      <svg
        class="bottom-nav__icon"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle
          cx="9"
          cy="7"
          r="4"
        />
        <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        <path d="M21 21v-2a4 4 0 0 0-3-3.87" />
      </svg>
      <span class="bottom-nav__label">Mates</span>
    </NuxtLink>
    <button
      class="bottom-nav__item bottom-nav__item--record"
      :class="{ 'bottom-nav__item--active-play': activePlay }"
      @click="$emit('record')"
    >
      <span class="bottom-nav__record-dot" />
      <span class="bottom-nav__label">Record</span>
    </button>
    <NuxtLink
      to="/places"
      class="bottom-nav__item"
      :class="{ 'bottom-nav__item--active': route.path.startsWith('/places') }"
    >
      <svg
        class="bottom-nav__icon"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle
          cx="12"
          cy="10"
          r="3"
        />
      </svg>
      <span class="bottom-nav__label">Places</span>
    </NuxtLink>
    <NuxtLink
      to="/plays"
      class="bottom-nav__item"
      :class="{ 'bottom-nav__item--active': route.path.startsWith('/plays') }"
    >
      <svg
        class="bottom-nav__icon"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line
          x1="16"
          y1="13"
          x2="8"
          y2="13"
        />
        <line
          x1="16"
          y1="17"
          x2="8"
          y2="17"
        />
      </svg>
      <span class="bottom-nav__label">Plays</span>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import type { Play } from '~/types'

defineProps<{
  activePlay?: Play | null
}>()

defineEmits<{
  record: []
}>()

const route = useRoute()
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: none;
  background-color: var(--color-surface);
  border-top: 1px solid var(--color-border);
  z-index: var(--z-fab);
  padding-bottom: env(safe-area-inset-bottom);
}

.bottom-nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  flex: 1;
  padding: var(--space-2) 0;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: var(--font-size-xs);
  background: none;
  border: none;
  cursor: pointer;
  transition: color var(--transition-fast);
}

.bottom-nav__item--active {
  color: var(--color-primary);
}

.bottom-nav__item--record {
  color: var(--color-record);
}

.bottom-nav__record-dot {
  width: 20px;
  height: 20px;
  border-radius: var(--radius-full);
  background-color: var(--color-record);
}

.bottom-nav__item--active-play .bottom-nav__record-dot {
  animation: bottom-nav-pulse 1.5s ease-in-out infinite;
}

.bottom-nav__label {
  font-weight: var(--font-weight-medium);
}

.bottom-nav__icon {
  flex-shrink: 0;
}

@media (width <= 768px) {
  .bottom-nav {
    display: flex;
  }
}

@keyframes bottom-nav-pulse {
  0%, 100% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }
}
</style>
