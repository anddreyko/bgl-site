<script setup lang="ts">
import type { Game } from '~/types'

const { slug: id } = useRoute().params
const { pending, data: game } = await useFetch<Game>(`/api/games/${id}`)

if (!game.value) {
  throw createError({ message: `Game '${id}' not found`, statusCode: 404, fatal: true })
}

useHead({
  title: `4Record > Game > ${game.value?.name}`,
})

definePageMeta({ layout: 'games' })
</script>

<template>
  <p v-if="pending">
    Game is loading...
  </p>
  <GameCard
    v-else
    :game="game ?? undefined"
  />
</template>
