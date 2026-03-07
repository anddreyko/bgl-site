<template>
  <div
    v-if="plays.length > 0"
    class="game-plays-table"
  >
    <h3 class="game-plays-table__title">Play History</h3>
    <div class="game-plays-table__wrapper">
      <table class="game-plays-table__table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Duration</th>
            <th>Players</th>
            <th>Winner</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="play in plays"
            :key="play.id"
            class="game-plays-table__row"
            tabindex="0"
            :aria-label="`Play from ${formatDate(play.startedAt)}, press Enter to view`"
            @click="navigateTo(`/plays/${play.id}`)"
            @keydown.enter="navigateTo(`/plays/${play.id}`)"
            @keydown.space.prevent="navigateTo(`/plays/${play.id}`)"
          >
            <td>{{ formatDate(play.startedAt) }}</td>
            <td>{{ formatDuration(play) }}</td>
            <td>{{ play.players.length }}</td>
            <td>
              <template v-if="play.players.some(p => p.isWinner)">
                <PlayerBadge
                  v-for="winner in play.players.filter(p => p.isWinner)"
                  :key="winner.id"
                  :player="winner"
                />
              </template>
              <template v-else>-</template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Play } from '~/types'
import PlayerBadge from '~/components/PlayerBadge/index.vue'

defineProps<{
  plays: Play[]
}>()

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatDuration(play: Play): string {
  if (!play.finishedAt) return 'In progress'
  const ms = new Date(play.finishedAt).getTime() - new Date(play.startedAt).getTime()
  const minutes = Math.round(ms / 60_000)
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}
</script>

<style scoped>
.game-plays-table__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 var(--space-3);
}

.game-plays-table__wrapper {
  overflow-x: auto;
}

.game-plays-table__table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
}

.game-plays-table__table th {
  text-align: left;
  padding: var(--space-2) var(--space-3);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  border-bottom: 2px solid var(--color-border);
  white-space: nowrap;
}

.game-plays-table__table td {
  padding: var(--space-2) var(--space-3);
  border-bottom: 1px solid var(--color-border);
}

.game-plays-table__row {
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.game-plays-table__row:hover {
  background-color: var(--color-surface-sunken);
}

.game-plays-table__row:focus {
  outline: 2px solid var(--color-border-focus);
  outline-offset: -2px;
}
</style>
