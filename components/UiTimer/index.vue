<template>
  <span
    class="ui-timer"
    :class="{ 'ui-timer--running': running }"
    role="timer"
    aria-live="off"
  >
    {{ formatted }}
  </span>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = withDefaults(defineProps<{
  startedAt: string
  running?: boolean
}>(), {
  running: true,
})

const now = ref(0)
let intervalId: ReturnType<typeof setInterval> | null = null

function startTimer() {
  if (intervalId) return
  intervalId = setInterval(() => {
    now.value = Date.now()
  }, 1000)
}

function stopTimer() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

const elapsedSeconds = computed(() => {
  if (now.value === 0) return 0
  const start = new Date(props.startedAt).getTime()
  return Math.max(0, Math.floor((now.value - start) / 1000))
})

const formatted = computed(() => {
  const total = elapsedSeconds.value
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60

  const mm = String(minutes).padStart(2, '0')
  const ss = String(seconds).padStart(2, '0')

  if (hours > 0) {
    return `${hours}:${mm}:${ss}`
  }
  return `${mm}:${ss}`
})

onMounted(() => {
  now.value = Date.now()
  if (props.running) {
    startTimer()
  }
})

onUnmounted(() => {
  stopTimer()
})

watch(() => props.running, (val) => {
  if (val) {
    startTimer()
  }
  else {
    stopTimer()
  }
})
</script>

<style scoped>
.ui-timer {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
}

.ui-timer--running {
  color: var(--color-record);
}
</style>
