import GameCard from './index.vue'

export default {
  title: 'Game card',
  component: GameCard,
}

export const Primary = {
  render: (args) => ({
    components: { GameCard },
    setup () {
      return { args }
    },
    template: '<GameCard v-bind="args" />',
  }),
  args: {
    game: {
      id: 42,
      title: 'Descent: Journeys in the Dark (Second Edition)',
      description: 'The Best Game of Year!',
      price: 200.99,
    },
  },
}
