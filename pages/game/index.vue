<template>
  <h2>Game catalog</h2>
  <section>
    <p v-if="pending">
      Games are loading...
    </p>
    <article
      v-for="game in games?.items"
      v-else
      :key="game.id"
    >
      <h3>
        <NuxtLink :to="`/game/${game.id}`">
          {{ game.name }}
        </NuxtLink>
      </h3>
    </article>
  </section>
</template>

<script setup lang="ts">
import type { PaginatedResponse, Game } from '~/types'

useHead({
  title: '4Record > Game',
})
definePageMeta({ layout: 'games' })

const { pending, data: games } = await useLazyFetch<PaginatedResponse<Game>>('/api/games', {
  query: { q: 'catan', page: 1, size: 20 },
})
</script>
