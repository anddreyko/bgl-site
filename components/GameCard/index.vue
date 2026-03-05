<template>
  <article>
    <h2>{{ game?.title }} [#{{ game?.id }}]</h2>
    <p>{{ game?.description }}</p>
    <p>Price: ${{ game?.price }}</p>
  </article>
</template>

<script setup lang="ts">
interface Game {
  id: number
  title: string
  description: string
  price: number
}

const { game } = defineProps<{
  game?: Game
}>()
</script>

<style scoped>

</style>
