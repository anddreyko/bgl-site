import type { Meta, StoryObj } from '@storybook/vue3'
import PlayForm from './index.vue'

const meta: Meta<typeof PlayForm> = {
  title: 'Domain/PlayForm',
  component: PlayForm,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof meta>

const mates = [
  { id: 'mate-1', name: 'Alice', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'mate-2', name: 'Bob', createdAt: '2024-02-01T00:00:00Z' },
  { id: 'mate-3', name: 'Charlie', createdAt: '2024-03-01T00:00:00Z' },
]

const systemMates = [
  { id: 'mate-sys-automa', name: 'Automa', isSystem: true, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'mate-sys-anonymous', name: 'Anonymous', isSystem: true, createdAt: '2024-01-01T00:00:00Z' },
]

const places = [
  { id: 'place-1', name: 'Home', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'place-2', name: 'Board Game Cafe', createdAt: '2024-02-01T00:00:00Z' },
]

export const Empty: Story = {
  args: { mates, systemMates, places },
}

export const WithInitialData: Story = {
  args: {
    mates,
    systemMates,
    places,
    initialData: {
      id: 'play-1',
      name: 'Friday Session',
      visibility: 'private' as const,
      startedAt: '2024-06-15T19:00:00Z',
      finishedAt: '2024-06-15T21:30:00Z',
      game: { id: 'g1', name: 'Gloomhaven' },
      players: [
        { id: 'p1', mateId: 'mate-1', score: 42, isWinner: true },
        { id: 'p2', mateId: 'mate-2', score: 35, isWinner: false },
      ],
    },
    submitLabel: 'Update Play',
  },
}

export const NoMates: Story = {
  args: { places },
}
