<script setup lang="ts">
import UiButton from '~/components/UiButton/index.vue'
import UiInput from '~/components/UiInput/index.vue'
import UiFormField from '~/components/UiFormField/index.vue'
import { validateEmail, validatePassword } from '~/utils/auth-validation'
import { getErrorMessage } from '~/utils/error-message'

definePageMeta({ layout: 'auth' })

useHead({ title: 'Sign In' })

const { signIn } = useAuth()
const { signInWithPasskey } = usePasskey()

const email = ref('')
const password = ref('')
const errors = reactive({ email: '', password: '', form: '' })
const isLoading = ref(false)
const isPasskeyLoading = ref(false)

function validate(): boolean {
  errors.email = validateEmail(email.value) ?? ''
  errors.password = validatePassword(password.value) ?? ''
  errors.form = ''
  return !errors.email && !errors.password
}

async function handleSubmit() {
  if (!validate()) return

  isLoading.value = true
  errors.form = ''
  try {
    await signIn({ email: email.value, password: password.value })
    await navigateTo('/')
  }
  catch (error: unknown) {
    errors.form = getErrorMessage(error, 'Invalid email or password')
  }
  finally {
    isLoading.value = false
  }
}

async function handlePasskeySignIn() {
  isPasskeyLoading.value = true
  errors.form = ''
  try {
    await signInWithPasskey()
    await navigateTo('/')
  }
  catch (error: unknown) {
    if (error instanceof DOMException && error.name === 'NotAllowedError') {
      errors.form = 'Passkey authentication was cancelled'
    }
    else if (error instanceof TypeError || error instanceof ReferenceError) {
      errors.form = 'Passkey authentication failed. Your browser may not support this feature.'
    }
    else {
      errors.form = getErrorMessage(error, 'Passkey authentication failed')
    }
  }
  finally {
    isPasskeyLoading.value = false
  }
}
</script>

<template>
  <div class="sign-in">
    <h1 class="sign-in__title">
      Sign In
    </h1>

    <div
      v-if="errors.form"
      class="sign-in__error"
      role="alert"
    >
      {{ errors.form }}
    </div>

    <form
      class="sign-in__form"
      novalidate
      @submit.prevent="handleSubmit"
    >
      <UiFormField
        label="Email"
        field-id="sign-in-email"
        :error="errors.email"
        required
      >
        <UiInput
          id="sign-in-email"
          v-model="email"
          type="email"
          placeholder="you@example.com"
          :error="!!errors.email"
          :aria-describedby="errors.email ? 'sign-in-email-error' : undefined"
          autocomplete="email"
        />
      </UiFormField>

      <UiFormField
        label="Password"
        field-id="sign-in-password"
        :error="errors.password"
        required
      >
        <UiInput
          id="sign-in-password"
          v-model="password"
          type="password"
          placeholder="Enter your password"
          :error="!!errors.password"
          :aria-describedby="errors.password ? 'sign-in-password-error' : undefined"
          autocomplete="current-password"
        />
      </UiFormField>

      <UiButton
        type="submit"
        variant="primary"
        size="lg"
        :loading="isLoading"
        :disabled="isPasskeyLoading"
        class="sign-in__submit"
      >
        Sign In
      </UiButton>
    </form>

    <div class="sign-in__divider">
      <span class="sign-in__divider-text">or</span>
    </div>

    <UiButton
      variant="secondary"
      size="lg"
      :loading="isPasskeyLoading"
      :disabled="isLoading"
      class="sign-in__passkey"
      @click="handlePasskeySignIn"
    >
      Sign in with Passkey
    </UiButton>

    <p class="sign-in__footer">
      Don't have an account?
      <NuxtLink to="/auth/sign-up">
        Sign Up
      </NuxtLink>
    </p>
  </div>
</template>

<style scoped>
.sign-in__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-6);
  text-align: center;
}

.sign-in__error {
  padding: var(--space-3);
  margin-bottom: var(--space-4);
  font-size: var(--font-size-sm);
  color: var(--color-danger);
  background-color: var(--color-surface-sunken);
  border: 1px solid var(--color-danger);
  border-radius: var(--radius-md);
}

.sign-in__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.sign-in__submit {
  width: 100%;
  margin-top: var(--space-2);
}

.sign-in__divider {
  position: relative;
  text-align: center;
  margin: var(--space-4) 0;
}

.sign-in__divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  border-top: 1px solid var(--color-border);
}

.sign-in__divider-text {
  position: relative;
  padding: 0 var(--space-3);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  background-color: var(--color-surface);
}

.sign-in__passkey {
  width: 100%;
}

.sign-in__footer {
  margin: var(--space-4) 0 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-align: center;
}

.sign-in__footer a {
  color: var(--color-primary);
  text-decoration: none;
}

.sign-in__footer a:hover {
  text-decoration: underline;
}
</style>
