<template>
  <form
    class="play-form"
    @submit.prevent="handleSubmit"
  >
    <!-- Session name -->
    <UiFormField
      label="Session Name"
      field-id="play-name"
    >
      <UiInput
        id="play-name"
        v-model="sessionName"
        placeholder="Optional session name"
      />
    </UiFormField>

    <!-- Game search -->
    <UiFormField
      label="Game"
      field-id="play-game"
    >
      <div
        class="play-form__game-search"
        @focusout="onSearchFocusOut"
      >
        <UiInput
          id="play-game"
          v-model="gameQuery"
          placeholder="Search for a game..."
          role="combobox"
          aria-autocomplete="list"
          :aria-expanded="gameDropdownOpen && gameResults.length > 0"
          aria-controls="play-game-listbox"
          @update:model-value="onGameSearch"
          @keydown.escape="gameDropdownOpen = false"
        />
        <ul
          v-if="gameResults.length > 0 && gameDropdownOpen"
          id="play-game-listbox"
          class="play-form__game-dropdown"
          role="listbox"
          aria-label="Game search results"
        >
          <li
            v-for="game in gameResults"
            :key="game.id"
            class="play-form__game-option"
            role="option"
            tabindex="0"
            :aria-selected="selectedGameId === game.id"
            @click="selectGame(game)"
            @keydown.enter.prevent="selectGame(game)"
          >
            <img
              v-if="game.image"
              :src="game.image"
              :alt="game.name"
              class="play-form__game-thumb"
            />
            {{ game.name }}
          </li>
        </ul>
      </div>
    </UiFormField>

    <!-- Start time -->
    <UiFormField
      label="Start Time"
      field-id="play-started-at"
    >
      <UiInput
        id="play-started-at"
        v-model="startedAtLocal"
        type="datetime-local"
      />
    </UiFormField>

    <!-- Duration mode -->
    <UiFormField
      label="Duration"
      field-id="play-duration-mode"
    >
      <div class="play-form__duration-toggle">
        <label class="play-form__radio-label">
          <input
            v-model="durationMode"
            type="radio"
            value="stopwatch"
          />
          Stopwatch
        </label>
        <label class="play-form__radio-label">
          <input
            v-model="durationMode"
            type="radio"
            value="manual"
          />
          Manual
        </label>
      </div>
    </UiFormField>

    <UiFormField
      v-if="durationMode === 'manual'"
      label="End Time"
      field-id="play-finished-at"
    >
      <UiInput
        id="play-finished-at"
        v-model="finishedAtLocal"
        type="datetime-local"
      />
    </UiFormField>

    <!-- Place -->
    <UiFormField
      label="Place"
      field-id="play-place"
    >
      <UiSelect
        id="play-place"
        :model-value="selectedPlaceId ?? ''"
        :options="placeOptions"
        placeholder="Select place"
        @update:model-value="selectedPlaceId = $event || undefined"
      />
    </UiFormField>
    <div class="play-form__place-actions">
      <button
        type="button"
        class="play-form__create-mate-link"
        @click="openNewPlaceDialog"
      >
        Create new place
      </button>
    </div>

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
        @update:model-value="visibility = $event as Visibility"
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
          <ColorPicker
            :model-value="player.color"
            :label="`Color for player ${index + 1}`"
            @update:model-value="player.color = $event"
          />
        </UiFormField>

        <UiFormField
          label="Team"
          :field-id="`player-team-${index}`"
        >
          <UiInput
            :id="`player-team-${index}`"
            :model-value="player.teamTag ?? ''"
            placeholder="Team tag"
            @update:model-value="player.teamTag = $event || undefined"
          />
        </UiFormField>

        <label class="play-form__winner-label">
          <input
            type="checkbox"
            :checked="player.isWinner"
            @change="player.isWinner = ($event.target as HTMLInputElement).checked"
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

      <div class="play-form__player-actions">
        <div class="play-form__player-actions-row">
          <UiButton
            variant="secondary"
            size="sm"
            type="button"
            @click="addPlayer"
          >
            Add player
          </UiButton>
          <UiButton
            v-if="automaMate"
            variant="ghost"
            size="sm"
            type="button"
            class="play-form__system-btn"
            aria-label="Add Automa"
            @click="addSystemPlayer(automaMate!)"
          >
            <span class="play-form__system-label">Automa</span>
            <span
              class="play-form__system-icon"
              v-html="robotSvg"
            />
          </UiButton>
          <UiButton
            v-if="anonymousMate"
            variant="ghost"
            size="sm"
            type="button"
            class="play-form__system-btn"
            aria-label="Add Anonymous"
            @click="addSystemPlayer(anonymousMate!)"
          >
            <span class="play-form__system-label">Anonymous</span>
            <span
              class="play-form__system-icon"
              v-html="anonymousSvg"
            />
          </UiButton>
        </div>
        <button
          type="button"
          class="play-form__create-mate-link"
          @click="openNewMateDialog"
        >
          Create new mate
        </button>
      </div>
    </fieldset>

    <!-- Submit -->
    <UiButton
      variant="record"
      type="submit"
    >
      {{ submitLabel ?? 'Start Play' }}
    </UiButton>

    <!-- New mate dialog -->
    <UiDialog
      :open="newMateDialogOpen"
      title="Create Mate"
      @update:open="!$event && closeNewMateDialog()"
    >
      <MateForm
        :loading="creatingMate"
        @submit="handleNewMate"
        @cancel="closeNewMateDialog"
      />
    </UiDialog>

    <!-- New place dialog -->
    <UiDialog
      :open="newPlaceDialogOpen"
      title="Create Place"
      @update:open="!$event && closeNewPlaceDialog()"
    >
      <PlaceForm
        :loading="creatingPlace"
        @submit="handleNewPlace"
        @cancel="closeNewPlaceDialog"
      />
    </UiDialog>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Mate, MatePayload, Place, PlacePayload, Play, PlayCreatePayload, Visibility } from '~/types'
