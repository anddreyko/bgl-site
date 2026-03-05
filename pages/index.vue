<script setup lang="ts">
import fetchRetry from '~/utils/fetch'

const pending = ref(true)
const data = ref<{ data?: string, result?: boolean } | null>(null)

onMounted(async () => {
  data.value = await fetchRetry('/api/hello-world') as typeof data.value
  pending.value = false
})
</script>

<template>
  <article>
    <p v-if="data?.data && data.result">{{ data.data }}</p>
    <p v-else-if="pending">loaded..</p>
    <p v-else>Not loading</p>
  </article>
</template>

<style scoped>
</style>
