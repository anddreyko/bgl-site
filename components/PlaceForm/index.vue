<template>
  <form
    class="place-form"
    novalidate
    @submit.prevent="handleSubmit"
  >
    <UiFormField
      label="Name"
      field-id="place-name"
      :error="errors.name"
      :required="true"
    >
      <UiInput
        id="place-name"
        v-model="form.name"
        placeholder="Enter place name"
        :error="!!errors.name"
        :aria-describedby="errors.name ? 'place-name-error' : undefined"
      />
    </UiFormField>

    <UiFormField
      label="Address"
      field-id="place-address"
      :error="errors.address"
    >
      <UiInput
        id="place-address"
        v-model="form.address"
        placeholder="Optional address"
        :error="!!errors.address"
      />
    </UiFormField>

    <UiFormField
      label="URL"
      field-id="place-url"
      :error="errors.url"
    >
      <UiInput
        id="place-url"
        v-model="form.url"
        placeholder="Optional link (e.g. website, map)"
        :error="!!errors.url"
      />
    </UiFormField>

    <UiFormField
      label="Notes"
      field-id="place-notes"
      :error="errors.notes"
    >
      <textarea
        id="place-notes"
        v-model="form.notes"
        class="place-form__textarea"
        :class="{ 'place-form__textarea--error': !!errors.notes }"
        placeholder="Optional notes about this place"
        rows="3"
        :aria-invalid="!!errors.notes || undefined"
        :aria-describedby="errors.notes ? 'place-notes-error' : undefined"
      />
    </UiFormField>

    <div class="place-form__actions">
      <UiButton
        type="submit"
        :loading="loading"
        :disabled="loading"
      >
        {{ place ? 'Save Changes' : 'Add Place' }}
      </UiButton>
      <UiButton
        variant="secondary"
        :disabled="loading"
        @click="$emit('cancel')"
      >
        Cancel
      </UiButton>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { Place, PlacePayload } from '~/types'
import UiButton from '~/components/UiButton/index.vue'
import UiInput from '~/components/UiInput/index.vue'
import UiFormField from '~/components/UiFormField/index.vue'

const props = withDefaults(defineProps<{
  place?: Place
  loading?: boolean
}>(), {
  loading: false,
})

const emit = defineEmits<{
  submit: [payload: PlacePayload]
  cancel: []
}>()

const form = reactive({
  name: props.place?.name ?? '',
  address: props.place?.address ?? '',
  url: props.place?.url ?? '',
  notes: props.place?.notes ?? '',
})

const errors = reactive({
  name: '',
  address: '',
  url: '',
  notes: '',
})

watch(() => props.place, (newPlace) => {
  if (newPlace) {
    form.name = newPlace.name
    form.address = newPlace.address ?? ''
    form.url = newPlace.url ?? ''
    form.notes = newPlace.notes ?? ''
  }
  else {
    form.name = ''
    form.address = ''
    form.url = ''
    form.notes = ''
  }
})

function validate(): boolean {
  let valid = true
  errors.name = ''
  errors.address = ''
  errors.url = ''
  errors.notes = ''

  const trimmedName = form.name.trim()
  if (!trimmedName) {
    errors.name = 'Name is required'
    valid = false
  }
  else if (trimmedName.length > 255) {
    errors.name = 'Name must be 255 characters or less'
    valid = false
  }

  if (form.address && form.address.length > 255) {
    errors.address = 'Address must be 255 characters or less'
    valid = false
  }

  if (form.url && form.url.length > 500) {
    errors.url = 'URL must be 500 characters or less'
    valid = false
  }

  if (form.notes && form.notes.length > 500) {
    errors.notes = 'Notes must be 500 characters or less'
    valid = false
  }

  return valid
}

function handleSubmit(): void {
  if (!validate()) return
  emit('submit', {
    name: form.name.trim(),
    address: form.address.trim() || undefined,
    url: form.url.trim() || undefined,
    notes: form.notes.trim() || undefined,
  })
}
</script>

<style scoped>
.place-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.place-form__textarea {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-md);
  font-family: inherit;
  line-height: var(--line-height-normal);
  color: var(--color-text-primary);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  resize: vertical;
  transition: border-color var(--transition-fast);
}

.place-form__textarea::placeholder {
  color: var(--color-text-disabled);
}

.place-form__textarea:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 1px var(--color-border-focus);
}

.place-form__textarea--error {
  border-color: var(--color-danger);
}

.place-form__textarea--error:focus {
  box-shadow: 0 0 0 1px var(--color-danger);
}

.place-form__actions {
  display: flex;
  gap: var(--space-3);
}
</style>
