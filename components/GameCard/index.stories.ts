import GameCard from './index.vue'

export default {
  title: 'Game card',
  component: GameCard,
}

export const Primary = {
  render: (args: Record<string, unknown>) => ({
    components: { GameCard },
    setup() {
      return { args }
    },
    template: '<GameCard v-bind="args" />',
  }),
  args: {
    game: {
      id: 'abc-123',
      bggId: 13,
      name: 'Descent: Journeys in the Dark (Second Edition)',
      year: 2012,
      type: 'base',
    },
  },
}
