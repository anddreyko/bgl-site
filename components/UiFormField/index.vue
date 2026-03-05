<template>
  <div
    class="ui-form-field"
    :class="{ 'ui-form-field--error': !!error }"
  >
    <label
      class="ui-form-field__label"
      :for="fieldId"
    >
      {{ label }}
      <span
        v-if="required"
        aria-hidden="true"
      > *</span>
    </label>
    <div class="ui-form-field__body">
      <slot />
    </div>
    <p
      v-if="error"
      :id="`${fieldId}-error`"
      class="ui-form-field__error"
      role="alert"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  label: string
  fieldId: string
  error?: string
  required?: boolean
}>(), {
  required: false,
})
</script>

<style scoped>
.ui-form-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.ui-form-field__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.ui-form-field__error {
  font-size: var(--font-size-sm);
  color: var(--color-danger);
  margin: 0;
}
</style>
