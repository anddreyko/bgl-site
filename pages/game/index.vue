<template>
  <h2>Game catalog</h2>
  <section>
    <p v-if="pending">Games are loading...</p>
    <article v-else v-for="game in games">
      <h3>
        <NuxtLink :to='`/game/${game.id}`'>{{ game.title }}</NuxtLink>
      </h3>
      <p>{{ game.description }}</p>
    </article>
  </section>
</template>

<script setup>
useHead({
  title: '4Record > Game',
})
definePageMeta({ layout: 'games' })

const { pending, data: games } = await useLazyAsyncData('games', async () => $fetch('/api/games'))
</script>

<style scoped>
section {
  font-size: 1rem;
}
</style>
