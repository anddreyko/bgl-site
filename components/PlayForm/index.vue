<template>
  <form
    class="play-form"
    @submit.prevent="handleSubmit"
  >
    <!-- Game search -->
    <UiFormField
      label="Game"
      field-id="play-game"
    >
      <div class="play-form__game-search">
        <UiInput
          id="play-game"
          v-model="gameQuery"
          placeholder="Search for a game..."
          @update:model-value="onGameSearch"
        />
        <ul
          v-if="gameResults.length > 0 && gameDropdownOpen"
          class="play-form__game-dropdown"
          role="listbox"
          aria-label="Game search results"
        >
          <li
            v-for="game in gameResults"
            :key="game.id"
            class="play-form__game-option"
            role="option"
            :aria-selected="selectedGameId === game.id"
            @click="selectGame(game)"
          >
            {{ game.name }}
          </li>
        </ul>
      </div>
    </UiFormField>

    <!-- Visibility -->
    <UiFormField
      label="Visibility"
      field-id="play-visibility"
      required
    >
      <UiSelect
        id="play-visibility"
        :model-value="visibility"
        :options="visibilityOptions"
        placeholder="Select visibility"
        @update:model-value="visibility = $event"
      />
    </UiFormField>

    <!-- Players -->
    <fieldset class="play-form__players-section">
      <legend class="play-form__players-legend">Players</legend>

      <div
        v-for="(player, index) in players"
        :key="index"
        class="play-form__player-row"
      >
        <UiFormField
          :label="`Player ${index + 1}`"
          :field-id="`player-mate-${index}`"
        >
          <UiSelect
            :id="`player-mate-${index}`"
            :model-value="player.mateId"
            :options="mateOptions"
            placeholder="Select mate"
            @update:model-value="player.mateId = $event"
          />
        </UiFormField>

        <UiFormField
          label="Score"
          :field-id="`player-score-${index}`"
        >
          <UiInput
            :id="`player-score-${index}`"
            :model-value="String(player.score ?? '')"
            type="number"
            placeholder="Score"
            @update:model-value="player.score = $event ? Number($event) : undefined"
          />
        </UiFormField>

        <UiFormField
          label="Color"
          :field-id="`player-color-${index}`"
        >
          <UiInput
            :id="`player-color-${index}`"
            :model-value="player.color ?? ''"
            type="color"
            @update:model-value="player.color = $event || undefined"
          />
        </UiFormField>

        <label class="play-form__winner-label">
          <input
            type="checkbox"
            :checked="player.winner"
            @change="player.winner = ($event.target as HTMLInputElement).checked"
          />
          Winner
        </label>

        <UiButton
          variant="ghost"
          size="sm"
          aria-label="Remove player"
          @click="removePlayer(index)"
        >
          Remove
        </UiButton>
      </div>

      <UiButton
        variant="secondary"
        size="sm"
        type="button"
        @click="addPlayer"
      >
        Add player
      </UiButton>
    </fieldset>

    <!-- Submit -->
    <UiButton
      variant="record"
      type="submit"
      :loading="submitting"
      :disabled="submitting"
    >
      Start Play
    </UiButton>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Mate, PlayCreatePayload, Visibility, Player } from '~/types'
import UiFormField from '~/components/UiFormField/index.vue'
import UiInput from '~/components/UiInput/index.vue'
import UiSelect from '~/components/UiSelect/index.vue'
import UiButton from '~/components/UiButton/index.vue'

type PlayerDraft = Omit<Player, 'id'>

const props = defineProps<{
  mates?: Mate[]
}>()

const emit = defineEmits<{
  submit: [payload: PlayCreatePayload]
}>()

const gameQuery = ref('')
const selectedGameId = ref<string | undefined>(undefined)
const gameResults = ref<Array<{ id: string, name: string }>>([])
const gameDropdownOpen = ref(false)
const visibility = ref<Visibility>('private')
const players = ref<PlayerDraft[]>([])
const submitting = ref(false)

let searchTimeout: ReturnType<typeof setTimeout> | null = null

const visibilityOptions = [
  { value: 'private', label: 'Private' },
  { value: 'participants', label: 'Participants' },
  { value: 'link', label: 'Link' },
  { value: 'authenticated', label: 'Authenticated' },
  { value: 'public', label: 'Public' },
]

const mateOptions = computed(() =>
  (props.mates ?? []).map(m => ({ value: m.id, label: m.name })),
)

function onGameSearch(query: string) {
  if (searchTimeout) clearTimeout(searchTimeout)

  if (!query.trim()) {
    gameResults.value = []
    gameDropdownOpen.value = false
    selectedGameId.value = undefined
    return
  }

  searchTimeout = setTimeout(async () => {
    try {
      const data = await $fetch<Array<{ id: string, name: string }>>('/api/games', {
        query: { q: query },
      })
      gameResults.value = data
      gameDropdownOpen.value = true
    }
    catch {
      gameResults.value = []
    }
  }, 300)
}

function selectGame(game: { id: string, name: string }) {
  selectedGameId.value = game.id
  gameQuery.value = game.name
  gameDropdownOpen.value = false
  gameResults.value = []
}

function addPlayer() {
  players.value.push({
    mateId: '',
    score: undefined,
    color: undefined,
    winner: false,
  })
}

function removePlayer(index: number) {
  players.value.splice(index, 1)
}

function handleSubmit() {
  submitting.value = true

  const payload: PlayCreatePayload = {
    gameId: selectedGameId.value,
    startedAt: new Date().toISOString(),
    visibility: visibility.value,
    players: players.value.filter(p => p.mateId),
  }

  emit('submit', payload)
  submitting.value = false
}
</script>

<style scoped>
.play-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.play-form__game-search {
  position: relative;
}

.play-form__game-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: var(--z-dialog);
  list-style: none;
  padding: var(--space-1);
  margin: var(--space-1) 0 0;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  max-height: 12rem;
  overflow-y: auto;
}

.play-form__game-option {
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: var(--font-size-sm);
}

.play-form__game-option:hover {
  background-color: var(--color-surface-sunken);
}

.play-form__players-section {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.play-form__players-legend {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  padding: 0 var(--space-1);
}

.play-form__player-row {
  display: flex;
  align-items: flex-end;
  gap: var(--space-2);
  flex-wrap: wrap;
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-border);
}

.play-form__winner-label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--font-size-sm);
  cursor: pointer;
  padding-bottom: var(--space-2);
}
</style>
