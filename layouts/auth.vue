<script setup lang="ts">
const app = useAppConfig()
</script>

<template>
  <div class="auth-layout">
    <main class="auth-layout__main">
      <div class="auth-layout__container">
        <NuxtLink
          to="/"
          class="auth-layout__logo"
          aria-label="Go to home page"
        >
          {{ app?.name }}
        </NuxtLink>
        <div class="auth-layout__card">
          <slot />
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.auth-layout {
  display: flex;
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

.auth-layout__logo {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  text-decoration: none;
}

.auth-layout__logo:hover {
  opacity: 0.8;
}

.auth-layout__card {
  width: 100%;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--space-6);
}
</style>
