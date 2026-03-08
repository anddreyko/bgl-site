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
      <div class="app-layout__container">
        <MainMenu
          :active-play="activePlay"
          :user="user"
          @record="handleRecord"
        />
      </div>
    </header>
    <div class="app-layout__breadcrumbs app-layout__container">
      <AppBreadcrumbs />
    </div>
    <main class="app-layout__main app-layout__container">
      <slot />
    </main>
    <footer class="app-layout__footer">
      <div class="app-layout__container">
        ver {{ app?.version }}
      </div>
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

.app-layout__container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--space-8);
}

.app-layout__header {
  border-bottom: 1px solid var(--color-border);
}

.app-layout__main {
  flex: 1;
  padding-top: var(--space-4);
  padding-bottom: var(--space-4);
}

.app-layout__footer {
  border-top: 1px solid var(--color-border);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  padding: var(--space-4) 0;
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
