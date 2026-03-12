<template>
  <div
    class="color-picker"
    @focusout="onFocusOut"
  >
    <button
      type="button"
      class="color-picker__trigger"
      :aria-label="label"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span
        v-if="modelValue"
        class="color-picker__preview"
        :style="{ backgroundColor: `var(--player-${modelValue})` }"
      />
      <span
        v-else
        class="color-picker__preview color-picker__preview--empty"
      />
      <span class="color-picker__label">{{ selectedLabel }}</span>
      <svg
        class="color-picker__chevron"
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
    </button>

    <div
      v-if="open"
      class="color-picker__dropdown"
      role="radiogroup"
      :aria-label="label"
    >
      <button
        v-for="color in colors"
        :key="color.value"
        type="button"
        class="color-picker__swatch"
        :class="{
          'color-picker__swatch--selected': modelValue === color.value,
          'color-picker__swatch--light': color.light,
        }"
        :style="{ '--swatch-color': `var(--player-${color.value})` }"
        :aria-label="color.label"
        :aria-checked="modelValue === color.value"
        :title="color.label"
        role="radio"
        @click="onSelect(color.value)"
      >
        <svg
          v-if="modelValue === color.value"
          class="color-picker__check"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M2.5 7L5.5 10L11.5 4"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <button
        v-if="modelValue"
        type="button"
        class="color-picker__clear"
        aria-label="Clear color"
        @click="onSelect(undefined)"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M3 3L9 9M9 3L3 9"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

export interface PlayerColor {
  value: string
  label: string
  light?: boolean
}

const colors: PlayerColor[] = [
  { value: 'red', label: 'Red' },
  { value: 'orange', label: 'Orange' },
  { value: 'yellow', label: 'Yellow', light: true },
  { value: 'green', label: 'Green' },
  { value: 'cyan', label: 'Cyan' },
  { value: 'blue', label: 'Blue' },
  { value: 'purple', label: 'Purple' },
  { value: 'pink', label: 'Pink' },
  { value: 'brown', label: 'Brown' },
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White', light: true },
]

const props = withDefaults(defineProps<{
  modelValue?: string
  label?: string
}>(), {
  label: 'Player color',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | undefined]
}>()

const open = ref(false)

const selectedLabel = computed(() => {
  if (!props.modelValue) return 'None'
  return colors.find(c => c.value === props.modelValue)?.label ?? props.modelValue
})

function onSelect(value: string | undefined) {
  emit('update:modelValue', value)
  open.value = false
}

function onFocusOut(e: FocusEvent) {
  const container = e.currentTarget as HTMLElement
  if (!container.contains(e.relatedTarget as Node)) {
    open.value = false
  }
}
</script>

<style scoped>
.color-picker {
  position: relative;
}

.color-picker__trigger {
  width: 100%;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  cursor: pointer;
  font-size: var(--font-size-md);
  line-height: var(--line-height-normal);
  color: var(--color-text-primary);
  transition: border-color var(--transition-fast);
}

.color-picker__trigger:hover {
  border-color: var(--color-text-secondary);
}

.color-picker__trigger:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 1px;
}

.color-picker__preview {
  width: 16px;
  height: 16px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.color-picker__preview--empty {
  border: 1.5px dashed var(--color-border);
}

.color-picker__label {
  flex: 1;
  min-width: 3rem;
  text-align: left;
}

.color-picker__chevron {
  margin-left: auto;
  color: var(--color-text-secondary);
}

.color-picker__dropdown {
  position: absolute;
  top: calc(100% + var(--space-1));
  left: 0;
  z-index: var(--z-dialog);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: var(--space-3);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  max-width: 220px;
}

.color-picker__swatch {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background-color: var(--swatch-color);
  border: 2px solid transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: border-color var(--transition-fast), transform var(--transition-fast);
  color: #fff;
}

.color-picker__swatch--light {
  color: #333;
}

.color-picker__swatch:hover {
  transform: scale(1.15);
}

.color-picker__swatch:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}

.color-picker__swatch--selected {
  border-color: var(--color-text-primary);
  transform: scale(1.15);
}

.color-picker__check {
  flex-shrink: 0;
}

.color-picker__clear {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  border: 1.5px dashed var(--color-border);
  background: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  color: var(--color-text-secondary);
}

.color-picker__clear:hover {
  background-color: var(--color-surface-sunken);
  color: var(--color-text-primary);
}

.color-picker__clear:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}
</style>
