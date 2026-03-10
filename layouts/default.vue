<script setup lang="ts">
import MainMenu from '~/components/MainMenu/index.vue'
import AppBreadcrumbs from '~/components/AppBreadcrumbs/index.vue'
import RecordDialog from '~/components/RecordDialog/index.vue'
import BottomNav from '~/components/BottomNav/index.vue'

const { user } = useAuth()
const { activePlay, checkActivePlay } = useActivePlay()
const { open: openRecord } = useRecordDialog()
const { backendOnline, backendVersion, gitHash, stageEnvLabel, checkBackend } = useAppStatus()

function handleRecord() {
  if (activePlay.value) {
    navigateTo(`/plays/${activePlay.value.id}`)
  }
  else {
    openRecord()
  }
}

onMounted(() => {
  checkBackend()
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
        <span class="app-layout__footer-content">
          <span
            class="app-layout__status-dot"
            :class="backendOnline ? 'app-layout__status-dot--ok' : 'app-layout__status-dot--err'"
          />
          <template v-if="backendOnline">
            {{ stageEnvLabel }} · {{ backendVersion }} · {{ gitHash }}
          </template>
          <template v-else>
            {{ stageEnvLabel }} · offline · {{ gitHash }}
          </template>
        </span>
      </div>
    </footer>
    <RecordDialog />
    <BottomNav
      :active-play="activePlay"
      @record="handleRecord"
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

.app-layout__footer-content {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

.app-layout__status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  translate: 0 1px;
}

.app-layout__status-dot--ok {
  background-color: #22c55e;
}

.app-layout__status-dot--err {
  background-color: #ef4444;
}

@media (width <= 768px) {
  .app-layout__container {
    padding: 0 var(--space-4);
  }

  .app-layout__footer {
    padding-bottom: calc(var(--space-4) + 60px);
  }
}
</style>
