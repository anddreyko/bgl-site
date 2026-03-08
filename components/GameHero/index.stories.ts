import type { Meta, StoryObj } from '@storybook/vue3'
import GameHero from './index.vue'

const meta: Meta<typeof GameHero> = {
  title: 'Domain/GameHero',
  component: GameHero,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof meta>

export const WithImage: Story = {
  args: {
    game: {
      id: 'g1',
      bggId: 174430,
      name: 'Gloomhaven',
      yearPublished: 2017,
      type: 'base' as const,
      minPlayers: 1,
      maxPlayers: 4,
      image: 'https://placehold.co/300x300?text=Gloomhaven',
    },
    stats: {
      totalPlays: 24,
      totalTimeMinutes: 2880,
      winRate: 67,
      plays: [],
      isApproximate: false,
    },
  },
}

export const WithoutImage: Story = {
  args: {
    game: {
      id: 'g2',
      bggId: 12345,
      name: 'Descent: Journeys in the Dark',
      yearPublished: 2012,
      type: 'base' as const,
      minPlayers: 1,
      maxPlayers: 5,
    },
    stats: {
      totalPlays: 8,
      totalTimeMinutes: 720,
      winRate: 50,
      plays: [],
      isApproximate: false,
    },
  },
}

export const NoStats: Story = {
  args: {
    game: {
      id: 'g3',
      bggId: 171,
      name: 'Chess',
      yearPublished: 1475,
      type: 'base' as const,
      minPlayers: 2,
      maxPlayers: 2,
    },
  },
}

export const Approximate: Story = {
  args: {
    game: {
      id: 'g4',
      bggId: 13,
      name: 'Catan',
      yearPublished: 1995,
      type: 'base' as const,
      minPlayers: 3,
      maxPlayers: 4,
    },
    stats: {
      totalPlays: 150,
      totalTimeMinutes: 9000,
      winRate: 42,
      plays: [],
      isApproximate: true,
    },
  },
}
