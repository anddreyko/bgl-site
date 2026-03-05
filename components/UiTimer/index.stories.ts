import type { Meta, StoryObj } from '@storybook/vue3'
import UiTimer from './index.vue'

const meta: Meta<typeof UiTimer> = {
  title: 'UI/UiTimer',
  component: UiTimer,
  tags: ['autodocs'],
  argTypes: {
    running: { control: 'boolean' },
  },
}
export default meta
type Story = StoryObj<typeof meta>

export const Running: Story = {
  args: {
    startedAt: new Date(Date.now() - 3661000).toISOString(),
    running: true,
  },
}

export const Stopped: Story = {
  args: {
    startedAt: new Date(Date.now() - 120000).toISOString(),
    running: false,
  },
}