import UiFormField from '~/components/UiFormField/index.vue'
import UiInput from '~/components/UiInput/index.vue'
import UiSelect from '~/components/UiSelect/index.vue'
import UiButton from '~/components/UiButton/index.vue'
import UiDialog from '~/components/UiDialog/index.vue'
import ColorPicker from '~/components/ColorPicker/index.vue'
import MateForm from '~/components/MateForm/index.vue'
import PlaceForm from '~/components/PlaceForm/index.vue'
import robotSvg from '~/assets/icons/robot.svg?raw'
import anonymousSvg from '~/assets/icons/anonymous.svg?raw'

interface PlayerDraft {
  mateId: string
  score?: number
  color?: string
  teamTag?: string
  isWinner?: boolean
}

const props = defineProps<{
  mates?: Mate[]
  systemMates?: Mate[]
  places?: Place[]
  initialData?: Play | null
  submitLabel?: string
}>()

const emit = defineEmits<{
  submit: [payload: PlayCreatePayload]
}>()

const init = props.initialData
const gameQuery = ref(init?.game?.name ?? init?.gameName ?? '')
const selectedGameId = ref<string | undefined>(init?.game?.id)
const gameResults = ref<Array<{ id: string, name: string, image?: string }>>([])
const gameDropdownOpen = ref(false)
const sessionName = ref(init?.name ?? '')
const startedAtLocal = ref(toLocalDatetime(init?.startedAt ? new Date(init.startedAt) : new Date()))
const finishedAtLocal = ref(init?.finishedAt ? toLocalDatetime(new Date(init.finishedAt)) : '')
const durationMode = ref<'stopwatch' | 'manual'>(init?.finishedAt ? 'manual' : 'stopwatch')
const selectedPlaceId = ref<string | undefined>(init?.location?.id)
const visibility = ref<Visibility>(init?.visibility ?? 'private')
const players = ref<PlayerDraft[]>(
  init?.players?.map(p => ({
    mateId: p.mate?.id ?? '',
    score: p.score,
    color: p.color,
    teamTag: p.teamTag,
    isWinner: p.isWinner,
  })) ?? [],
)
let searchTimeout: ReturnType<typeof setTimeout> | null = null

