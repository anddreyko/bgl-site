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
        status: 'finished',
        visibility: 'public' as const,
        startedAt: '2024-06-15T19:00:00Z',
        finishedAt: '2024-06-15T21:30:00Z',
        players: [
          { id: 'p1', mate: { id: 'mate-1', name: 'Alice' }, score: 42, isWinner: true },
          { id: 'p2', mate: { id: 'mate-2', name: 'Bob' }, score: 35, isWinner: false },
          { id: 'p3', mate: { id: 'mate-3', name: 'Charlie' }, score: 28, isWinner: false },
        ],
      },
      {
        id: 'play-2',
        status: 'finished',
        visibility: 'private' as const,
        startedAt: '2024-06-10T14:00:00Z',
        finishedAt: '2024-06-10T16:00:00Z',
        players: [
          { id: 'p4', mate: { id: 'mate-1', name: 'Alice' }, score: 55, isWinner: false },
          { id: 'p5', mate: { id: 'mate-2', name: 'Bob' }, score: 60, isWinner: true },
        ],
      },
      {
        id: 'play-3',
        status: 'current',
        visibility: 'private' as const,
        startedAt: new Date(Date.now() - 3600000).toISOString(),
        players: [
          { id: 'p6', mate: { id: 'mate-1', name: 'Alice' } },
          { id: 'p7', mate: { id: 'mate-3', name: 'Charlie' } },
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
        status: 'finished',
        visibility: 'private' as const,
        startedAt: '2024-06-18T20:00:00Z',
        finishedAt: '2024-06-18T21:30:00Z',
        players: [
          { id: 'p1', mate: { id: 'mate-1', name: 'Alice' }, score: 50, isWinner: true },
          { id: 'p2', mate: { id: '00000000-0000-4000-a000-000000000002', name: 'Automa' }, score: 45, isWinner: false },
        ],
      },
      {
        id: 'play-6',
        name: 'Anonymous Game',
        status: 'finished',
        visibility: 'public' as const,
        startedAt: '2024-06-19T15:00:00Z',
        finishedAt: '2024-06-19T16:30:00Z',
        players: [
          { id: 'p3', mate: { id: 'mate-2', name: 'Bob' }, isWinner: false },
          { id: 'p4', mate: { id: '00000000-0000-4000-a000-000000000001', name: 'Anonymous' }, isWinner: true },
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
        status: 'finished',
        visibility: 'public' as const,
        startedAt: '2024-06-20T18:00:00Z',
        finishedAt: '2024-06-20T20:00:00Z',
        players: [
          { id: 'p1', mate: { id: 'mate-1', name: 'Alice' }, isWinner: true, teamTag: 'Red' },
          { id: 'p2', mate: { id: 'mate-2', name: 'Bob' }, isWinner: true, teamTag: 'Red' },
          { id: 'p3', mate: { id: 'mate-3', name: 'Charlie' }, isWinner: false, teamTag: 'Blue' },
          { id: 'p4', mate: { id: 'mate-4', name: 'Diana' }, isWinner: false, teamTag: 'Blue' },
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
        status: 'finished',
        visibility: 'public' as const,
        startedAt: '2024-06-20T18:00:00Z',
        finishedAt: '2024-06-20T22:00:00Z',
        players: [
          { id: 'p1', mate: { id: 'mate-1', name: 'Alice' }, score: 50, isWinner: true },
          { id: 'p2', mate: { id: 'mate-2', name: 'Bob' }, score: 45 },
          { id: 'p3', mate: { id: 'mate-3', name: 'Charlie' }, score: 40 },
          { id: 'p4', mate: { id: 'mate-4', name: 'Diana' }, score: 38 },
          { id: 'p5', mate: { id: 'mate-5', name: 'Eve' }, score: 30 },
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
