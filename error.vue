<template>
  <article>
    <h2>{{ error.statusCode }}</h2>
    <p>{{ error.message }}</p>
    <NuxtLink to="/">Go back home</NuxtLink>
  </article>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const { error } = defineProps<{
  error: NuxtError
}>()
</script>

<style scoped>

</style>
