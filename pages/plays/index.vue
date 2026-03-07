<template>
  <div class="plays-page">
    <div class="plays-page__header">
      <h2 class="plays-page__title">Plays</h2>
      <UiButton
        variant="record"
        @click="openRecord"
      >
        New Play
      </UiButton>
    </div>

    <UiSpinner
      v-if="loading"
      size="lg"
    />

    <p
      v-else-if="error"
      class="plays-page__error"
      role="alert"
    >
      {{ error }}
    </p>

    <p
      v-else-if="plays.length === 0"
      class="plays-page__empty"
    >
      No plays recorded yet. Start your first play!
    </p>

    <div
      v-else
      class="plays-page__list"
    >
      <PlayCard
        v-for="play in plays"
        :key="play.id"
        :play="play"

        @click="navigateTo(`/plays/${play.id}`)"
      />
    </div>

    <UiPagination
      v-if="!loading && plays.length > 0"
      :page="currentPage"
      :total="total"
      :size="pageSize"
      @update:page="onPageChange"
    />
  </div>
</template>

<script setup lang="ts">
import PlayCard from '~/components/PlayCard/index.vue'
import UiButton from '~/components/UiButton/index.vue'
import UiSpinner from '~/components/UiSpinner/index.vue'
import UiPagination from '~/components/UiPagination/index.vue'

definePageMeta({ middleware: 'auth' })

useHead({ title: '4Record > Plays' })

const { plays, total, currentPage, pageSize, loading, error, fetchPlays } = usePlays()
const { open: openRecord } = useRecordDialog()

async function onPageChange(page: number) {
  await fetchPlays({ page })
}

onMounted(async () => {
  await fetchPlays()
})
</script>

<style scoped>
.plays-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.plays-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.plays-page__title {
  margin: 0;
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.plays-page__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.plays-page__error {
  color: var(--color-danger);
  font-size: var(--font-size-md);
}

.plays-page__empty {
  color: var(--color-text-secondary);
  font-size: var(--font-size-md);
  text-align: center;
  padding: var(--space-8) 0;
}
</style>
