<template>
  <div class="page-layout">
    <UiSpinner
      v-if="pending"
      size="lg"
    />

    <p
      v-else-if="!play"
      class="play-detail__error"
      role="alert"
    >
      Play not found
    </p>

    <template v-else>
      <div class="play-detail__header">
        <div class="play-detail__titles">
          <h2 class="play-detail__title">
            <NuxtLink
              v-if="!play.name && play.game"
              :to="`/game/${play.game.id}`"
              class="play-detail__game-link"
            >
              {{ play.game.name }}
            </NuxtLink>
            <template v-else>
              {{ play.name || play.gameName || `Play #${play.id.slice(0, 8)}` }}
            </template>
          </h2>
          <p
            v-if="play.game"
            class="play-detail__subtitle"
          >
            <NuxtLink
              :to="`/game/${play.game.id}`"
              class="play-detail__game-link"
            >
              {{ play.game.name }}
            </NuxtLink>
          </p>
          <p
            v-else-if="play.gameName"
            class="play-detail__subtitle"
          >
            {{ play.gameName }}
          </p>
        </div>
        <div class="play-detail__actions">
          <UiButton
            v-if="play.status === 'current'"
            variant="record"
            @click="onFinishPlay"
          >
            Finish Play
          </UiButton>
          <UiButton
            variant="ghost"
            @click="openEditOverlay"
          >
            Edit
          </UiButton>
          <UiButton
            variant="ghost"
            @click="confirmDelete = true"
          >
            Delete
          </UiButton>
        </div>
      </div>

      <div class="play-detail__meta">
        <div class="play-detail__badges">
          <UiBadge
            v-if="play.status === 'current'"
            variant="warning"
          >
            In progress
          </UiBadge>
          <UiBadge variant="info">{{ play.visibility }}</UiBadge>
        </div>

        <p
          v-if="play.author"
          class="play-detail__author"
        >
          by <NuxtLink :to="`/user/${play.author.name}`">{{ play.author.name }}</NuxtLink>
        </p>

        <div class="play-detail__time">
          <p class="play-detail__started">
            Started: <time :datetime="play.startedAt">{{ formattedStarted }}</time>
          </p>
          <p
            v-if="play.finishedAt"
            class="play-detail__finished"
          >
            Finished: <time :datetime="play.finishedAt">{{ formattedFinished }}</time>
            ({{ formattedDuration }})
          </p>
          <div
            v-else-if="play.status === 'current'"
            class="play-detail__timer"
          >
            <span>In progress: </span>
            <UiTimer
              :started-at="play.startedAt"
              :running="true"
            />
          </div>
        </div>
      </div>

      <p
        v-if="play.notes"
        class="play-detail__notes"
      >
        {{ play.notes }}
      </p>

      <section class="play-detail__section">
        <h3>Players ({{ play.players.length }})</h3>
        <ul
          v-if="play.players.length > 0"
          class="play-detail__players"
          aria-label="Players"
        >
          <li
            v-for="player in play.players"
            :key="player.id"
            class="play-detail__player"
          >
            <PlayerBadge
              :player="player"
            />
          </li>
        </ul>
        <p v-else>No players</p>
      </section>
    </template>

    <!-- Delete confirmation -->
    <UiOverlay
      :open="confirmDelete"
      title="Delete Play"
      @update:open="confirmDelete = $event"
    >
      <div class="play-detail__confirm">
        <p>Are you sure you want to delete this play? This cannot be undone.</p>
        <div class="play-detail__confirm-actions">
          <UiButton
            variant="danger"
            :loading="deleting"
            @click="onDeletePlay"
          >
            Delete
          </UiButton>
          <UiButton
            variant="secondary"
            @click="confirmDelete = false"
          >
            Cancel
          </UiButton>
        </div>
      </div>
    </UiOverlay>

    <UiOverlay
      :open="overlayOpen"
      title="Edit Play"
      @update:open="overlayOpen = $event"
    >
      <PlayForm
        :initial-data="play"
        :mates="editMates"
        :system-mates="editSystemMates"
        :places="editPlaces"
        submit-label="Save"
        @submit="onUpdatePlay"
      />
    </UiOverlay>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Play, PlayCreatePayload, PlayUpdatePayload } from '~/types'
import UiSpinner from '~/components/UiSpinner/index.vue'
import UiButton from '~/components/UiButton/index.vue'
import UiBadge from '~/components/UiBadge/index.vue'
import UiTimer from '~/components/UiTimer/index.vue'
import UiOverlay from '~/components/UiOverlay/index.vue'
import PlayForm from '~/components/PlayForm/index.vue'
import PlayerBadge from '~/components/PlayerBadge/index.vue'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const playId = route.params.id as string

