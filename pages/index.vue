<script setup>
const app = useAppConfig()
const { pending, data } = await useLazyAsyncData('hello-world', async () => $fetch('/api/hello-world'))
</script>

<template>
  <article>
    <p v-if="data?.content">{{ data.content }}</p>
    <p v-else-if="pending">loaded..</p>
    <p v-else>Not loading</p>
  </article>
</template>

<style scoped>
</style>
