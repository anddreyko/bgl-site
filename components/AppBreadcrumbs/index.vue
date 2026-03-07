<template>
  <nav
    v-if="crumbs.length > 1"
    class="app-breadcrumbs"
    aria-label="Breadcrumb"
  >
    <ol class="app-breadcrumbs__list">
      <li
        v-for="(crumb, i) in crumbs"
        :key="crumb.path"
        class="app-breadcrumbs__item"
      >
        <NuxtLink
          v-if="i < crumbs.length - 1"
          :to="crumb.path"
          class="app-breadcrumbs__link"
        >
          {{ crumb.label }}
        </NuxtLink>
        <span
          v-else
          class="app-breadcrumbs__current"
          aria-current="page"
        >
          {{ crumb.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()
const { label: breadcrumbLabel } = useBreadcrumbLabel()

const segmentLabels: Record<string, string> = {
  game: 'Games',
  plays: 'Plays',
  mates: 'Mates',
  user: 'Profile',
  auth: 'Auth',
}

const segmentPaths: Record<string, string> = {
  user: '/user/me',
}

const collapsedPaths: Record<string, string> = {
  '/user/me': 'Profile',
}

function isUuidLike(s: string): boolean {
  return /^[\da-f-]{8,}$/i.test(s)
}

const crumbs = computed(() => {
  const collapsed = collapsedPaths[route.path]
  if (collapsed) {
    return [
      { path: '/', label: 'Home' },
      { path: route.path, label: collapsed },
    ]
  }

  const segments = route.path.split('/').filter(Boolean)
  const items = [{ path: '/', label: 'Home' }]

  let currentPath = ''
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    currentPath += `/${segment}`

    let label = segmentLabels[segment]
    if (!label && isUuidLike(segment)) {
      const isLast = i === segments.length - 1
      label = (isLast && breadcrumbLabel.value) ? breadcrumbLabel.value : segment.slice(0, 8)
    }
    label = label ?? segment

    items.push({ path: segmentPaths[segment] ?? currentPath, label })
  }

  return items
})
</script>

<style scoped>
.app-breadcrumbs {
  padding: var(--space-2) 0;
}

.app-breadcrumbs__list {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: var(--font-size-sm);
}

.app-breadcrumbs__item:not(:last-child)::after {
  content: '/';
  margin-left: var(--space-1);
  color: var(--color-text-disabled);
}

.app-breadcrumbs__link {
  color: var(--color-text-secondary);
  text-decoration: none;
}

.app-breadcrumbs__link:hover {
  color: var(--color-text-primary);
  text-decoration: underline;
}

.app-breadcrumbs__current {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}
</style>
