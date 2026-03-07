<script setup lang="ts">
import MainMenu from '~/components/MainMenu/index.vue'
import AppBreadcrumbs from '~/components/AppBreadcrumbs/index.vue'
import RecordDialog from '~/components/RecordDialog/index.vue'
import UiFloatingAction from '~/components/UiFloatingAction/index.vue'

const app = useAppConfig()
const { user } = useAuth()
const { activePlay, checkActivePlay } = useActivePlay()
const { open: openRecord } = useRecordDialog()

function handleRecord() {
  if (activePlay.value) {
    navigateTo(`/plays/${activePlay.value.id}`)
  }
  else {
    openRecord()
  }
}

onMounted(() => {
  if (user.value) {
    checkActivePlay()
  }
})
</script>

<template>
  <div class="app-layout">
    <header class="app-layout__header">
      <MainMenu
        :active-play="activePlay"
        :user="user"
        @record="handleRecord"
      />
    </header>
    <div class="app-layout__breadcrumbs">
      <AppBreadcrumbs />
    </div>
    <main class="app-layout__main">
      <slot />
    </main>
    <footer class="app-layout__footer">
      ver {{ app?.version }}
    </footer>
    <RecordDialog />
    <UiFloatingAction
      class="app-layout__fab"
      :active="!!activePlay"
      @click="handleRecord"
    />
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

.app-layout__breadcrumbs {
  padding: 0 var(--space-8);
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

.app-layout__main {
  flex: 1;
  padding: var(--space-4) var(--space-8);
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

/* FAB visible only on mobile */
.app-layout__fab {
  display: none;
}

@media (width <= 768px) {
  .app-layout__fab {
    display: inline-flex;
  }
}
</style>
