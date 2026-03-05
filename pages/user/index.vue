<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { user, signOut } = useAuth()
const { registerPasskey } = usePasskey()

const isSigningOut = ref(false)
const isRegisteringPasskey = ref(false)
const passkeyError = ref<string | null>(null)

const memberSince = computed(() => {
  if (!user.value?.createdAt) return ''
  return new Date(user.value.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const statusVariant = computed(() => {
  return user.value?.isActive ? 'success' : 'warning'
})

const statusLabel = computed(() => {
  return user.value?.isActive ? 'Active' : 'Inactive'
})

async function handleSignOut() {
  isSigningOut.value = true
  try {
    await signOut()
  }
  finally {
    isSigningOut.value = false
  }
}

async function handleRegisterPasskey() {
  isRegisteringPasskey.value = true
  passkeyError.value = null
  try {
    await registerPasskey()
  }
  catch (error: unknown) {
    passkeyError.value = error instanceof Error ? error.message : 'Failed to register passkey'
  }
  finally {
    isRegisteringPasskey.value = false
  }
}
</script>

<template>
  <section
    class="user-profile"
    aria-labelledby="user-profile-heading"
  >
    <h1
      id="user-profile-heading"
      class="user-profile__heading"
    >
      My Profile
    </h1>

    <div
      v-if="user"
      class="user-profile__card"
    >
      <div class="user-profile__info">
        <dl class="user-profile__details">
          <div class="user-profile__detail">
            <dt class="user-profile__label">
              Name
            </dt>
            <dd class="user-profile__value">
              {{ user.name }}
            </dd>
          </div>

          <div class="user-profile__detail">
            <dt class="user-profile__label">
              Email
            </dt>
            <dd class="user-profile__value">
              {{ user.email }}
            </dd>
          </div>

          <div class="user-profile__detail">
            <dt class="user-profile__label">
              Member since
            </dt>
            <dd class="user-profile__value">
              {{ memberSince }}
            </dd>
          </div>

          <div
            v-if="user.bggUsername"
            class="user-profile__detail"
          >
            <dt class="user-profile__label">
              BGG Username
            </dt>
            <dd class="user-profile__value">
              {{ user.bggUsername }}
            </dd>
          </div>

          <div class="user-profile__detail">
            <dt class="user-profile__label">
              Status
            </dt>
            <dd class="user-profile__value">
              <UiBadge :variant="statusVariant">
                {{ statusLabel }}
              </UiBadge>
            </dd>
          </div>
        </dl>
      </div>

      <div class="user-profile__actions">
        <UiButton
          variant="secondary"
          :loading="isRegisteringPasskey"
          @click="handleRegisterPasskey"
        >
          Register Passkey
        </UiButton>

        <p
          v-if="passkeyError"
          class="user-profile__error"
          role="alert"
        >
          {{ passkeyError }}
        </p>

        <UiButton
          variant="danger"
          :loading="isSigningOut"
          @click="handleSignOut"
        >
          Sign Out
        </UiButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.user-profile {
  max-width: 40rem;
  margin: 0 auto;
  padding: var(--space-6) var(--space-4);
}

.user-profile__heading {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-6);
  color: var(--color-text-primary);
}

.user-profile__card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}

.user-profile__details {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.user-profile__detail {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.user-profile__label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

.user-profile__value {
  margin: 0;
  font-size: var(--font-size-md);
  color: var(--color-text-primary);
}

.user-profile__actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-top: var(--space-6);
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-border);
}

.user-profile__error {
  color: var(--color-danger);
  font-size: var(--font-size-sm);
  margin: 0;
}
</style>
