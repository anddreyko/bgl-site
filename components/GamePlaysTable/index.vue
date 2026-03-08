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
            <th>Players</th>
            <th>Date</th>
            <th>Title</th>
            <th>Duration</th>
            <th>Score</th>
            <th>Outcome</th>
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
            <td>
              <div class="game-plays-table__players">
                <span
                  v-for="player in play.players.slice(0, 4)"
                  :key="player.id"
                  class="game-plays-table__player-avatar"
                  :title="playerName(player)"
                >
                  {{ getInitials(playerName(player)) }}
                </span>
                <span
                  v-if="play.players.length > 4"
                  class="game-plays-table__player-more"
                >
                  +{{ play.players.length - 4 }}
                </span>
              </div>
            </td>
            <td class="game-plays-table__date">
              {{ formatDate(play.startedAt) }}
            </td>
            <td class="game-plays-table__name">
              {{ play.name || '-' }}
            </td>
            <td class="game-plays-table__duration">
              {{ formatDuration(play) }}
            </td>
            <td class="game-plays-table__score">
              {{ topScore(play) }}
            </td>
            <td>
              <span
                v-if="hasWinner(play)"
                class="game-plays-table__outcome game-plays-table__outcome--win"
              >
                {{ winnerNames(play) }}
              </span>
              <span
                v-else-if="play.finishedAt"
                class="game-plays-table__outcome"
              >
                -
              </span>
              <span
                v-else
                class="game-plays-table__outcome game-plays-table__outcome--progress"
              >
                In progress
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Play } from '~/types'
import { getInitials } from '~/utils/color-from-string'

defineProps<{
  plays: Play[]
}>()

const { mateNames } = useMateNames()

function playerName(player: { mateId: string, mateName?: string }): string {
  return player.mateName || mateNames.value[player.mateId] || player.mateId.slice(0, 8)
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatDuration(play: Play): string {
  if (!play.finishedAt) return '-'
  const ms = new Date(play.finishedAt).getTime() - new Date(play.startedAt).getTime()
  const minutes = Math.round(ms / 60_000)
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}.${Math.round(m / 6)}h` : `${h}h`
}

function topScore(play: Play): string {
  const scores = play.players.filter(p => p.score != null).map(p => p.score!)
  if (scores.length === 0) return '-'
  return String(Math.max(...scores))
}

function hasWinner(play: Play): boolean {
  return play.players.some(p => p.isWinner)
}

function winnerNames(play: Play): string {
  const winners = play.players.filter(p => p.isWinner)
  if (winners.length === 0) return 'Winner'
  return winners.map(w => playerName(w)).join(', ')
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
  vertical-align: middle;
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

.game-plays-table__players {
  display: flex;
  gap: var(--space-1);
  align-items: center;
}

.game-plays-table__player-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background-color: var(--color-surface-raised);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.game-plays-table__player-more {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.game-plays-table__date {
  white-space: nowrap;
}

.game-plays-table__name {
  color: var(--color-text-secondary);
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.game-plays-table__duration {
  white-space: nowrap;
  font-weight: var(--font-weight-medium);
}

.game-plays-table__score {
  font-weight: var(--font-weight-bold);
}

.game-plays-table__outcome {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.game-plays-table__outcome--win {
  color: var(--color-success);
  font-weight: var(--font-weight-semibold);
}

.game-plays-table__outcome--progress {
  color: var(--color-warning);
}
</style>
