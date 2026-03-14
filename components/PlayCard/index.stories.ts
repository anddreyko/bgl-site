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
        { id: 'p1', mate: { id: 'mate-1', name: 'Alice' }, score: 42, color: '#3b82f6', isWinner: true },
        { id: 'p2', mate: { id: 'mate-2', name: 'Bob' }, score: 35, color: '#ef4444', isWinner: false },
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
        { id: 'p1', mate: { id: 'mate-1', name: 'Alice' } },
        { id: 'p2', mate: { id: 'mate-2', name: 'Bob' } },
        { id: 'p3', mate: { id: 'mate-3', name: 'Charlie' } },
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
        { id: 'p1', mate: { id: 'mate-1', name: 'Alice' }, score: 50, isWinner: true },
        { id: 'p2', mate: { id: '00000000-0000-4000-a000-000000000002', name: 'Automa' }, score: 45, isWinner: false },
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
