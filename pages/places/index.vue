<template>
  <div class="page-layout">
    <div class="places-page__header">
      <h1 class="places-page__title">My Places</h1>
      <UiButton @click="openAddDialog">
        Add Place
      </UiButton>
    </div>

    <div class="places-page__controls">
      <UiSelect
        :model-value="sortValue"
        :options="sortOptions"
        @update:model-value="onSortChange"
      />
    </div>

    <div
      v-if="loading"
      class="places-page__loading"
    >
      <UiSpinner size="lg" />
    </div>

    <div
      v-else-if="error"
      class="places-page__error"
      role="alert"
    >
      <p>{{ error }}</p>
      <UiButton
        variant="secondary"
        @click="fetchPlaces"
      >
        Retry
      </UiButton>
    </div>

    <div
      v-else-if="places.length === 0"
      class="places-page__empty"
    >
      <p>No places yet. Add your first place to get started.</p>
    </div>

    <div
      v-else
      class="places-page__grid"
    >
      <PlaceCard
        v-for="place in places"
        :key="place.id"
        :place="place"
        @edit="openEditDialog"
        @delete="openDeleteDialog"
      />
    </div>

    <UiPagination
      v-if="totalPages > 1"
      :page="currentPage"
      :total="total"
      :size="pageSize"
      @update:page="onPageChange"
    />

    <!-- Add Dialog -->
    <UiDialog
      :open="addDialogOpen"
      title="Add Place"
      @update:open="addDialogOpen = $event"
    >
      <PlaceForm
        :loading="formLoading"
        @submit="handleCreate"
        @cancel="addDialogOpen = false"
      />
    </UiDialog>

    <!-- Edit Dialog -->
    <UiDialog
      :open="editDialogOpen"
      title="Edit Place"
      @update:open="editDialogOpen = $event"
    >
      <PlaceForm
        :place="selectedPlace ?? undefined"
        :loading="formLoading"
        @submit="handleUpdate"
        @cancel="editDialogOpen = false"
      />
    </UiDialog>

    <!-- Delete Confirmation Dialog -->
    <UiDialog
      :open="deleteDialogOpen"
      title="Delete Place"
      :description="`Are you sure you want to delete ${selectedPlace?.name ?? 'this place'}? This action cannot be undone.`"
      @update:open="deleteDialogOpen = $event"
    >
      <div class="places-page__delete-actions">
        <UiButton
          variant="danger"
          :loading="formLoading"
          @click="handleDelete"
        >
          Delete
        </UiButton>
        <UiButton
          variant="secondary"
          :disabled="formLoading"
          @click="deleteDialogOpen = false"
        >
          Cancel
        </UiButton>
      </div>
    </UiDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { Place, PlacePayload } from '~/types'
import { usePlaces } from '~/composables/usePlaces'
import PlaceCard from '~/components/PlaceCard/index.vue'
import PlaceForm from '~/components/PlaceForm/index.vue'
import UiButton from '~/components/UiButton/index.vue'
import UiDialog from '~/components/UiDialog/index.vue'
import UiPagination from '~/components/UiPagination/index.vue'
import UiSelect from '~/components/UiSelect/index.vue'
import UiSpinner from '~/components/UiSpinner/index.vue'

definePageMeta({ middleware: 'auth' })
useHead({ title: '4Record > My Places' })

const {
  places,
  total,
  totalPages,
  currentPage,
  pageSize,
  sortBy,
  sortOrder,
  loading,
  error,
  fetchPlaces,
  createPlace,
  updatePlace,
  deletePlace,
} = usePlaces()

const addDialogOpen = ref(false)
const editDialogOpen = ref(false)
const deleteDialogOpen = ref(false)
const selectedPlace = ref<Place | null>(null)
const formLoading = ref(false)

const sortOptions = [
  { value: 'name-asc', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' },
  { value: 'createdAt-desc', label: 'Newest first' },
  { value: 'createdAt-asc', label: 'Oldest first' },
]

const sortValue = computed(() => `${sortBy.value}-${sortOrder.value}`)

function onSortChange(value: string): void {
  const [sort, order] = value.split('-') as ['name' | 'createdAt', 'asc' | 'desc']
  sortBy.value = sort
  sortOrder.value = order
  currentPage.value = 1
  fetchPlaces()
}

function onPageChange(page: number): void {
  currentPage.value = page
  fetchPlaces()
}

function openAddDialog(): void {
  selectedPlace.value = null
  addDialogOpen.value = true
}

function openEditDialog(place: Place): void {
  selectedPlace.value = place
  editDialogOpen.value = true
}

function openDeleteDialog(place: Place): void {
  selectedPlace.value = place
  deleteDialogOpen.value = true
}

async function handleCreate(payload: PlacePayload): Promise<void> {
  formLoading.value = true
  try {
    await createPlace(payload)
    addDialogOpen.value = false
  }
  finally {
    formLoading.value = false
  }
}

async function handleUpdate(payload: PlacePayload): Promise<void> {
  if (!selectedPlace.value) return
  formLoading.value = true
  try {
    await updatePlace(selectedPlace.value.id, payload)
    editDialogOpen.value = false
  }
  finally {
    formLoading.value = false
  }
}

async function handleDelete(): Promise<void> {
  if (!selectedPlace.value) return
  formLoading.value = true
  try {
    await deletePlace(selectedPlace.value.id)
    deleteDialogOpen.value = false
  }
  finally {
    formLoading.value = false
  }
}

onMounted(() => {
  fetchPlaces()
})
</script>

<style scoped>
.places-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.places-page__title {
  font-size: var(--font-size-2xl, 1.5rem);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.places-page__controls {
  display: flex;
  gap: var(--space-3);
}

.places-page__loading {
  display: flex;
  justify-content: center;
  padding: var(--space-8, 2rem);
}

.places-page__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-6);
  color: var(--color-danger);
  text-align: center;
}

.places-page__empty {
  text-align: center;
  padding: var(--space-8, 2rem);
  color: var(--color-text-secondary);
}

.places-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-4);
}

.places-page__delete-actions {
  display: flex;
  gap: var(--space-3);
}
</style>
