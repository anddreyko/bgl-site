import type { Meta, StoryObj } from '@storybook/vue3'
import UiSpinner from './index.vue'

const meta: Meta<typeof UiSpinner> = {
  title: 'UI/UiSpinner',
  component: UiSpinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { size: 'md' } }
export const Small: Story = { args: { size: 'sm' } }
export const Large: Story = { args: { size: 'lg' } }
