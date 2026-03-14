<script setup lang="ts">
import type { User, Play, PaginatedResponse } from '~/types'
import { ref } from 'vue'
import PlayCard from '~/components/PlayCard/index.vue'
import UserAvatar from '~/components/UserAvatar/index.vue'
import UiSpinner from '~/components/UiSpinner/index.vue'
import UiPagination from '~/components/UiPagination/index.vue'

const route = useRoute()
const param = computed(() => String(route.params.id))

const { set: setBreadcrumb, clear: clearBreadcrumb } = useBreadcrumbLabel()

const PAGE_SIZE = 20
const { currentPage } = usePageQuery()
const totalPlays = ref(0)

const { data: user, status } = useFetch<User>(() => `/api/user/${param.value}`, { lazy: true })

const requestFetch = useRequestFetch()
const { data: playsData, status: playsStatus } = useAsyncData(
  `user-plays-${param.value}`,
  async () => {
    const data = await requestFetch<PaginatedResponse<Play>>('/api/plays', {
      query: { page: currentPage.value, size: PAGE_SIZE, authorId: param.value },
    })
    totalPlays.value = data.total
    return data.items
  },
  { lazy: true, watch: [currentPage] },
)

setBreadcrumb(param.value)
watch(user, (u) => {
  if (u) setBreadcrumb(u.name ?? param.value)
})

onUnmounted(() => clearBreadcrumb())

const memberSince = computed(() => {
  if (!user.value?.createdAt) return ''
  return new Date(user.value.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const plays = computed(() => playsData.value ?? [])
const playsLoading = computed(() => playsStatus.value === 'pending')
</script>

<template>
  <section
    class="page-layout"
    aria-labelledby="public-profile-heading"
  >
    <!-- Profile header -->
    <div
      v-if="status === 'pending'"
      class="public-profile__loading"
    >
      <UiSpinner size="lg" />
      <p>Loading profile...</p>
    </div>

    <div
      v-else-if="user"
      class="public-profile__header"
    >
      <UserAvatar
        :name="user.name || user.email"
        size="lg"
        :to="`/user/${user.nickname ?? user.id}`"
      />
      <div class="public-profile__info">
        <h1
          id="public-profile-heading"
          class="public-profile__name"
        >
          {{ user.name }}
        </h1>
        <p
          v-if="memberSince"
          class="public-profile__since"
        >
          Member since {{ memberSince }}
        </p>
      </div>
    </div>

    <div
      v-else
      class="public-profile__header"
    >
      <UserAvatar
        :name="param"
        size="lg"
      />
      <h1
        id="public-profile-heading"
        class="public-profile__name"
      >
        {{ param }}
      </h1>
    </div>

    <!-- Plays (always rendered, independent of profile) -->
    <section class="public-profile__plays">
      <h2 class="public-profile__section-title">
        Plays
      </h2>

      <UiSpinner
        v-if="playsLoading"
        size="md"
      />

      <p
        v-else-if="plays.length === 0"
        class="public-profile__empty"
      >
        No plays yet.
      </p>

      <div
        v-else
        class="public-profile__plays-list"
      >
        <PlayCard
          v-for="play in plays"
          :key="play.id"
          :play="play"
          @click="navigateTo(`/plays/${play.id}`)"
        />
      </div>
      <UiPagination
        :page="currentPage"
        :total="totalPlays"
        :size="PAGE_SIZE"
        @update:page="currentPage = $event"
      />
    </section>
  </section>
</template>

<style scoped>
.public-profile__header {
  display: flex;
  align-items: center;
  gap: var(--space-5);
}

.public-profile__info {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.public-profile__name {
  margin: 0;
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.public-profile__since {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.public-profile__section-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 var(--space-4);
  color: var(--color-text-primary);
}

.public-profile__plays-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

@media (width >= 768px) {
  .public-profile__plays-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

.public-profile__empty {
  color: var(--color-text-secondary);
  font-size: var(--font-size-md);
  margin: 0;
}

.public-profile__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-12) 0;
  color: var(--color-text-secondary);
}
</style>
