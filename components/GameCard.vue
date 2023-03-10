<template>
  <article>
    <h2>{{ game?.title }} [#{{ game?.id }}]</h2>
    <p>{{ game?.description }}</p>
    <p>Price: ${{ game?.price }}</p>
  </article>
</template>

<script setup>
const { game } = defineProps(['game'])
</script>

<style scoped>

</style>
