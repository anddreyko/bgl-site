<script setup lang="ts">
import UiSpinner from '~/components/UiSpinner/index.vue'
import UiButton from '~/components/UiButton/index.vue'
import UiInput from '~/components/UiInput/index.vue'
import UiFormField from '~/components/UiFormField/index.vue'
import { getErrorMessage } from '~/utils/error-message'

definePageMeta({ layout: 'auth' })

useHead({ title: 'Confirm Email' })

const route = useRoute()
const urlToken = route.params.token as string

const manualCode = ref('')
const manualStatus = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const manualError = ref('')

type ConfirmResult = { ok: boolean }

const { error, status: fetchStatus } = await useAsyncData<ConfirmResult>(
  `confirm-${urlToken}`,
  () => $fetch<ConfirmResult>(`/api/auth/confirm/${urlToken}`),
  { server: false },
)

const status = computed(() => {
  if (manualStatus.value !== 'idle') return manualStatus.value
  if (fetchStatus.value === 'pending' || fetchStatus.value === 'idle') return 'loading'
  if (error.value) return 'error'
  return 'success'
})

const errorMessage = computed(() => {
  if (manualError.value) return manualError.value
  if (!error.value) return ''
  return getErrorMessage(error.value, 'Confirmation failed. The code may be expired or invalid.')
})

watch(status, async (val) => {
  if (val === 'success') {
    await navigateTo('/')
  }
}, { immediate: true })

async function handleManualSubmit() {
  const code = manualCode.value.trim()
  if (!code) return

  manualStatus.value = 'loading'
  manualError.value = ''

  try {
    await $fetch<ConfirmResult>('/api/auth/confirm', {
      method: 'POST',
      body: { token: code },
    })

    manualStatus.value = 'success'
    await navigateTo('/')
  }
  catch (err: unknown) {
    manualStatus.value = 'error'
    manualError.value = getErrorMessage(err, 'Confirmation failed. The code may be expired or invalid.')
  }
}
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
        Email confirmed! Redirecting...
      </p>
    </div>

    <template v-else>
      <div
        v-if="errorMessage"
        class="confirm__error"
        role="alert"
      >
        {{ errorMessage }}
      </div>

      <p class="confirm__hint">
        You can also enter the confirmation code manually:
      </p>

      <form
        class="confirm__form"
        @submit.prevent="handleManualSubmit"
      >
        <UiFormField
          label="Confirmation code"
          field-id="confirm-code"
        >
          <UiInput
            id="confirm-code"
            v-model="manualCode"
            placeholder="Enter the code from your email"
            autocomplete="one-time-code"
          />
        </UiFormField>

        <UiButton
          type="submit"
          variant="primary"
          size="lg"
          :loading="manualStatus === 'loading'"
          class="confirm__submit"
        >
          Confirm
        </UiButton>
      </form>

      <p class="confirm__footer">
        <NuxtLink to="/auth/sign-in">
          Back to Sign In
        </NuxtLink>
      </p>
    </template>
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

.confirm__error {
  padding: var(--space-3);
  margin-bottom: var(--space-4);
  font-size: var(--font-size-sm);
  color: var(--color-danger);
  background-color: var(--color-surface-sunken);
  border: 1px solid var(--color-danger);
  border-radius: var(--radius-md);
  text-align: center;
}

.confirm__hint {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-align: center;
  margin: 0 0 var(--space-2);
}

.confirm__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.confirm__submit {
  width: 100%;
}

.confirm__footer {
  margin: var(--space-4) 0 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-align: center;
}

.confirm__footer a {
  color: var(--color-primary);
  text-decoration: none;
}

.confirm__footer a:hover {
  text-decoration: underline;
}
</style>
