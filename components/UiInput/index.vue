<template>
  <div
    class="ui-input"
    :class="{ 'ui-input--error': error, 'ui-input--disabled': disabled }"
  >
    <input
      :id="id"
      class="ui-input__field"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-invalid="error || undefined"
      @input="onInput"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  type?: string
  error?: boolean
  disabled?: boolean
  id?: string
}>(), {
  type: 'text',
  error: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<style scoped>
.ui-input__field {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-md);
  line-height: var(--line-height-normal);
  color: var(--color-text-primary);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-fast);
}

.ui-input__field::placeholder {
  color: var(--color-text-disabled);
}

.ui-input__field:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 1px var(--color-border-focus);
}

.ui-input--error .ui-input__field {
  border-color: var(--color-danger);
}

.ui-input--error .ui-input__field:focus {
  box-shadow: 0 0 0 1px var(--color-danger);
}

.ui-input--disabled .ui-input__field {
  background-color: var(--color-surface-sunken);
  color: var(--color-text-disabled);
  cursor: not-allowed;
}
</style>
