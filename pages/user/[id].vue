<script setup lang="ts">
import type { User } from '~/types'

const route = useRoute()
const userId = computed(() => String(route.params.id))

const { data: user, status, error } = await useFetch<User>(() => `/api/user/${userId.value}`)

const memberSince = computed(() => {
  if (!user.value?.createdAt) return ''
  return new Date(user.value.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})
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
      <h1
        id="public-profile-heading"
        class="public-profile__heading"
      >
        {{ user.name }}
      </h1>

      <div class="public-profile__card">
        <dl class="public-profile__details">
          <div class="public-profile__detail">
            <dt class="public-profile__label">
              Name
            </dt>
            <dd class="public-profile__value">
              {{ user.name }}
            </dd>
          </div>

          <div class="public-profile__detail">
            <dt class="public-profile__label">
              Member since
            </dt>
            <dd class="public-profile__value">
              {{ memberSince }}
            </dd>
          </div>
        </dl>
      </div>
    </template>
  </section>
</template>

<style scoped>
.public-profile {
  max-width: 40rem;
  margin: 0 auto;
  padding: var(--space-6) var(--space-4);
}

.public-profile__heading {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-6);
  color: var(--color-text-primary);
}

.public-profile__card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}

.public-profile__details {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.public-profile__detail {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.public-profile__label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

.public-profile__value {
  margin: 0;
  font-size: var(--font-size-md);
  color: var(--color-text-primary);
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
