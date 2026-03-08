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
      mateId: 'mate-1',
      mateName: 'Alice',
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
      mateId: 'mate-2',
      mateName: 'Bob',
      score: 85,
      color: '#22c55e',
      isWinner: true,
    },
  },
}

export const NoColor: Story = {
  args: {
    player: {
      id: 'p3',
      mateId: 'mate-3',
      mateName: 'Charlie',
      score: 30,
    },
  },
}

export const Minimal: Story = {
  args: {
    player: {
      id: 'p4',
      mateId: 'mate-1',
    },
  },
}
