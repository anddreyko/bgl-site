<template>
  <article>
    <h2>{{ game?.name }} [#{{ game?.id }}]</h2>
    <p v-if="game?.year">
      Year: {{ game.year }}
    </p>
  </article>
</template>

<script setup lang="ts">
import type { Game } from '~/types'

const { game } = defineProps<{
  game?: Game
}>()
</script>
