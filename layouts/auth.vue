<script setup lang="ts">
import AppLogo from '~/components/AppLogo/index.vue'

const { backendOnline, backendVersion, gitHash, stageEnvLabel, checkBackend } = useAppStatus()

onMounted(() => {
  checkBackend()
})
</script>

<template>
  <div class="auth-layout">
    <main class="auth-layout__main">
      <div class="auth-layout__container">
        <AppLogo size="lg" />
        <div class="auth-layout__card">
          <slot />
        </div>
      </div>
    </main>
    <footer class="auth-layout__footer">
      <span class="auth-layout__footer-content">
        <span
          class="auth-layout__status-dot"
          :class="backendOnline ? 'auth-layout__status-dot--ok' : 'auth-layout__status-dot--err'"
        />
        <template v-if="backendOnline">
          {{ stageEnvLabel }} · {{ backendVersion }} · {{ gitHash }}
        </template>
        <template v-else>
          {{ stageEnvLabel }} · offline · {{ gitHash }}
        </template>
      </span>
    </footer>
  </div>
</template>

<style scoped>
.auth-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-surface-sunken);
}

.auth-layout__main {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

.auth-layout__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
  width: 100%;
  max-width: 400px;
}

.auth-layout__card {
  width: 100%;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--space-6);
}

.auth-layout__footer {
  border-top: 1px solid var(--color-border);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  padding: var(--space-4);
  text-align: center;
}

.auth-layout__footer-content {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

.auth-layout__status-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.auth-layout__status-dot--ok {
  background-color: var(--color-success);
}

.auth-layout__status-dot--err {
  background-color: var(--color-danger);
}
</style>
