<template>
  <h2>Game catalog</h2>
  <section>
    <p v-if="pending">Games are loading...</p>
    <article
      v-for="game in games"
      v-else
      :key="game.id"
    >
      <h3>
        <NuxtLink :to="`/game/${game.id}`">{{ game.title }}</NuxtLink>
      </h3>
      <p>{{ game.description }}</p>
    </article>
  </section>
</template>

<script setup lang="ts">
interface Game {
  id: number
  title: string
  description: string
  price: number
}

useHead({
  title: '4Record > Game',
})
definePageMeta({ layout: 'games' })

const { pending, data: games } = await useLazyFetch<Game[]>('/api/games')
</script>

<style scoped>
section {
  font-size: 1rem;
}
</style>
