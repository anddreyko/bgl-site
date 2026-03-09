import type { Meta, StoryObj } from '@storybook/vue3'
import GamePlaysTable from './index.vue'

const meta: Meta<typeof GamePlaysTable> = {
  title: 'Domain/GamePlaysTable',
  component: GamePlaysTable,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    plays: [
      {
        id: 'play-1',
        name: 'Friday Night',
        visibility: 'public' as const,
        startedAt: '2024-06-15T19:00:00Z',
        finishedAt: '2024-06-15T21:30:00Z',
        players: [
          { id: 'p1', mateId: 'mate-1', mateName: 'Alice', score: 42, isWinner: true },
          { id: 'p2', mateId: 'mate-2', mateName: 'Bob', score: 35, isWinner: false },
          { id: 'p3', mateId: 'mate-3', mateName: 'Charlie', score: 28, isWinner: false },
        ],
      },
      {
        id: 'play-2',
        visibility: 'private' as const,
        startedAt: '2024-06-10T14:00:00Z',
        finishedAt: '2024-06-10T16:00:00Z',
        players: [
          { id: 'p4', mateId: 'mate-1', mateName: 'Alice', score: 55, isWinner: false },
          { id: 'p5', mateId: 'mate-2', mateName: 'Bob', score: 60, isWinner: true },
        ],
      },
      {
        id: 'play-3',
        visibility: 'private' as const,
        startedAt: new Date(Date.now() - 3600000).toISOString(),
        players: [
          { id: 'p6', mateId: 'mate-1', mateName: 'Alice' },
          { id: 'p7', mateId: 'mate-3', mateName: 'Charlie' },
        ],
      },
    ],
  },
}

export const WithSystemMates: Story = {
  args: {
    plays: [
      {
        id: 'play-5',
        name: 'Solo with Automa',
        visibility: 'private' as const,
        startedAt: '2024-06-18T20:00:00Z',
        finishedAt: '2024-06-18T21:30:00Z',
        players: [
          { id: 'p1', mateId: 'mate-1', mateName: 'Alice', score: 50, isWinner: true },
          { id: 'p2', mateId: 'mate-sys-automa', mateName: 'Automa', score: 45, isWinner: false },
        ],
      },
      {
        id: 'play-6',
        name: 'Anonymous Game',
        visibility: 'public' as const,
        startedAt: '2024-06-19T15:00:00Z',
        finishedAt: '2024-06-19T16:30:00Z',
        players: [
          { id: 'p3', mateId: 'mate-2', mateName: 'Bob', isWinner: false },
          { id: 'p4', mateId: 'mate-sys-anonymous', mateName: 'Anonymous', isWinner: true },
        ],
      },
    ],
  },
}

export const WithTeams: Story = {
  args: {
    plays: [
      {
        id: 'play-7',
        name: 'Team Battle',
        visibility: 'public' as const,
        startedAt: '2024-06-20T18:00:00Z',
        finishedAt: '2024-06-20T20:00:00Z',
        players: [
          { id: 'p1', mateId: 'mate-1', mateName: 'Alice', isWinner: true, teamTag: 'Red' },
          { id: 'p2', mateId: 'mate-2', mateName: 'Bob', isWinner: true, teamTag: 'Red' },
          { id: 'p3', mateId: 'mate-3', mateName: 'Charlie', isWinner: false, teamTag: 'Blue' },
          { id: 'p4', mateId: 'mate-4', mateName: 'Diana', isWinner: false, teamTag: 'Blue' },
        ],
      },
    ],
  },
}

export const ManyPlayers: Story = {
  args: {
    plays: [
      {
        id: 'play-4',
        name: 'Big Party',
        visibility: 'public' as const,
        startedAt: '2024-06-20T18:00:00Z',
        finishedAt: '2024-06-20T22:00:00Z',
        players: [
          { id: 'p1', mateId: 'mate-1', mateName: 'Alice', score: 50, isWinner: true },
          { id: 'p2', mateId: 'mate-2', mateName: 'Bob', score: 45 },
          { id: 'p3', mateId: 'mate-3', mateName: 'Charlie', score: 40 },
          { id: 'p4', mateId: 'mate-4', mateName: 'Diana', score: 38 },
          { id: 'p5', mateId: 'mate-5', mateName: 'Eve', score: 30 },
        ],
      },
    ],
  },
}

export const Empty: Story = {
  args: {
    plays: [],
  },
}
