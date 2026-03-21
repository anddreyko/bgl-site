<script setup lang="ts">
import UiSpinner from '~/components/UiSpinner/index.vue'
import UiButton from '~/components/UiButton/index.vue'
import UiInput from '~/components/UiInput/index.vue'
import UiFormField from '~/components/UiFormField/index.vue'
import { getErrorMessage } from '~/utils/error-message'

definePageMeta({ layout: 'auth' })

useHead({ title: 'Confirm Email' })

const route = useRoute()
const { resendCode, fetchCurrentUser } = useAuth()
const urlToken = route.params.token as string

const manualCode = ref('')
const manualStatus = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const manualError = ref('')

const resendEmail = ref('')
const RESEND_COOLDOWN = 60
const resendCooldown = ref(0)
const resendStatus = ref<'idle' | 'loading' | 'sent' | 'error'>('idle')
const resendError = ref('')
let cooldownTimer: ReturnType<typeof setInterval> | undefined

function startCooldown() {
  resendCooldown.value = RESEND_COOLDOWN
  cooldownTimer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      clearInterval(cooldownTimer)
      cooldownTimer = undefined
    }
  }, 1000)
}

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer)
})

async function handleResend() {
  const target = resendEmail.value.trim()
  if (!target || resendCooldown.value > 0) return

  resendStatus.value = 'loading'
  resendError.value = ''

  try {
    await resendCode(target)
    resendStatus.value = 'sent'
    startCooldown()
  }
  catch (err: unknown) {
    resendStatus.value = 'error'
    resendError.value = getErrorMessage(err, 'Failed to resend code. Please try again.')
  }
}

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
    await fetchCurrentUser()
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
      body: { credential: code, type: 'code' },
    })

    manualStatus.value = 'success'
    await fetchCurrentUser()
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

      <div class="confirm__resend">
        <p class="confirm__resend-text">
          Didn't receive the code?
        </p>

        <div class="confirm__resend-email">
          <UiFormField
            label="Email"
            field-id="resend-email"
            required
          >
            <UiInput
              id="resend-email"
              v-model="resendEmail"
              type="email"
              placeholder="you@example.com"
              autocomplete="email"
            />
          </UiFormField>
        </div>

        <div
          v-if="resendStatus === 'sent'"
          class="confirm__resend-success"
          role="status"
        >
          Code sent! Check your email.
        </div>

        <div
          v-if="resendStatus === 'error'"
          class="confirm__resend-error"
          role="alert"
        >
          {{ resendError }}
        </div>

        <UiButton
          variant="ghost"
          size="sm"
          :loading="resendStatus === 'loading'"
          :disabled="resendCooldown > 0 || !resendEmail.trim()"
          @click="handleResend"
        >
          {{ resendCooldown > 0 ? `Resend code (${resendCooldown}s)` : 'Resend code' }}
        </UiButton>
      </div>

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

.confirm__resend {
  margin-top: var(--space-6);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.confirm__resend-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.confirm__resend-email {
  width: 100%;
}

.confirm__resend-success {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.confirm__resend-error {
  font-size: var(--font-size-sm);
  color: var(--color-danger);
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
