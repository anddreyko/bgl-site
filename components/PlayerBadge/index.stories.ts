import type { Meta, StoryObj } from '@storybook/vue3'
import PlayerBadge from './index.vue'

const meta: Meta<typeof PlayerBadge> = {
  title: 'Domain/PlayerBadge',
  component: PlayerBadge,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof meta>

export const WithScore: Story = {
  args: {
    player: {
      id: 'p1',
      mate: { id: 'mate-1', name: 'Alice' },
      score: 42,
      color: '#3b82f6',
      isWinner: false,
    },
  },
}

export const Winner: Story = {
  args: {
    player: {
      id: 'p2',
      mate: { id: 'mate-2', name: 'Bob' },
      score: 85,
      color: '#22c55e',
      isWinner: true,
    },
  },
}

export const Automa: Story = {
  args: {
    player: {
      id: 'p-automa',
      mate: { id: '00000000-0000-4000-a000-000000000002', name: 'Automa' },
      score: 45,
    },
  },
}

export const Anonymous: Story = {
  args: {
    player: {
      id: 'p-anon',
      mate: { id: '00000000-0000-4000-a000-000000000001', name: 'Anonymous' },
      score: 30,
      isWinner: true,
    },
  },
}

export const NoColor: Story = {
  args: {
    player: {
      id: 'p3',
      mate: { id: 'mate-3', name: 'Charlie' },
      score: 30,
    },
  },
}

export const Minimal: Story = {
  args: {
    player: {
      id: 'p4',
      mate: { id: 'mate-1', name: 'Unknown' },
    },
  },
}
