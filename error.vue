<template>
  <main class="error-page">
    <div class="error-page__content">
      <h1 class="error-page__code">
        {{ error.statusCode }}
      </h1>

      <h2 class="error-page__title">
        {{ title }}
      </h2>

      <p class="error-page__message">
        {{ description }}
      </p>

      <div class="error-page__actions">
        <NuxtLink
          v-if="error.statusCode === 401"
          to="/auth/sign-in"
          class="error-page__link error-page__link--primary"
        >
          Sign In
        </NuxtLink>

        <button
          class="error-page__link error-page__link--secondary"
          @click="handleError"
        >
          {{ error.statusCode === 401 ? 'Go Home' : 'Try Again' }}
        </button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const title = computed(() => {
  switch (props.error.statusCode) {
    case 401: return 'Authentication Required'
    case 403: return 'Access Denied'
    case 404: return 'Page Not Found'
    case 500: return 'Server Error'
    case 502: return 'Service Unavailable'
    default: return 'Something Went Wrong'
  }
})

const description = computed(() => {
  switch (props.error.statusCode) {
    case 401: return 'Please sign in to access this page.'
    case 403: return 'You do not have permission to view this page.'
    case 404: return 'The page you are looking for does not exist or has been moved.'
    case 500: return 'An unexpected error occurred. Please try again later.'
    case 502: return 'The backend service is temporarily unavailable. Please try again.'
    default: return props.error.message || 'An unexpected error occurred.'
  }
})

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<style scoped>
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--space-6);
  font-family: var(--font-family-base);
}

.error-page__content {
  text-align: center;
  max-width: 28rem;
}

.error-page__code {
  font-size: 5rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-text-disabled);
  line-height: 1;
  margin: 0 0 var(--space-2);
}

.error-page__title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-3);
}

.error-page__message {
  font-size: var(--font-size-md);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-6);
  line-height: 1.5;
}

.error-page__actions {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
}

.error-page__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.error-page__link--primary {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
}

.error-page__link--primary:hover {
  background-color: var(--color-primary-hover);
}

.error-page__link--secondary {
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.error-page__link--secondary:hover {
  background-color: var(--color-surface-sunken);
}

.error-page__link:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}
</style>
