import type { Meta, StoryObj } from '@storybook/vue3'
import UiFloatingAction from './index.vue'

const meta: Meta<typeof UiFloatingAction> = {
  title: 'UI/UiFloatingAction',
  component: UiFloatingAction,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    active: { control: 'boolean' },
  },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: 'Record' },
}

export const Active: Story = {
  args: { label: 'Recording...', active: true },
}
