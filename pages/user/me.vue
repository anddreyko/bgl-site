<script setup lang="ts">
import UserAvatar from '~/components/UserAvatar/index.vue'
import UiButton from '~/components/UiButton/index.vue'
import UiInput from '~/components/UiInput/index.vue'

definePageMeta({ middleware: 'auth' })
useHead({ title: '4Record > Edit Profile' })

const { user, signOut } = useAuth()
const { registerPasskey } = usePasskey()

const name = ref(user.value?.name ?? '')
const isSaving = ref(false)
const saveError = ref<string | null>(null)
const saveSuccess = ref(false)

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

const hasChanges = computed(() => name.value !== (user.value?.name ?? ''))

watch(user, (u) => {
  if (u) name.value = u.name ?? ''
}, { immediate: true })

async function handleSave() {
  if (!hasChanges.value) return
  isSaving.value = true
  saveError.value = null
  saveSuccess.value = false
  try {
    await $fetch(`/api/user/${user.value!.id}`, {
      method: 'PATCH',
      body: { name: name.value },
    })
    if (user.value) {
      user.value = { ...user.value, name: name.value }
    }
    saveSuccess.value = true
  }
  catch (error: unknown) {
    saveError.value = error instanceof Error ? error.message : 'Failed to save profile'
  }
  finally {
    isSaving.value = false
  }
}

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
    if (error instanceof DOMException && error.name === 'NotAllowedError') {
      passkeyError.value = 'Passkey registration was cancelled'
    }
    else if (error instanceof TypeError || error instanceof ReferenceError) {
      passkeyError.value = 'Failed to register passkey. Your browser may not support this feature.'
    }
    else {
      passkeyError.value = error instanceof Error ? error.message : 'Failed to register passkey'
    }
  }
  finally {
    isRegisteringPasskey.value = false
  }
}
</script>

<template>
  <div class="edit-profile">
    <h1 class="edit-profile__title">
      Edit Profile
    </h1>

    <!-- Profile form -->
    <section
      v-if="user"
      class="edit-profile__form"
    >
      <div class="edit-profile__avatar-row">
        <UserAvatar
          :name="user.name || user.email"
          size="lg"
          to="/user/me"
        />
        <div class="edit-profile__avatar-info">
          <p class="edit-profile__email">
            {{ user.email }}
          </p>
          <p
            v-if="memberSince"
            class="edit-profile__since"
          >
            Member since {{ memberSince }}
          </p>
        </div>
      </div>

      <div class="edit-profile__field">
        <label
          for="profile-name"
          class="edit-profile__label"
        >
          Name
        </label>
        <UiInput
          id="profile-name"
          v-model="name"
          placeholder="Your name"
        />
      </div>

      <div class="edit-profile__field">
        <label class="edit-profile__label">
          Email
        </label>
        <p class="edit-profile__readonly">
          {{ user.email }}
        </p>
      </div>

      <div class="edit-profile__save-row">
        <UiButton
          :disabled="!hasChanges"
          :loading="isSaving"
          @click="handleSave"
        >
          Save
        </UiButton>
        <p
          v-if="saveError"
          class="edit-profile__error"
          role="alert"
        >
          {{ saveError }}
        </p>
        <p
          v-if="saveSuccess"
          class="edit-profile__success"
        >
          Profile saved
        </p>
      </div>
    </section>

    <!-- Security -->
    <section class="edit-profile__section">
      <h2 class="edit-profile__section-title">
        Security
      </h2>
      <div class="edit-profile__actions">
        <UiButton
          variant="secondary"
          size="sm"
          :loading="isRegisteringPasskey"
          @click="handleRegisterPasskey"
        >
          Register Passkey
        </UiButton>
        <p
          v-if="passkeyError"
          class="edit-profile__error"
          role="alert"
        >
          {{ passkeyError }}
        </p>
      </div>
    </section>

    <!-- Sign Out -->
    <section class="edit-profile__section">
      <UiButton
        variant="danger"
        size="sm"
        :loading="isSigningOut"
        @click="handleSignOut"
      >
        Sign Out
      </UiButton>
    </section>
  </div>
</template>

<style scoped>
.edit-profile {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  max-width: 600px;
}

.edit-profile__title {
  margin: 0;
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.edit-profile__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.edit-profile__avatar-row {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.edit-profile__avatar-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.edit-profile__email {
  margin: 0;
  font-size: var(--font-size-md);
  color: var(--color-text-primary);
}

.edit-profile__since {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.edit-profile__field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.edit-profile__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.edit-profile__readonly {
  margin: 0;
  font-size: var(--font-size-md);
  color: var(--color-text-disabled);
  padding: var(--space-2) 0;
}

.edit-profile__save-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.edit-profile__error {
  color: var(--color-danger);
  font-size: var(--font-size-sm);
  margin: 0;
}

.edit-profile__success {
  color: var(--color-success);
  font-size: var(--font-size-sm);
  margin: 0;
}

.edit-profile__section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.edit-profile__section-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0;
  color: var(--color-text-primary);
}

.edit-profile__actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}
</style>