useHead({ title: '4Record > Play Detail' })

const { activePlay } = useActivePlay()
const { set: setBreadcrumb, clear: clearBreadcrumb } = useBreadcrumbLabel()

const overlayOpen = ref(false)
const confirmDelete = ref(false)
const deleting = ref(false)

const editMates = ref<import('~/types').Mate[]>([])
const editSystemMates = ref<import('~/types').Mate[]>([])
const editPlaces = ref<import('~/types').Place[]>([])

async function loadEditData() {
  const [matesRes, placesRes] = await Promise.all([
    $fetch<{ items: import('~/types').Mate[] }>('/api/mates', { query: { size: 100 } }),
    $fetch<{ items: import('~/types').Place[] }>('/api/places', { query: { size: 100 } }),
  ])
  editMates.value = matesRes.items.filter(m => !m.isSystem)
  editSystemMates.value = matesRes.items.filter(m => m.isSystem)
  editPlaces.value = placesRes.items
}

function openEditOverlay() {
  overlayOpen.value = true
  loadEditData()
}

const requestFetch = useRequestFetch()
const { data: play, pending, refresh } = await useAsyncData<Play>(
  `play-${playId}`,
  () => requestFetch<Play>(`/api/plays/${playId}`),
)

const formattedStarted = computed(() => {
  if (!play.value) return ''
  return new Date(play.value.startedAt).toLocaleString('en-US')
})

const formattedFinished = computed(() => {
  if (!play.value?.finishedAt) return ''
  return new Date(play.value.finishedAt).toLocaleString('en-US')
})

const formattedDuration = computed(() => {
  if (!play.value?.finishedAt) return ''
  const start = new Date(play.value.startedAt).getTime()
  const end = new Date(play.value.finishedAt).getTime()
  const totalSeconds = Math.max(0, Math.floor((end - start) / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
})

async function onFinishPlay() {
  if (!play.value) return

  await $fetch(`/api/plays/${play.value.id}`, {
    method: 'PATCH',
    body: { finishedAt: new Date().toISOString() },
  })

  if (activePlay.value?.id === play.value.id) {
    activePlay.value = null
  }

  await refresh()
}

async function onDeletePlay() {
  deleting.value = true
  try {
    await $fetch(`/api/plays/${playId}`, { method: 'DELETE' })
    if (activePlay.value?.id === playId) {
      activePlay.value = null
    }
    await navigateTo('/plays')
  }
  finally {
    deleting.value = false
    confirmDelete.value = false
  }
}

async function onUpdatePlay(payload: PlayCreatePayload) {
  if (!play.value) return

  const body: PlayUpdatePayload = {
    name: payload.name,
    notes: payload.notes,
    gameId: payload.gameId,
    locationId: payload.locationId,
    visibility: payload.visibility,
    players: payload.players,
  }
  await $fetch(`/api/plays/${playId}`, { method: 'PUT', body })
  overlayOpen.value = false
  await refresh()
}

// Set breadcrumb when data loads
watch(play, (val) => {
  if (val) {
    setBreadcrumb(val.game?.name || val.gameName || val.name || `Play #${val.id.slice(0, 8)}`)
  }
}, { immediate: true })

onUnmounted(() => clearBreadcrumb())
</script>

<style scoped>
.play-detail__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.play-detail__titles {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.play-detail__title {
  margin: 0;
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.play-detail__subtitle {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.play-detail__game-link {
  color: inherit;
  text-decoration: none;
}

.play-detail__game-link:hover {
  text-decoration: underline;
}

.play-detail__actions {
  display: flex;
  gap: var(--space-2);
}

.play-detail__meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.play-detail__badges {
  display: flex;
  gap: var(--space-2);
}

.play-detail__author {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.play-detail__author a {
  color: var(--color-primary);
  text-decoration: none;
}

.play-detail__author a:hover {
  text-decoration: underline;
}

.play-detail__time {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.play-detail__time p {
  margin: 0;
}

.play-detail__timer {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.play-detail__error {
  color: var(--color-danger);
  font-size: var(--font-size-md);
}

.play-detail__notes {
  margin: 0;
  font-size: var(--font-size-md);
  color: var(--color-text-secondary);
  white-space: pre-line;
}

.play-detail__section h3 {
  margin: 0 0 var(--space-2);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
}

.play-detail__section p {
  margin: 0;
}

.play-detail__players {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.play-detail__player {
  padding: var(--space-2) var(--space-3);
  background-color: var(--color-surface-raised);
  border-radius: var(--radius-md);
}

.play-detail__confirm {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.play-detail__confirm-actions {
  display: flex;
  gap: var(--space-3);
}
</style>
