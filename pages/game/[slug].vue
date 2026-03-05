<script setup lang="ts">
interface Game {
  id: number
  title: string
  description: string
  price: number
}

const { slug } = useRoute().params
const { pending, data: game } = await useFetch<Game>(`/api/games/${slug}`)

if (!game.value) {
  throw createError({ message: `Game '${slug}' not found`, statusCode: 404, fatal: true })
}

useHead({
  title: `4Record > Game > ${game.value?.title}`,
})

definePageMeta({ layout: 'games' })
</script>

<template>
  <p v-if="pending">Game is loading...</p>
  <GameCard
    v-else
    :game="game ?? undefined"
  />
</template>

<style scoped>
article {
  font-size: 1.2rem;
}
</style>
