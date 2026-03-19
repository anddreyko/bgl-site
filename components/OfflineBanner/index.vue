<script setup lang="ts">
const { isOffline } = useNetworkStatus()
const { pendingCount } = useOfflineStore()
</script>

<template>
  <Transition name="offline-banner">
    <div
      v-if="isOffline"
      class="offline-banner"
      role="status"
      aria-live="polite"
    >
      <span class="offline-banner__icon" aria-hidden="true" />
      <span class="offline-banner__text">
        Offline mode
        <template v-if="pendingCount > 0">
          &middot; {{ pendingCount }} pending {{ pendingCount === 1 ? 'change' : 'changes' }}
        </template>
      </span>
    </div>
  </Transition>
</template>

<style scoped>
.offline-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding-block: var(--space-2);
  padding-inline: var(--space-4);
  background-color: var(--color-warning-bg, #fef3c7);
  color: var(--color-warning-text, #92400e);
  font-size: var(--font-size-sm);
  line-height: 1.4;
}

.offline-banner__icon {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: currentcolor;
  flex-shrink: 0;
  animation: offline-pulse 2s ease-in-out infinite;
}

.offline-banner__text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@keyframes offline-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.offline-banner-enter-active,
.offline-banner-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.offline-banner-enter-from,
.offline-banner-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
