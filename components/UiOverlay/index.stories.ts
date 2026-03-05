import type { Meta, StoryObj } from '@storybook/vue3'
import UiOverlay from './index.vue'

const meta: Meta<typeof UiOverlay> = {
  title: 'UI/UiOverlay',
  component: UiOverlay,
  tags: ['autodocs'],
  render: args => ({
    components: { UiOverlay },
    setup() { return { args } },
    template: `
      <UiOverlay v-bind="args">
        <p>Overlay panel content goes here.</p>
      </UiOverlay>
    `,
  }),
}
export default meta
type Story = StoryObj<typeof meta>

export const Open: Story = {
  args: { open: true, title: 'Record play' },
}

export const Closed: Story = {
  args: { open: false, title: 'Hidden overlay' },
}