function toLocalDatetime(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function toW3CDatetime(d: Date): string {
  return d.toISOString().replace(/\.\d{3}Z$/, 'Z')
}

const visibilityOptions = [
  { value: 'private', label: 'Private' },
  { value: 'participants', label: 'Participants' },
  { value: 'link', label: 'Link' },
  { value: 'authenticated', label: 'Authenticated' },
  { value: 'public', label: 'Public' },
]

const placeOptions = computed(() => {
  const existing = (props.places ?? []).map(p => ({ value: p.id, label: p.name }))
  const existingIds = new Set(existing.map(o => o.value))
  const created = createdPlaces.value
    .filter(p => !existingIds.has(p.id))
    .map(p => ({ value: p.id, label: p.name }))
  return [...existing, ...created]
})

const mateOptions = computed(() => {
  const system = (props.systemMates ?? []).map(m => ({ value: m.id, label: m.name, group: 'system' }))
  const regular = (props.mates ?? []).map(m => ({ value: m.id, label: m.name }))
  const existingIds = new Set([...system, ...regular].map(o => o.value))
  const created = createdMates.value
    .filter(m => !existingIds.has(m.id))
    .map(m => ({ value: m.id, label: m.name }))
  return [...system, ...regular, ...created]
})

function onGameSearch(query: string) {
  if (searchTimeout) clearTimeout(searchTimeout)

  if (!query.trim() || query.trim().length < 3) {
    gameResults.value = []
    gameDropdownOpen.value = false
    if (!query.trim()) selectedGameId.value = undefined
    return
  }

  searchTimeout = setTimeout(async () => {
    try {
      const data = await $fetch<{ items: Array<{ id: string, name: string, image?: string }> }>('/api/games', {
        query: { q: query },
      })
      gameResults.value = data.items
      gameDropdownOpen.value = true
    }
    catch {
      gameResults.value = []
    }
  }, 300)
}

function onSearchFocusOut(e: FocusEvent) {
  const container = e.currentTarget as HTMLElement
  if (!container.contains(e.relatedTarget as Node)) {
    gameDropdownOpen.value = false
  }
}

function selectGame(game: { id: string, name: string }) {
  selectedGameId.value = game.id
  gameQuery.value = game.name
  gameDropdownOpen.value = false
  gameResults.value = []
}

const newMateDialogOpen = ref(false)
const creatingMate = ref(false)
const createdMates = ref<Array<{ id: string, name: string }>>([])

function openNewMateDialog() {
  newMateDialogOpen.value = true
}

function closeNewMateDialog() {
  newMateDialogOpen.value = false
}

async function handleNewMate(payload: MatePayload) {
  creatingMate.value = true
  try {
    const mate = await $fetch<Mate>('/api/mates', {
      method: 'POST',
      body: payload,
    })
    createdMates.value.push({ id: mate.id, name: mate.name })
    closeNewMateDialog()
  }
  finally {
    creatingMate.value = false
  }
}

const newPlaceDialogOpen = ref(false)
const creatingPlace = ref(false)
const createdPlaces = ref<Array<{ id: string, name: string }>>([])

function openNewPlaceDialog() {
  newPlaceDialogOpen.value = true
}

function closeNewPlaceDialog() {
  newPlaceDialogOpen.value = false
}

async function handleNewPlace(payload: PlacePayload) {
  creatingPlace.value = true
  try {
    const place = await $fetch<Place>('/api/places', {
      method: 'POST',
      body: payload,
    })
    createdPlaces.value.push({ id: place.id, name: place.name })
    selectedPlaceId.value = place.id
    closeNewPlaceDialog()
  }
  finally {
    creatingPlace.value = false
  }
}

const automaMate = computed(() =>
  (props.systemMates ?? []).find(m => m.id === '00000000-0000-4000-a000-000000000002'),
)

const anonymousMate = computed(() =>
  (props.systemMates ?? []).find(m => m.id === '00000000-0000-4000-a000-000000000001'),
)

function addSystemPlayer(mate: Mate) {
  players.value.push({
    mateId: mate.id,
    score: undefined,
    color: undefined,
    teamTag: undefined,
    isWinner: false,
  })
}

function addPlayer() {
  players.value.push({
    mateId: '',
    score: undefined,
    color: undefined,
    teamTag: undefined,
    isWinner: false,
  })
}

function removePlayer(index: number) {
  players.value.splice(index, 1)
}

function handleSubmit() {
  const filteredPlayers = players.value.filter(p => p.mateId)

  const payload: PlayCreatePayload = {
    gameId: selectedGameId.value || undefined,
    locationId: selectedPlaceId.value || undefined,
    name: sessionName.value || undefined,
    startedAt: toW3CDatetime(startedAtLocal.value ? new Date(startedAtLocal.value) : new Date()),
    finishedAt: durationMode.value === 'manual' && finishedAtLocal.value
      ? toW3CDatetime(new Date(finishedAtLocal.value))
      : undefined,
    visibility: visibility.value,
    players: filteredPlayers.length > 0
      ? filteredPlayers.map(p => ({ mateId: p.mateId, score: p.score, isWinner: p.isWinner, color: p.color, teamTag: p.teamTag || undefined }))
      : undefined,
  }

  emit('submit', payload)
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

.play-form__game-thumb {
  width: 1.5rem;
  height: 1.5rem;
  object-fit: cover;
  border-radius: var(--radius-sm);
  vertical-align: middle;
  margin-right: var(--space-2);
}

.play-form__duration-toggle {
  display: flex;
  gap: var(--space-4);
}

.play-form__radio-label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--font-size-sm);
  cursor: pointer;
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: end;
  gap: var(--space-2);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-border);
}

.play-form__place-actions {
  display: flex;
  justify-content: center;
}

.play-form__player-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.play-form__player-actions-row {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

.play-form__system-btn::before {
  content: '+';
}

.play-form__system-icon {
  display: none;
  width: 28px;
  height: 28px;
}

@media (width <= 768px) {
  .play-form__system-label {
    display: none;
  }

  .play-form__system-icon {
    display: flex;
  }
}

.play-form__system-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.play-form__create-mate-link {
  align-self: center;
  background: none;
  border: none;
  padding: var(--space-1) 0;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  text-decoration: underline;
  cursor: pointer;
}

.play-form__create-mate-link:hover {
  color: var(--color-text-primary);
}

.play-form__winner-label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--font-size-sm);
  cursor: pointer;
  padding: var(--space-1) var(--space-3);
}
</style>
