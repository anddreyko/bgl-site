import { ref, computed, h } from 'vue'
import '../assets/css/main.css'

// Mock NuxtLink as a simple <a> tag
const NuxtLink = {
  name: 'NuxtLink',
  props: ['to', 'href'],
  setup(props, { slots }) {
    return () => h('a', { href: props.to || props.href || '#' }, slots.default?.())
  },
}

// Mock useMateNames composable (used by PlayerBadge, GamePlaysTable)
window.useMateNames = () => ({
  mateNames: computed(() => ({
    'mate-1': 'Alice',
    'mate-2': 'Bob',
    'mate-3': 'Charlie',
    'mate-4': 'Diana',
    'mate-5': 'Eve',
  })),
  mates: computed(() => [
    { id: 'mate-1', name: 'Alice', createdAt: '2024-01-01T00:00:00Z' },
    { id: 'mate-2', name: 'Bob', createdAt: '2024-02-01T00:00:00Z' },
    { id: 'mate-3', name: 'Charlie', createdAt: '2024-03-01T00:00:00Z' },
  ]),
})

// Mock useRoute (used by AppBreadcrumbs)
window.useRoute = () => ({
  path: '/game/abc12345-1234-1234-1234-123456789012',
  params: {},
  query: {},
})

// Mock useBreadcrumbLabel (used by AppBreadcrumbs)
window.useBreadcrumbLabel = () => ({
  label: ref('Gloomhaven'),
})

// Mock navigateTo (used by GamePlaysTable)
window.navigateTo = (path) => {
  console.log('[Storybook] navigateTo:', path)
}

// Mock useRecordDialog (used by RecordDialog)
window.useRecordDialog = () => {
  const isOpen = ref(true)
  return {
    isOpen,
    open: () => { isOpen.value = true },
    close: () => { isOpen.value = false },
  }
}

// Mock useActivePlay (used by RecordDialog)
window.useActivePlay = () => ({
  startPlay: async () => {},
})

export const parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

/** @type { import('@storybook/vue3').Preview } */
export default {
  parameters,
  decorators: [
    story => ({
      components: { story, NuxtLink },
      template: '<story />',
    }),
  ],
}
