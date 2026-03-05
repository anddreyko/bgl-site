import type { Meta, StoryObj } from '@storybook/vue3'
import UiDialog from './index.vue'

const meta: Meta<typeof UiDialog> = {
  title: 'UI/UiDialog',
  component: UiDialog,
  tags: ['autodocs'],
  render: args => ({
    components: { UiDialog },
    setup() { return { args } },
    template: `
      <UiDialog v-bind="args">
        <p>Dialog body content goes here.</p>
      </UiDialog>
    `,
  }),
}
export default meta
type Story = StoryObj<typeof meta>

export const Open: Story = {
  args: { open: true, title: 'Confirm action', description: 'Are you sure you want to proceed?' },
}

export const Closed: Story = {
  args: { open: false, title: 'Hidden dialog' },
}
