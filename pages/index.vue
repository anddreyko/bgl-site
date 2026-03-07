<template>
  <div class="home-page">
    <!-- Authenticated -->
    <template v-if="user">
      <section class="home-page__welcome">
        <h1 class="home-page__greeting">
          Welcome back, {{ user.name }}
        </h1>
      </section>

      <!-- Active play -->
      <section
        v-if="activePlay"
        class="home-page__active"
      >
        <h2 class="home-page__section-title">Now Playing</h2>
        <PlayCard
          :play="activePlay"

          @click="navigateTo(`/plays/${activePlay.id}`)"
        />
      </section>

      <!-- Recent plays -->
      <section
        v-if="recentPlays.length > 0"
        class="home-page__recent"
      >
        <h2 class="home-page__section-title">Recent Plays</h2>
        <div class="home-page__plays-list">
          <PlayCard
            v-for="play in recentPlays"
            :key="play.id"
            :play="play"

            @click="navigateTo(`/plays/${play.id}`)"
          />
        </div>
        <UiPagination
          :page="currentPage"
          :total="totalPlays"
          :size="PAGE_SIZE"
          @update:page="goToPage"
        />
      </section>

      <!-- Quick actions -->
      <section class="home-page__actions">
        <UiButton
          variant="record"
          @click="openRecord"
        >
          Record a Play
        </UiButton>
        <UiButton
          variant="secondary"
          @click="navigateTo('/game')"
        >
          Browse Games
        </UiButton>
      </section>
    </template>

    <!-- Not authenticated -->
    <template v-else>
      <section class="home-page__hero">
        <h1 class="home-page__hero-title">
          For the <span class="home-page__hero-accent">Record</span>
        </h1>
        <p class="home-page__hero-text">
          Track your board game plays, stats, and victories.
        </p>
        <div class="home-page__hero-actions">
          <UiButton
            variant="primary"
            @click="navigateTo('/auth/sign-in')"
          >
            Sign In
          </UiButton>
          <UiButton
            variant="secondary"
            @click="navigateTo('/auth/sign-up')"
          >
            Sign Up
          </UiButton>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Play, PaginatedResponse } from '~/types'
import PlayCard from '~/components/PlayCard/index.vue'
import UiButton from '~/components/UiButton/index.vue'
import UiPagination from '~/components/UiPagination/index.vue'

const PAGE_SIZE = 5

const { user } = useAuth()
const { activePlay } = useActivePlay()
const { open: openRecord } = useRecordDialog()

const recentPlays = ref<Play[]>([])
const currentPage = ref(1)
const totalPlays = ref(0)

async function fetchPlays(page: number) {
  try {
    const data = await $fetch<PaginatedResponse<Play>>('/api/plays', {
      query: { page, size: PAGE_SIZE },
    })
    const items = data.items

    if (page === 1) {
      const first = items[0]
      if (first && !first.finishedAt && first.status === 'draft') {
        activePlay.value = first
        recentPlays.value = items.slice(1)
      }
      else {
        activePlay.value = null
        recentPlays.value = items
      }
    }
    else {
      recentPlays.value = items
    }

    totalPlays.value = data.total
    currentPage.value = page
  }
  catch {
    activePlay.value = null
    recentPlays.value = []
  }
}

function goToPage(page: number) {
  fetchPlays(page)
}

onMounted(() => {
  if (!user.value) return
  fetchPlays(1)
})
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.home-page__greeting {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  margin: 0;
}

.home-page__section-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 var(--space-3);
}

.home-page__plays-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.home-page__actions {
  display: flex;
  gap: var(--space-3);
}

/* Hero for unauthenticated */
.home-page__hero {
  text-align: center;
  padding: var(--space-16) 0;
}

.home-page__hero-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--space-3);
}

.home-page__hero-accent {
  color: var(--color-record);
}

.home-page__hero-text {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-6);
}

.home-page__hero-actions {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
}
</style>
