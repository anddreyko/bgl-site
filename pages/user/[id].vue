<script setup lang="ts">
import type { User, Play, PaginatedResponse } from '~/types'
import PlayCard from '~/components/PlayCard/index.vue'
import UserAvatar from '~/components/UserAvatar/index.vue'
import UiSpinner from '~/components/UiSpinner/index.vue'

const route = useRoute()
const param = computed(() => String(route.params.id))

const { set: setBreadcrumb, clear: clearBreadcrumb } = useBreadcrumbLabel()

const { data: user, status, error } = await useFetch<User>(() => `/api/user/${param.value}`)

watch(user, (u) => {
  if (u) setBreadcrumb(u.name ?? 'User')
}, { immediate: true })

onUnmounted(() => clearBreadcrumb())

const memberSince = computed(() => {
  if (!user.value?.createdAt) return ''
  return new Date(user.value.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const { data: playsData, status: playsStatus } = await useAsyncData(
  `user-plays-${param.value}`,
  async () => {
    if (!user.value) return null
    const data = await $fetch<PaginatedResponse<Play>>('/api/plays', {
      query: { page: 1, size: 20, authorId: user.value.id },
    })
    return data.items.map(play => ({
      ...play,
      author: play.author ?? { id: user.value!.id, name: user.value!.name },
    }))
  },
)

const plays = computed(() => playsData.value ?? [])
const playsLoading = computed(() => playsStatus.value === 'pending')
</script>

<template>
  <section
    class="public-profile"
    aria-labelledby="public-profile-heading"
  >
    <div
      v-if="status === 'pending'"
      class="public-profile__loading"
    >
      <UiSpinner size="lg" />
      <p>Loading profile...</p>
    </div>

    <div
      v-else-if="error"
      class="public-profile__error"
      role="alert"
    >
      <h1 id="public-profile-heading">
        User not found
      </h1>
      <p class="public-profile__error-text">
        The user profile you are looking for does not exist or is not available.
      </p>
      <NuxtLink
        to="/"
        class="public-profile__back-link"
      >
        Back to Home
      </NuxtLink>
    </div>

    <template v-else-if="user">
      <div class="public-profile__header">
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

      <!-- Plays -->
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
      </section>
    </template>
  </section>
</template>

<style scoped>
.public-profile {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

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
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
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

.public-profile__error {
  text-align: center;
  padding: var(--space-12) 0;
}

.public-profile__error-text {
  color: var(--color-text-secondary);
  margin-bottom: var(--space-4);
}

.public-profile__back-link {
  color: var(--color-primary);
  text-decoration: underline;
}
</style>
