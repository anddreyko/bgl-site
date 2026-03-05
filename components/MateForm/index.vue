<template>
  <form
    class="mate-form"
    novalidate
    @submit.prevent="handleSubmit"
  >
    <UiFormField
      label="Name"
      field-id="mate-name"
      :error="errors.name"
      :required="true"
    >
      <UiInput
        id="mate-name"
        v-model="form.name"
        placeholder="Enter mate name"
        :error="!!errors.name"
        :aria-describedby="errors.name ? 'mate-name-error' : undefined"
      />
    </UiFormField>

    <UiFormField
      label="Notes"
      field-id="mate-notes"
      :error="errors.notes"
    >
      <textarea
        id="mate-notes"
        v-model="form.notes"
        class="mate-form__textarea"
        :class="{ 'mate-form__textarea--error': !!errors.notes }"
        placeholder="Optional notes about this mate"
        rows="3"
        :aria-invalid="!!errors.notes || undefined"
        :aria-describedby="errors.notes ? 'mate-notes-error' : undefined"
      />
    </UiFormField>

    <div class="mate-form__actions">
      <UiButton
        type="submit"
        :loading="loading"
        :disabled="loading"
      >
        {{ mate ? 'Save Changes' : 'Add Mate' }}
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
import type { Mate, MatePayload } from '~/types'
import UiButton from '~/components/UiButton/index.vue'
import UiInput from '~/components/UiInput/index.vue'
import UiFormField from '~/components/UiFormField/index.vue'

const props = withDefaults(defineProps<{
  mate?: Mate
  loading?: boolean
}>(), {
  loading: false,
})

const emit = defineEmits<{
  submit: [payload: MatePayload]
  cancel: []
}>()

const form = reactive({
  name: props.mate?.name ?? '',
  notes: props.mate?.notes ?? '',
})

const errors = reactive({
  name: '',
  notes: '',
})

watch(() => props.mate, (newMate) => {
  if (newMate) {
    form.name = newMate.name
    form.notes = newMate.notes ?? ''
  }
  else {
    form.name = ''
    form.notes = ''
  }
})

function validate(): boolean {
  let valid = true
  errors.name = ''
  errors.notes = ''

  const trimmedName = form.name.trim()
  if (!trimmedName) {
    errors.name = 'Name is required'
    valid = false
  }
  else if (trimmedName.length > 100) {
    errors.name = 'Name must be 100 characters or less'
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
    notes: form.notes.trim() || undefined,
  })
}
</script>

<style scoped>
.mate-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.mate-form__textarea {
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

.mate-form__textarea::placeholder {
  color: var(--color-text-disabled);
}

.mate-form__textarea:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 1px var(--color-border-focus);
}

.mate-form__textarea--error {
  border-color: var(--color-danger);
}

.mate-form__textarea--error:focus {
  box-shadow: 0 0 0 1px var(--color-danger);
}

.mate-form__actions {
  display: flex;
  gap: var(--space-3);
}
</style>
