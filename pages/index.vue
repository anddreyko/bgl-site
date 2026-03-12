<template>
  <div class="page-layout">
    <!-- Hero for unauthenticated -->
    <section
      v-if="!user"
      class="home-page__hero"
    >
      <h1 class="home-page__hero-title">
        <AppLogo size="lg" />
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

    <!-- Active play (authenticated only) -->
    <section
      v-if="user && activePlay"
      class="home-page__active"
    >
      <h2 class="home-page__section-title">Now Playing</h2>
      <PlayCard
        :play="activePlay"
        @click="navigateTo(`/plays/${activePlay.id}`)"
      />
    </section>

    <!-- Mini stats -->
    <section
      v-if="stats"
      class="home-page__stats"
    >
      <span class="home-page__stat">{{ stats.totalPlays }} plays</span>
      <span class="home-page__stat-sep">&middot;</span>
      <span class="home-page__stat">{{ stats.uniqueGames }} games</span>
      <span class="home-page__stat-sep">&middot;</span>
      <span class="home-page__stat">{{ stats.uniqueAuthors }} players</span>
      <template v-if="user && myTotal !== null">
        <span class="home-page__stat-sep">&middot;</span>
        <span class="home-page__stat home-page__stat--accent">My plays: {{ myTotal }}</span>
      </template>
    </section>

    <!-- Recent Plays -->
    <section
      v-if="feedPending || feedPlays.length > 0"
      class="home-page__recent"
    >
      <h2 class="home-page__section-title">Recent Plays</h2>

      <!-- Skeleton loading -->
      <div
        v-if="feedPending"
        class="home-page__plays-list"
      >
        <div
          v-for="n in 3"
          :key="n"
          class="home-page__skeleton"
        >
          <div class="home-page__skeleton-header">
            <div class="home-page__skeleton-line home-page__skeleton-line--title" />
            <div class="home-page__skeleton-line home-page__skeleton-line--badge" />
          </div>
          <div class="home-page__skeleton-line home-page__skeleton-line--meta" />
          <div class="home-page__skeleton-line home-page__skeleton-line--players" />
        </div>
      </div>

      <!-- Feed loaded -->
      <template v-else-if="feedPlays.length > 0">
        <div class="home-page__plays-list">
          <PlayCard
            v-for="play in feedPlays"
            :key="play.id"
            :play="play"
            @click="navigateTo(`/plays/${play.id}`)"
          />
        </div>
        <UiPagination
          :page="currentPage"
          :total="feedTotal"
          :size="PAGE_SIZE"
          @update:page="goToPage"
        />
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Play, PaginatedResponse } from '~/types'
import AppLogo from '~/components/AppLogo/index.vue'
import PlayCard from '~/components/PlayCard/index.vue'
import UiButton from '~/components/UiButton/index.vue'
import UiPagination from '~/components/UiPagination/index.vue'

const PAGE_SIZE = 20

const { user } = useAuth()
const { activePlay } = useActivePlay()
const requestFetch = useRequestFetch()

const currentPage = ref(1)

// Public feed
const { data: feedData, pending: feedPending, refresh: refreshFeed } = useAsyncData(
  'home:feed',
  () => requestFetch<PaginatedResponse<Play>>('/api/plays', {
    query: { page: currentPage.value, size: PAGE_SIZE },
  }),
  { default: () => null },
)

// Personal total (authenticated only)
const { data: myData } = useAsyncData(
  'home:my-plays',
  () => $fetch<PaginatedResponse<Play>>('/api/plays', {
    query: { authorId: user.value!.id, size: 1 },
  }),
  { default: () => null, server: false, immediate: !!user.value },
)

const feedPlays = computed(() => feedData.value?.items ?? [])
const feedTotal = computed(() => feedData.value?.total ?? 0)
const myTotal = computed(() => myData.value?.total ?? null)

const stats = computed(() => {
  if (!feedData.value) return null

  const items = feedData.value.items
  const gameIds = new Set<string>()
  const authorIds = new Set<string>()

  for (const play of items) {
    if (play.game?.id) gameIds.add(play.game.id)
    else if (play.gameName) gameIds.add(play.gameName)
    if (play.author?.id) authorIds.add(play.author.id)
  }

  return {
    totalPlays: feedData.value.total,
    uniqueGames: gameIds.size,
    uniqueAuthors: authorIds.size,
  }
})

function goToPage(page: number) {
  currentPage.value = page
  refreshFeed()
}
</script>

<style scoped>
.home-page__section-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 var(--space-3);
}

.home-page__plays-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

@media (width >= 768px) {
  .home-page__plays-list {
    grid-template-columns: repeat(2, 1fr);
  }
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

/* Mini stats */
.home-page__stats {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  flex-wrap: wrap;
}

.home-page__stat {
  white-space: nowrap;
}

.home-page__stat--accent {
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}

.home-page__stat-sep {
  color: var(--color-text-disabled);
}

/* Skeleton */
.home-page__skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.home-page__skeleton-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.home-page__skeleton-line {
  height: 1rem;
  border-radius: var(--radius-sm);
  background: linear-gradient(
    90deg,
    var(--color-bg-secondary) 25%,
    var(--color-bg-tertiary, var(--color-border)) 50%,
    var(--color-bg-secondary) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

.home-page__skeleton-line--title {
  width: 60%;
  height: 1.25rem;
}

.home-page__skeleton-line--badge {
  width: 4rem;
  height: 1.25rem;
}

.home-page__skeleton-line--meta {
  width: 40%;
}

.home-page__skeleton-line--players {
  width: 80%;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
