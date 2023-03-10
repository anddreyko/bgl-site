<script setup>
import GameCard from '../../components/GameCard'
import { createError, useHead } from 'nuxt/app'

const { slug } = useRoute().params
const { pending: pending, data: game } = await useFetch(`/api/games/${slug}`, slug)

if (!game.value) {
  throw createError({ message: `Game '${slug}' not found`, statusCode: 404, fatal: true })
}

useHead({
  title: `4Record > Game > ${game?.title}`,
})

definePageMeta({ layout: 'games' })
</script>

<template>
  <p v-if="pending">Game is loading...</p>
  <GameCard v-else :game="game"/>
</template>

<style scoped>
article {
  font-size: 1.2rem;
}
</style>
