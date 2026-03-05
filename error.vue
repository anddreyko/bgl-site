<template>
  <article><h2>{{ error.statusCode }}</h2>
    <p>{{ error.message }}</p>
    <NuxtLink to="/">Go back home</NuxtLink>
  </article>
</template>

<script setup>
const { error } = defineProps(['error'])
</script>

<style scoped>

</style>
