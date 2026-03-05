<script setup lang="ts">
import MainMenu from '~/components/MainMenu/index.vue'

const app = useAppConfig()
</script>

<template>
  <div class="app-layout">
    <header class="app-layout__header">
      <MainMenu />
    </header>
    <main class="app-layout__main">
      <slot />
    </main>
    <footer class="app-layout__footer">
      ver {{ app?.version }} | Contact: <NuxtLink to="/user/admin">admin</NuxtLink>
    </footer>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-layout__header {
  padding: 0 var(--space-8);
  border-bottom: 1px solid var(--color-border);
}

.app-layout__main {
  flex: 1;
  padding: var(--space-8);
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

.app-layout__footer {
  padding: var(--space-4) var(--space-8);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  border-top: 1px solid var(--color-border);
}
</style>
