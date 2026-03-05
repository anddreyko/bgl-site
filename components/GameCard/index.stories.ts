import type { Meta, StoryObj } from '@storybook/vue3'
import GameCard from './index.vue'

const meta: Meta<typeof GameCard> = {
  title: 'Domain/GameCard',
  component: GameCard,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof meta>

export const WithImage: Story = {
  args: {
    game: {
      id: '1',
      name: 'Descent: Journeys in the Dark',
      year: 2012,
      bggId: 104162,
      type: 'base' as const,
      minPlayers: 1,
      maxPlayers: 5,
      image: 'https://placehold.co/300x300?text=Descent',
    },
  },
}

export const WithoutImage: Story = {
  args: {
    game: {
      id: '2',
      name: 'Gloomhaven',
      year: 2017,
      bggId: 174430,
      type: 'base' as const,
      minPlayers: 1,
      maxPlayers: 4,
    },
  },
}

export const Minimal: Story = {
  args: {
    game: {
      id: '3',
      name: 'Chess',
      bggId: 171,
      type: 'base' as const,
    },
  },
}
