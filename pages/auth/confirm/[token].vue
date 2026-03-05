<script setup lang="ts">
import UiSpinner from '~/components/UiSpinner/index.vue'
import UiButton from '~/components/UiButton/index.vue'

definePageMeta({ layout: 'auth' })

useHead({ title: 'Confirm Email' })

const route = useRoute()
const token = computed(() => route.params.token as string)

const { status: fetchStatus, error: fetchError } = await useAsyncData(
  `confirm-${token.value}`,
  () => $fetch(`/api/auth/confirm/${token.value}`),
  { server: false },
)

const status = computed<'loading' | 'success' | 'error'>(() => {
  if (fetchStatus.value === 'pending' || fetchStatus.value === 'idle') return 'loading'
  if (fetchError.value) return 'error'
  return 'success'
})

const errorMessage = computed(() => {
  if (!fetchError.value) return ''
  return fetchError.value.message || 'Confirmation failed. The link may be expired or invalid.'
})
</script>

<template>
  <div class="confirm">
    <h1 class="confirm__title">
      Email Confirmation
    </h1>

    <div
      v-if="status === 'loading'"
      class="confirm__loading"
    >
      <UiSpinner size="lg" />
      <p class="confirm__text">
        Confirming your email...
      </p>
    </div>

    <div
      v-else-if="status === 'success'"
      class="confirm__result"
      role="status"
    >
      <p class="confirm__text confirm__text--success">
        Email confirmed! You can now sign in.
      </p>
      <NuxtLink to="/auth/sign-in">
        <UiButton
          variant="primary"
          size="lg"
          class="confirm__action"
        >
          Go to Sign In
        </UiButton>
      </NuxtLink>
    </div>

    <div
      v-else
      class="confirm__result"
      role="alert"
    >
      <p class="confirm__text confirm__text--error">
        {{ errorMessage }}
      </p>
      <NuxtLink to="/auth/sign-in">
        <UiButton
          variant="secondary"
          size="lg"
          class="confirm__action"
        >
          Go to Sign In
        </UiButton>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.confirm__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-6);
  text-align: center;
}

.confirm__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-6) 0;
}

.confirm__result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) 0;
}

.confirm__text {
  font-size: var(--font-size-md);
  color: var(--color-text-secondary);
  text-align: center;
  margin: 0;
}

.confirm__text--success {
  color: var(--color-text-primary);
}

.confirm__text--error {
  color: var(--color-danger);
}

.confirm__action {
  width: 100%;
}
</style>
