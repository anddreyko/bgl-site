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
            <th>Place</th>
            <th>Title</th>
            <th>Duration</th>
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
                <MateAvatar
                  v-for="player in play.players.slice(0, 4)"
                  :key="player.id"
                  :mate-id="player.mateId"
                  :mate-name="player.mateName"
                />
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
            <td class="game-plays-table__place">
              -
            </td>
            <td class="game-plays-table__name">
              {{ play.name || '-' }}
            </td>
            <td class="game-plays-table__duration">
              {{ formatDuration(play) }}
            </td>
            <td>
              <span
                v-if="!play.finishedAt"
                class="game-plays-table__outcome game-plays-table__outcome--progress"
              >
                ...
              </span>
              <template v-else-if="isSingleTeam(play)">
                <span
                  v-if="hasWinner(play)"
                  class="game-plays-table__outcome game-plays-table__outcome--win"
                >
                  W
                </span>
                <span
                  v-else
                  class="game-plays-table__outcome game-plays-table__outcome--loss"
                >
                  L
                </span>
              </template>
              <div
                v-else
                class="game-plays-table__outcome-list"
              >
                <span
                  v-for="entry in outcomeEntries(play)"
                  :key="entry.name"
                  class="game-plays-table__outcome-entry"
                >
                  <span
                    class="game-plays-table__outcome"
                    :class="entry.won ? 'game-plays-table__outcome--win' : 'game-plays-table__outcome--loss'"
                  >
                    {{ entry.won ? 'W' : 'L' }}:
                  </span>
                  <span class="game-plays-table__outcome-name">{{ entry.name }}</span>
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Play } from '~/types'
import MateAvatar from '~/components/MateAvatar/index.vue'

defineProps<{
  plays: Play[]
}>()

const { resolveName } = useMateNames()

function formatDate(iso: string): string {
  const d = new Date(iso)
  const isMidnightUtc = d.getUTCHours() === 0 && d.getUTCMinutes() === 0 && d.getUTCSeconds() === 0
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }
  if (!isMidnightUtc) {
    opts.hour = '2-digit'
    opts.minute = '2-digit'
  }
  return d.toLocaleDateString('en-GB', opts)
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

function hasWinner(play: Play): boolean {
  return play.players.some(p => p.isWinner)
}

function isSingleTeam(play: Play): boolean {
  if (play.players.length <= 1) return true
  const tags = play.players.map(p => p.teamTag).filter(Boolean)
  if (tags.length === 0) return false
  return new Set(tags).size <= 1
}

function outcomeEntries(play: Play): { name: string, won: boolean }[] {
  const tags = new Set(play.players.map(p => p.teamTag).filter(Boolean))

  if (tags.size > 1) {
    const teamResults = new Map<string, boolean>()
    for (const p of play.players) {
      if (p.teamTag && !teamResults.has(p.teamTag)) {
        teamResults.set(p.teamTag, !!p.isWinner)
      }
    }
    return [...teamResults.entries()].map(([name, won]) => ({ name, won }))
  }

  return play.players.map(p => ({
    name: resolveName(p.mateId, p.mateName),
    won: !!p.isWinner,
  }))
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

.game-plays-table__place {
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.game-plays-table__outcome {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  color: var(--color-text-secondary);
}

.game-plays-table__outcome--win {
  color: var(--color-crown);
}

.game-plays-table__outcome--loss {
  color: var(--color-text-disabled);
}

.game-plays-table__outcome--progress {
  color: var(--color-warning);
  font-weight: var(--font-weight-normal);
}

.game-plays-table__outcome-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.game-plays-table__outcome-entry {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--font-size-xs);
}

.game-plays-table__outcome-name {
  color: var(--color-text-secondary);
}
</style>
