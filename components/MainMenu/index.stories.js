import MainMenu from './index.vue'

export default {
  title: 'Main menu',
  component: MainMenu,
}

export const Primary = {
  render: (args) => ({
    components: { MainMenu },
    setup () {
      return { args }
    },
    template: '<MainMenu v-bind="args" />',
  }),
  args: {},
}
