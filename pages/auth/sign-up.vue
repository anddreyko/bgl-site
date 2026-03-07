<script setup lang="ts">
import UiButton from '~/components/UiButton/index.vue'
import UiInput from '~/components/UiInput/index.vue'
import UiFormField from '~/components/UiFormField/index.vue'
import { validateEmail, validatePassword } from '~/utils/auth-validation'

definePageMeta({ layout: 'auth' })

useHead({ title: 'Sign Up' })

const { signUp } = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errors = reactive({ name: '', email: '', password: '', confirmPassword: '', form: '' })
const isLoading = ref(false)

function validate(): boolean {
  errors.email = validateEmail(email.value) ?? ''
  errors.password = validatePassword(password.value) ?? ''
  errors.confirmPassword = ''
  errors.name = ''
  errors.form = ''

  if (password.value && confirmPassword.value !== password.value) {
    errors.confirmPassword = 'Passwords do not match'
  }
  if (!confirmPassword.value) {
    errors.confirmPassword = 'Please confirm your password'
  }

  return !errors.email && !errors.password && !errors.confirmPassword && !errors.name
}

async function handleSubmit() {
  if (!validate()) return

  isLoading.value = true
  errors.form = ''
  try {
    await signUp({
      email: email.value,
      password: password.value,
      name: name.value || undefined,
    })
    await navigateTo('/auth/confirm')
  }
  catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Registration failed. Please try again.'
    errors.form = message
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="sign-up">
    <h1 class="sign-up__title">
      Sign Up
    </h1>

    <div
      v-if="errors.form"
      class="sign-up__error"
      role="alert"
    >
      {{ errors.form }}
    </div>

    <form
      class="sign-up__form"
      novalidate
      @submit.prevent="handleSubmit"
    >
      <UiFormField
        label="Name"
        field-id="sign-up-name"
        :error="errors.name"
      >
        <UiInput
          id="sign-up-name"
          v-model="name"
          type="text"
          placeholder="Your name (optional)"
          :error="!!errors.name"
          autocomplete="name"
        />
      </UiFormField>

      <UiFormField
        label="Email"
        field-id="sign-up-email"
        :error="errors.email"
        required
      >
        <UiInput
          id="sign-up-email"
          v-model="email"
          type="email"
          placeholder="you@example.com"
          :error="!!errors.email"
          :aria-describedby="errors.email ? 'sign-up-email-error' : undefined"
          autocomplete="email"
        />
      </UiFormField>

      <UiFormField
        label="Password"
        field-id="sign-up-password"
        :error="errors.password"
        required
      >
        <UiInput
          id="sign-up-password"
          v-model="password"
          type="password"
          placeholder="At least 8 characters"
          :error="!!errors.password"
          :aria-describedby="errors.password ? 'sign-up-password-error' : undefined"
          autocomplete="new-password"
        />
      </UiFormField>

      <UiFormField
        label="Confirm Password"
        field-id="sign-up-confirm-password"
        :error="errors.confirmPassword"
        required
      >
        <UiInput
          id="sign-up-confirm-password"
          v-model="confirmPassword"
          type="password"
          placeholder="Repeat your password"
          :error="!!errors.confirmPassword"
          :aria-describedby="errors.confirmPassword ? 'sign-up-confirm-password-error' : undefined"
          autocomplete="new-password"
        />
      </UiFormField>

      <UiButton
        type="submit"
        variant="primary"
        size="lg"
        :loading="isLoading"
        class="sign-up__submit"
      >
        Sign Up
      </UiButton>
    </form>

    <p class="sign-up__footer">
      Already have an account?
      <NuxtLink to="/auth/sign-in">
        Sign In
      </NuxtLink>
    </p>
  </div>
</template>

<style scoped>
.sign-up__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-6);
  text-align: center;
}

.sign-up__error {
  padding: var(--space-3);
  margin-bottom: var(--space-4);
  font-size: var(--font-size-sm);
  color: var(--color-danger);
  background-color: var(--color-surface-sunken);
  border: 1px solid var(--color-danger);
  border-radius: var(--radius-md);
}

.sign-up__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.sign-up__submit {
  width: 100%;
  margin-top: var(--space-2);
}

.sign-up__footer {
  margin: var(--space-4) 0 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-align: center;
}

.sign-up__footer a {
  color: var(--color-primary);
  text-decoration: none;
}

.sign-up__footer a:hover {
  text-decoration: underline;
}
</style>
