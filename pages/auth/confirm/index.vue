<script setup lang="ts">
import UiButton from '~/components/UiButton/index.vue'
import UiInput from '~/components/UiInput/index.vue'
import UiFormField from '~/components/UiFormField/index.vue'
import { getErrorMessage } from '~/utils/error-message'

definePageMeta({ layout: 'auth' })

useHead({ title: 'Confirm Email' })

const route = useRoute()
const { resendCode } = useAuth()

const email = ref((route.query.email as string) || '')
const code = ref('')
const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const errorMessage = ref('')

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
  const target = email.value.trim()
  if (!target || resendCooldown.value > 0) return

  resendStatus.value = 'loading'
  resendError.value = ''

  try {
    await resendCode(target)
    resendStatus.value = 'sent'
    startCooldown()
  }
  catch (error: unknown) {
    resendStatus.value = 'error'
    resendError.value = getErrorMessage(error, 'Failed to resend code. Please try again.')
  }
}

async function handleSubmit() {
  const token = code.value.trim()
  if (!token) return

  status.value = 'loading'
  errorMessage.value = ''

  try {
    await $fetch<{ ok: boolean }>('/api/auth/confirm', {
      method: 'POST',
      body: { credential: token, type: 'code' },
    })

    status.value = 'success'
    await navigateTo('/')
  }
  catch (error: unknown) {
    status.value = 'error'
    errorMessage.value = getErrorMessage(error, 'Confirmation failed. The code may be expired or invalid.')
  }
}
</script>

<template>
  <div class="confirm">
    <h1 class="confirm__title">
      Confirm Your Email
    </h1>

    <p class="confirm__description">
      We sent a confirmation code to your email. Enter it below to verify your account.
    </p>

    <div
      v-if="status === 'success'"
      class="confirm__result"
      role="status"
    >
      <p class="confirm__text confirm__text--success">
        Email confirmed! Redirecting...
      </p>
    </div>

    <template v-else>
      <div
        v-if="status === 'error'"
        class="confirm__error"
        role="alert"
      >
        {{ errorMessage }}
      </div>

      <form
        class="confirm__form"
        @submit.prevent="handleSubmit"
      >
        <UiFormField
          label="Confirmation code"
          field-id="confirm-code"
          required
        >
          <UiInput
            id="confirm-code"
            v-model="code"
            placeholder="Enter the code from your email"
            autocomplete="one-time-code"
          />
        </UiFormField>

        <UiButton
          type="submit"
          variant="primary"
          size="lg"
          :loading="status === 'loading'"
          class="confirm__submit"
        >
          Confirm
        </UiButton>
      </form>

      <div class="confirm__resend">
        <p class="confirm__resend-text">
          Didn't receive the code?
        </p>

        <div
          v-if="!email"
          class="confirm__resend-email"
        >
          <UiFormField
            label="Email"
            field-id="resend-email"
            required
          >
            <UiInput
              id="resend-email"
              v-model="email"
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
          :disabled="resendCooldown > 0 || !email.trim()"
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
  margin: 0 0 var(--space-2);
  text-align: center;
}

.confirm__description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-align: center;
  margin: 0 0 var(--space-6);
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
