<template>
  <div class="play-detail">
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
        <h2 class="play-detail__title">
          {{ play.game?.name ?? play.gameName ?? 'No game' }}
        </h2>
        <div class="play-detail__actions">
          <UiButton
            variant="secondary"
            @click="overlayOpen = true"
          >
            Edit
          </UiButton>
          <UiButton
            v-if="!play.finishedAt"
            variant="record"
            @click="onFinishPlay"
          >
            Finish Play
          </UiButton>
        </div>
      </div>

      <div class="play-detail__meta">
        <div class="play-detail__badges">
          <UiBadge :variant="statusVariant">{{ play.status }}</UiBadge>
          <UiBadge variant="info">{{ play.visibility }}</UiBadge>
        </div>

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
            v-else
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

      <section
        v-if="play.name"
        class="play-detail__section"
      >
        <h3>Name</h3>
        <p>{{ play.name }}</p>
      </section>

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
            <span
              v-if="player.color"
              class="play-detail__player-color"
              :style="{ backgroundColor: player.color }"
              aria-hidden="true"
            />
            <span class="play-detail__player-name">{{ player.mateName ?? player.mateId }}</span>
            <span
              v-if="player.score != null"
              class="play-detail__player-score"
            >
              Score: {{ player.score }}
            </span>
            <UiBadge
              v-if="player.winner"
              variant="success"
            >
              Winner
            </UiBadge>
          </li>
        </ul>
        <p v-else>No players</p>
      </section>
    </template>

    <UiOverlay
      :open="overlayOpen"
      title="Edit Play"
      @update:open="overlayOpen = $event"
    >
      <form
        class="play-detail__edit-form"
        @submit.prevent="onUpdatePlay"
      >
        <UiFormField
          label="Name"
          field-id="edit-name"
        >
          <UiInput
            id="edit-name"
            v-model="editName"
            placeholder="Play name"
          />
        </UiFormField>

        <UiFormField
          label="Visibility"
          field-id="edit-visibility"
          required
        >
          <UiSelect
            id="edit-visibility"
            :model-value="editVisibility"
            :options="visibilityOptions"
            @update:model-value="editVisibility = $event as Visibility"
          />
        </UiFormField>

        <UiButton
          variant="primary"
          type="submit"
          :loading="updating"
        >
          Save
        </UiButton>
      </form>
    </UiOverlay>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Play, PlayUpdatePayload, Visibility } from '~/types'
import UiSpinner from '~/components/UiSpinner/index.vue'
import UiButton from '~/components/UiButton/index.vue'
import UiBadge from '~/components/UiBadge/index.vue'
import UiTimer from '~/components/UiTimer/index.vue'
import UiOverlay from '~/components/UiOverlay/index.vue'
import UiFormField from '~/components/UiFormField/index.vue'
import UiInput from '~/components/UiInput/index.vue'
import UiSelect from '~/components/UiSelect/index.vue'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const playId = route.params.id as string

useHead({ title: '4Record > Play Detail' })

const { activePlay } = useActivePlay()

const overlayOpen = ref(false)
const updating = ref(false)
const editName = ref('')
const editVisibility = ref<Visibility>('private')

const visibilityOptions = [
  { value: 'private', label: 'Private' },
  { value: 'participants', label: 'Participants' },
  { value: 'link', label: 'Link' },
  { value: 'authenticated', label: 'Authenticated' },
  { value: 'public', label: 'Public' },
]

const { data: play, pending, refresh } = await useAsyncData<Play>(
  `play-${playId}`,
  () => $fetch<Play>(`/api/plays/${playId}`),
)

const statusVariant = computed(() => {
  switch (play.value?.status) {
    case 'published': return 'success'
    case 'deleted': return 'danger'
    default: return 'warning'
  }
})

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

  await $fetch(`/api/plays/${play.value.id}/finish`, {
    method: 'PATCH',
    body: { finished_at: new Date().toISOString() },
  })

  if (activePlay.value?.id === play.value.id) {
    activePlay.value = null
  }

  await refresh()
}

async function onUpdatePlay() {
  if (!play.value) return

  updating.value = true
  try {
    const body: PlayUpdatePayload = {
      name: editName.value || undefined,
      visibility: editVisibility.value,
    }
    await $fetch(`/api/plays/${playId}`, { method: 'PUT', body })
    overlayOpen.value = false
    await refresh()
  }
  finally {
    updating.value = false
  }
}

// Pre-fill edit form when data loads
watch(play, (val) => {
  if (val) {
    editName.value = val.name ?? ''
    editVisibility.value = val.visibility
  }
}, { immediate: true })
</script>

<style scoped>
.play-detail {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.play-detail__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.play-detail__title {
  margin: 0;
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
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
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background-color: var(--color-surface-raised);
  border-radius: var(--radius-md);
}

.play-detail__player-color {
  width: 1rem;
  height: 1rem;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.play-detail__player-name {
  flex: 1;
  font-weight: var(--font-weight-medium);
}

.play-detail__player-score {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.play-detail__edit-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
</style>
