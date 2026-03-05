<template>
  <div class="mates-page">
    <div class="mates-page__header">
      <h1 class="mates-page__title">My Mates</h1>
      <UiButton @click="openAddDialog">
        Add Mate
      </UiButton>
    </div>

    <div class="mates-page__controls">
      <UiSelect
        :model-value="sortValue"
        :options="sortOptions"
        @update:model-value="onSortChange"
      />
    </div>

    <div
      v-if="loading"
      class="mates-page__loading"
    >
      <UiSpinner size="lg" />
    </div>

    <div
      v-else-if="error"
      class="mates-page__error"
      role="alert"
    >
      <p>{{ error }}</p>
      <UiButton
        variant="secondary"
        @click="fetchMates"
      >
        Retry
      </UiButton>
    </div>

    <div
      v-else-if="mates.length === 0"
      class="mates-page__empty"
    >
      <p>No mates yet. Add your first mate to get started.</p>
    </div>

    <div
      v-else
      class="mates-page__grid"
    >
      <MateCard
        v-for="mate in mates"
        :key="mate.id"
        :mate="mate"
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
      title="Add Mate"
      @update:open="addDialogOpen = $event"
    >
      <MateForm
        :loading="formLoading"
        @submit="handleCreate"
        @cancel="addDialogOpen = false"
      />
    </UiDialog>

    <!-- Edit Dialog -->
    <UiDialog
      :open="editDialogOpen"
      title="Edit Mate"
      @update:open="editDialogOpen = $event"
    >
      <MateForm
        :mate="selectedMate ?? undefined"
        :loading="formLoading"
        @submit="handleUpdate"
        @cancel="editDialogOpen = false"
      />
    </UiDialog>

    <!-- Delete Confirmation Dialog -->
    <UiDialog
      :open="deleteDialogOpen"
      title="Delete Mate"
      :description="`Are you sure you want to delete ${selectedMate?.name ?? 'this mate'}? This action cannot be undone.`"
      @update:open="deleteDialogOpen = $event"
    >
      <div class="mates-page__delete-actions">
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
import type { Mate, MatePayload } from '~/types'
import { useMates } from '~/composables/useMates'
import MateCard from '~/components/MateCard/index.vue'
import MateForm from '~/components/MateForm/index.vue'
import UiButton from '~/components/UiButton/index.vue'
import UiDialog from '~/components/UiDialog/index.vue'
import UiPagination from '~/components/UiPagination/index.vue'
import UiSelect from '~/components/UiSelect/index.vue'
import UiSpinner from '~/components/UiSpinner/index.vue'

definePageMeta({ middleware: 'auth' })
useHead({ title: '4Record > My Mates' })

const {
  mates,
  total,
  totalPages,
  currentPage,
  pageSize,
  sortBy,
  sortOrder,
  loading,
  error,
  fetchMates,
  createMate,
  updateMate,
  deleteMate,
} = useMates()

const addDialogOpen = ref(false)
const editDialogOpen = ref(false)
const deleteDialogOpen = ref(false)
const selectedMate = ref<Mate | null>(null)
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
  fetchMates()
}

function onPageChange(page: number): void {
  currentPage.value = page
  fetchMates()
}

function openAddDialog(): void {
  selectedMate.value = null
  addDialogOpen.value = true
}

function openEditDialog(mate: Mate): void {
  selectedMate.value = mate
  editDialogOpen.value = true
}

function openDeleteDialog(mate: Mate): void {
  selectedMate.value = mate
  deleteDialogOpen.value = true
}

async function handleCreate(payload: MatePayload): Promise<void> {
  formLoading.value = true
  try {
    await createMate(payload)
    addDialogOpen.value = false
  }
  finally {
    formLoading.value = false
  }
}

async function handleUpdate(payload: MatePayload): Promise<void> {
  if (!selectedMate.value) return
  formLoading.value = true
  try {
    await updateMate(selectedMate.value.id, payload)
    editDialogOpen.value = false
  }
  finally {
    formLoading.value = false
  }
}

async function handleDelete(): Promise<void> {
  if (!selectedMate.value) return
  formLoading.value = true
  try {
    await deleteMate(selectedMate.value.id)
    deleteDialogOpen.value = false
  }
  finally {
    formLoading.value = false
  }
}

onMounted(() => {
  fetchMates()
})
</script>

<style scoped>
.mates-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  padding: var(--space-6);
  max-width: 960px;
  margin: 0 auto;
}

.mates-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.mates-page__title {
  font-size: var(--font-size-2xl, 1.5rem);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.mates-page__controls {
  display: flex;
  gap: var(--space-3);
}

.mates-page__loading {
  display: flex;
  justify-content: center;
  padding: var(--space-8, 2rem);
}

.mates-page__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-6);
  color: var(--color-danger);
  text-align: center;
}

.mates-page__empty {
  text-align: center;
  padding: var(--space-8, 2rem);
  color: var(--color-text-secondary);
}

.mates-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-4);
}

.mates-page__delete-actions {
  display: flex;
  gap: var(--space-3);
}
</style>
