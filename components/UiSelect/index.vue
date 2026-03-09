<template>
  <SelectRoot
    :model-value="modelValue"
    :disabled="disabled"
    @update:model-value="(val: string) => $emit('update:modelValue', val)"
  >
    <SelectTrigger
      :id="id"
      class="ui-select__trigger"
      :class="{ 'ui-select__trigger--error': error }"
      :aria-invalid="error || undefined"
    >
      <SelectValue :placeholder="placeholder" />
      <SelectIcon class="ui-select__icon">
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </SelectIcon>
    </SelectTrigger>

    <SelectPortal>
      <SelectContent
        class="ui-select__content"
        position="popper"
        :side-offset="4"
      >
        <SelectViewport>
          <SelectItem
            v-for="option in options"
            :key="option.value"
            :value="option.value"
            class="ui-select__item"
            :class="{ 'ui-select__item--muted': option.group === 'system' }"
          >
            <SelectItemText>{{ option.label }}</SelectItemText>
            <SelectItemIndicator class="ui-select__indicator">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M2 6L5 9L10 3"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </SelectItemIndicator>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>

<script setup lang="ts">
import {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectIcon,
  SelectPortal,
  SelectContent,
  SelectViewport,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
} from 'radix-vue'

withDefaults(defineProps<{
  modelValue: string
  options: Array<{ value: string, label: string, group?: string }>
  placeholder?: string
  disabled?: boolean
  error?: boolean
  id?: string
}>(), {
  placeholder: 'Select...',
  disabled: false,
  error: false,
})

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<!-- Global styles for portaled dropdown content -->
<style>
.ui-select__content {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  padding: var(--space-1);
  min-width: var(--radix-select-trigger-width);
}

.ui-select__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-md);
  border-radius: var(--radius-sm);
  cursor: pointer;
  user-select: none;
}

.ui-select__item:focus {
  outline: none;
  background-color: var(--color-surface-sunken);
}

.ui-select__item[data-highlighted] {
  background-color: var(--color-surface-sunken);
}

.ui-select__item--muted {
  background-color: var(--color-surface-sunken);
  color: var(--color-text-secondary);
  font-style: italic;
}

.ui-select__indicator {
  color: var(--color-primary);
}
</style>

<style scoped>
.ui-select__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  width: 100%;
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-md);
  line-height: var(--line-height-normal);
  color: var(--color-text-primary);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: border-color var(--transition-fast);
}

.ui-select__trigger:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 1px var(--color-border-focus);
}

.ui-select__trigger--error {
  border-color: var(--color-danger);
}

.ui-select__trigger:disabled {
  background-color: var(--color-surface-sunken);
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.ui-select__icon {
  color: var(--color-text-secondary);
}
</style>
