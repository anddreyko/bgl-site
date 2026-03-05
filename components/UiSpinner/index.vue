<template>
  <span
    class="ui-spinner"
    :class="`ui-spinner--${size}`"
    role="status"
    aria-label="Loading"
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        class="ui-spinner__track"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="3"
        opacity="0.25"
      />
      <circle
        class="ui-spinner__circle"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-dasharray="31.4 31.4"
      />
    </svg>
  </span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg'
}>(), {
  size: 'md',
})
</script>

<style scoped>
.ui-spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ui-spinner--sm svg {
  width: 1rem;
  height: 1rem;
}

.ui-spinner--md svg {
  width: 1.5rem;
  height: 1.5rem;
}

.ui-spinner--lg svg {
  width: 2rem;
  height: 2rem;
}

.ui-spinner__circle {
  animation: ui-spinner-rotate 0.75s linear infinite;
  transform-origin: center;
}

@keyframes ui-spinner-rotate {
  to {
    transform: rotate(360deg);
  }
}
</style>
