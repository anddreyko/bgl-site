import type { Meta, StoryObj } from '@storybook/vue3'
import PlayCard from './index.vue'

const meta: Meta<typeof PlayCard> = {
  title: 'Domain/PlayCard',
  component: PlayCard,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof meta>

export const Finished: Story = {
  args: {
    play: {
      id: 'play-1',
      name: 'Friday Night Session',
      status: 'finished',
      visibility: 'public' as const,
      startedAt: '2024-06-15T19:00:00Z',
      finishedAt: '2024-06-15T21:30:00Z',
      game: { id: 'g1', name: 'Gloomhaven' },
      author: { id: 'u1', name: 'John' },
      players: [
        { id: 'p1', mateId: 'mate-1', mateName: 'Alice', score: 42, color: '#3b82f6', isWinner: true },
        { id: 'p2', mateId: 'mate-2', mateName: 'Bob', score: 35, color: '#ef4444', isWinner: false },
      ],
    },
  },
}

export const InProgress: Story = {
  args: {
    play: {
      id: 'play-2',
      status: 'current',
      visibility: 'private' as const,
      startedAt: new Date(Date.now() - 3600000).toISOString(),
      game: { id: 'g2', name: 'Descent' },
      author: { id: 'u1', name: 'John' },
      players: [
        { id: 'p1', mateId: 'mate-1', mateName: 'Alice' },
        { id: 'p2', mateId: 'mate-2', mateName: 'Bob' },
        { id: 'p3', mateId: 'mate-3', mateName: 'Charlie' },
      ],
    },
  },
}

export const WithSystemMates: Story = {
  args: {
    play: {
      id: 'play-4',
      name: 'Solo vs Automa',
      status: 'finished',
      visibility: 'private' as const,
      startedAt: '2024-06-18T20:00:00Z',
      finishedAt: '2024-06-18T21:30:00Z',
      game: { id: 'g1', name: 'Scythe' },
      players: [
        { id: 'p1', mateId: 'mate-1', mateName: 'Alice', score: 50, isWinner: true },
        { id: 'p2', mateId: 'mate-sys-automa', mateName: 'Automa', score: 45, isWinner: false },
      ],
    },
  },
}

export const NoPlayers: Story = {
  args: {
    play: {
      id: 'play-3',
      name: 'Solo Run',
      status: 'finished',
      visibility: 'private' as const,
      startedAt: '2024-06-10T10:00:00Z',
      finishedAt: '2024-06-10T11:15:00Z',
      gameName: 'Spirit Island',
      players: [],
    },
  },
}
